package main

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"hypeworks.com/yozora/plugins"

	base64plugin "hypeworks.com/yozora/plugins/base64"
	loremipsumplugin "hypeworks.com/yozora/plugins/lorem-ipsum"
	mockhttpplugin "hypeworks.com/yozora/plugins/mock-http"
	qrcodeplugin "hypeworks.com/yozora/plugins/qr-code"
)

// App struct
type App struct {
	ctx           context.Context
	pluginManager *plugins.PluginManager
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	a.pluginManager = plugins.NewPluginManager(a.ctx)

	// Register the plugins
	base64plugin.Register(a.pluginManager)
	loremipsumplugin.Register(a.pluginManager)
	qrcodeplugin.Register(a.pluginManager)
	mockhttpplugin.Register(a.pluginManager)
}

func (a *App) OnAppStarted() {
	fmt.Println("App started!")
	runtime.WindowShow(a.ctx)
}

func (a *App) GenerateUUID() string {
	return uuid.New().String()
}

// Get a list of registered plugin ids so that we know what we can call
func (a *App) GetRegisteredPlugins() []string {
	return a.pluginManager.GetRegisteredPlugins()
}

func (a *App) CallPlugin(pluginID, functionName string, args string) string {
	return a.pluginManager.Call(pluginID, functionName, args)
}
