package plugins

import (
	"context"
	"fmt"

	json "github.com/goccy/go-json"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type PluginFunc func(args string) string

type PluginManager struct {
	plugins map[string]map[string]PluginFunc

	// The Context from Wails to call runtime functions
	Context context.Context
}

func NewPluginManager(ctx context.Context) *PluginManager {
	return &PluginManager{
		plugins: make(map[string]map[string]PluginFunc),
		Context: ctx,
	}
}

func (pm *PluginManager) RegisterPlugin(pluginID string, functions map[string]PluginFunc) {
	pm.plugins[pluginID] = functions
}

func (pm *PluginManager) Call(pluginID, functionName string, args string) string {
	if plugin, exists := pm.plugins[pluginID]; exists {
		if function, exists := plugin[functionName]; exists {
			return function(args)
		}
		return pm.Errorf("function '%s' not found in plugin '%s'", functionName, pluginID)
	}
	return pm.Errorf("plugin '%s' not found", pluginID)
}

func (pm *PluginManager) GetRegisteredPlugins() []string {
	plugins := make([]string, 0, len(pm.plugins))
	for plugin := range pm.plugins {
		plugins = append(plugins, plugin)
	}
	return plugins
}

func (pm *PluginManager) LogPrintf(format string, args ...interface{}) {
	runtime.LogPrintf(pm.Context, format, args...)
}

// takes an Errorf call and converts to a JSON string so the frontend can display it
func (pm *PluginManager) Errorf(format string, args ...interface{}) string {
	pm.LogPrintf(format, args...)
	errorMessage := fmt.Sprintf(format, args...)
	errorJSON, _ := json.Marshal(map[string]string{
		"error": errorMessage,
	})

	return string(errorJSON)
}

func (pm *PluginManager) FromError(errorString string) string {
	runtime.LogPrint(pm.Context, errorString)

	errorJSON, _ := json.Marshal(map[string]string{
		"error": errorString,
	})

	return string(errorJSON)
}
