package mockhttpplugin

import (
	"hypeworks.com/yozora/plugins"
)

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("mock-http", map[string]plugins.PluginFunc{
		"start": func(args string) string {
			// just some random BS
			return `{"ok": true, "status": 200, "body": "Hello, World!"}`
		},
	})
}
