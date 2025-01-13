package loremipsumplugin

import (
	"fmt"

	"github.com/go-loremipsum/loremipsum"
	"hypeworks.com/yozora/plugins"
)

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("lorem-ipsum", map[string]plugins.PluginFunc{
		"generate": func(args ...interface{}) (interface{}, error) {
			// TODO: Add optional arguments for count, words, and paragraphs
			if len(args) != 1 {
				return nil, fmt.Errorf("generate expects 1 argument")
			}
			count, ok := args[0].(int)
			if !ok {
				return nil, fmt.Errorf("count must be an int")
			}
			return loremipsum.New().Words(count), nil
		},
	})
}
