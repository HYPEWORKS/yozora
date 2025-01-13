package base64plugin

import (
	"encoding/base64"
	"fmt"

	"hypeworks.com/yozora/plugins"
)

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("base64", map[string]plugins.PluginFunc{
		"encode": func(args ...interface{}) (interface{}, error) {
			if len(args) < 1 {
				return nil, fmt.Errorf("encode expects at least 1 argument")
			}

			var input string

			// Check if the first argument is a string
			if str, ok := args[0].(string); ok {
				input = str
			} else {
				// Handle array-like input
				if slice, ok := args[0].([]interface{}); ok && len(slice) > 0 {
					if str, ok := slice[0].(string); ok {
						input = str
					} else {
						return nil, fmt.Errorf("invalid input type in array: %#v", slice[0])
					}
				} else {
					return nil, fmt.Errorf("input is not a string or array of strings")
				}
			}

			return base64.StdEncoding.EncodeToString([]byte(input)), nil
		},
		"decode": func(args ...interface{}) (interface{}, error) {
			if len(args) < 1 {
				return nil, fmt.Errorf("decode expects at least 1 argument")
			}

			// Handle single string input
			if input, ok := args[0].(string); ok {
				decoded, err := base64.StdEncoding.DecodeString(input)
				if err != nil {
					return nil, fmt.Errorf("failed to decode input: %v", err)
				}
				return string(decoded), nil
			}

			// Handle array of strings for batch decoding
			if slice, ok := args[0].([]interface{}); ok {
				results := []string{}
				for _, item := range slice {
					if str, ok := item.(string); ok {
						decoded, err := base64.StdEncoding.DecodeString(str)
						if err != nil {
							return nil, fmt.Errorf("failed to decode input '%s': %v", str, err)
						}
						results = append(results, string(decoded))
					} else {
						return nil, fmt.Errorf("invalid input type in array: %#v", item)
					}
				}
				return results, nil // Return decoded results as an array
			}

			return nil, fmt.Errorf("input is not a string or array of strings")
		},
	})
}
