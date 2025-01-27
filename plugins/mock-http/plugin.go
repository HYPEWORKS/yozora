package mockhttpplugin

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"sync"

	json "github.com/goccy/go-json"

	"hypeworks.com/yozora/plugins"

	"github.com/go-loremipsum/loremipsum"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

// TODO: make this support multiple instances (aka multiple tabs in the frontend)

var (
	server     *http.Server
	serverLock sync.Mutex
	isRunning  bool

	wsClients   = make(map[*websocket.Conn]bool)
	wsClientsMu sync.Mutex
)

type MockData struct {
	Type    string `json:"type"` // "text", "json", "xml"
	Content string `json:"content"`
}

type Method struct {
	MockData   MockData          `json:"mockData"`
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers,omitempty"`
}

type Endpoint struct {
	Path       string            `json:"path"`
	Method     string            `json:"method"` // "GET", "POST", "PUT", "PATCH", "DELETE"
	MockData   MockData          `json:"mockData"`
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers,omitempty"`
}

type ProxyInput struct {
	URL string `json:"url"`
}

type MockHTTPInput struct {
	Version   string      `json:"version"`
	Port      int         `json:"port"`
	Proxy     *ProxyInput `json:"proxy,omitempty"`
	Endpoints []Endpoint  `json:"endpoints"`
}

type MockHTTPOutput struct {
	Ok        bool   `json:"ok"`
	IsRunning *bool  `json:"is_running,omitempty"`
	Error     string `json:"error,omitempty"`
}

func broadcastToClients(message string) {
	wsClientsMu.Lock()
	defer wsClientsMu.Unlock()

	for client := range wsClients {
		go func(c *websocket.Conn) {
			err := websocket.Message.Send(c, message)
			if err != nil {
				fmt.Printf("Error sending message: %v\n", err)
				c.Close()
				delete(wsClients, c)
			}
		}(client)
	}
}

func requestBroadcastMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract request details
		headers := c.Request().Header

		// Read the request body
		bodyBytes, err := io.ReadAll(c.Request().Body)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to read request body"})
		}
		// Reset the request body so it can be read again
		c.Request().Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		// Create a message to broadcast
		message := map[string]interface{}{
			"headers": headers,
			"body":    string(bodyBytes),
			"path":    c.Path(),
			"method":  c.Request().Method,
		}
		messageJSON, _ := json.Marshal(message)

		// Broadcast to WebSocket clients
		broadcastToClients(string(messageJSON))

		// Proceed with the next handler
		return next(c)
	}
}

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("mock-http", map[string]plugins.PluginFunc{
		"start": func(args string) string {
			serverLock.Lock()
			defer serverLock.Unlock()

			if isRunning {
				return `{"ok": false, "error": "Server is already running"}`
			}

			var params MockHTTPInput
			if err := json.Unmarshal([]byte(args), &params); err != nil {
				return pm.Errorf("Invalid JSON: %v", err)
			}

			// Default to port 8080 if not provided
			port := params.Port
			if port == 0 {
				port = 8080
			}

			e := echo.New()

			e.Use(requestBroadcastMiddleware)

			// WebSocket endpoint for live logging
			e.GET("/__YOZORA_WS__", func(c echo.Context) error {
				websocket.Handler(func(ws *websocket.Conn) {
					wsClientsMu.Lock()
					wsClients[ws] = true
					wsClientsMu.Unlock()

					defer func() {
						wsClientsMu.Lock()
						delete(wsClients, ws)
						wsClientsMu.Unlock()
						ws.Close()
					}()

					// Keep the WebSocket connection open
					for {
						msg := ""
						err := websocket.Message.Receive(ws, &msg)
						if err != nil {
							fmt.Printf("WebSocket error: %v\n", err)
							pm.Errorf("WebSocket error: %v", err)
							break
						}
					}
				}).ServeHTTP(c.Response(), c.Request())
				return nil
			})

			if len(params.Endpoints) == 0 {
				e.GET("/", func(c echo.Context) error {
					return c.String(http.StatusOK, loremipsum.New().Words(12))
				})
			} else {
				for _, ep := range params.Endpoints {
					endpoint := ep
					switch endpoint.Method {
					case "GET":
						e.GET(endpoint.Path, func(c echo.Context) error {
							return c.JSON(endpoint.StatusCode, endpoint.MockData)
						})
					case "POST":
						e.POST(endpoint.Path, func(c echo.Context) error {
							return c.JSON(endpoint.StatusCode, endpoint.MockData)
						})
					case "PUT":
						e.PUT(endpoint.Path, func(c echo.Context) error {
							return c.JSON(endpoint.StatusCode, endpoint.MockData)
						})
					case "PATCH":
						e.PATCH(endpoint.Path, func(c echo.Context) error {
							return c.JSON(endpoint.StatusCode, endpoint.MockData)
						})
					case "DELETE":
						e.DELETE(endpoint.Path, func(c echo.Context) error {
							return c.JSON(endpoint.StatusCode, endpoint.MockData)
						})
					default:
						return pm.Errorf("Invalid method: %s", endpoint.Method)
					}
				}
			}

			server = &http.Server{
				Addr:    fmt.Sprintf(":%d", port),
				Handler: e,
			}

			go func() {
				isRunning = true
				defer func() { isRunning = false }()

				if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					e.Logger.Error("Error starting server: ", err)

					pm.Errorf("Error starting server: %v", err)
				}
			}()

			return fmt.Sprintf(`{"ok": true, "status": 200, "message": "Server started on port %d"}`, port)
		},
		"get-status": func(args string) string {
			serverLock.Lock()
			defer serverLock.Unlock()

			if isRunning {
				return `{"ok": true, "status": 200, "is_running": true}`
			}

			return `{"ok": true, "status": 200, "is_running": false}`
		},
		"stop": func(args string) string {
			serverLock.Lock()
			defer serverLock.Unlock()

			if !isRunning {
				return pm.Errorf("Server is not running")
			}

			if err := server.Close(); err != nil {
				return pm.Errorf("Failed to stop server: %v", err)
			}

			isRunning = false
			return `{"ok": true, "message": "Server stopped"}`
		},
	})
}
