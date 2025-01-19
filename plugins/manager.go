package plugins

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type PluginFunc func(args ...interface{}) (interface{}, error)

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

func (pm *PluginManager) Call(pluginID, functionName string, args ...interface{}) (interface{}, error) {
	if plugin, exists := pm.plugins[pluginID]; exists {
		if function, exists := plugin[functionName]; exists {
			return function(args...)
		}
		return nil, fmt.Errorf("function '%s' not found in plugin '%s'", functionName, pluginID)
	}
	return nil, fmt.Errorf("plugin '%s' not found", pluginID)
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
