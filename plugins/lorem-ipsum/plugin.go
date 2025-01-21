package loremipsumplugin

import (
	"github.com/go-loremipsum/loremipsum"
	"hypeworks.com/yozora/plugins"
)

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("lorem-ipsum", map[string]plugins.PluginFunc{
		"generate": func(args string) string {
			// TODO: Add optional arguments for count, words, and paragraphs
			if len(args) != 1 {
				return pm.Errorf("generate expects 1 argument")
			}
			count, ok := 10, true // lmao what
			if !ok {
				return pm.Errorf("count must be an int")
			}
			return loremipsum.New().Words(count)
		},
	})
}
