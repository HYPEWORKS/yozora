package base64plugin

import (
	"encoding/base64"

	json "github.com/goccy/go-json"
	"hypeworks.com/yozora/plugins"
)

type Base64Input struct {
	Input string `json:"input"`
}

type Base64Output struct {
	Output string `json:"output"`
}

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("base64", map[string]plugins.PluginFunc{
		"encode": func(args string) string {
			var input Base64Input
			err := json.Unmarshal([]byte(args), &input)
			if err != nil {
				return pm.Errorf("failed to unmarshal input: %v", err)
			}

			output := base64.StdEncoding.EncodeToString([]byte(input.Input))

			result := Base64Output{
				Output: output,
			}

			resultBytes, err := json.Marshal(result)

			if err != nil {
				return pm.Errorf("failed to marshal result: %v", err)
			}

			return string(resultBytes)
		},
		"decode": func(args string) string {
			var input Base64Input
			err := json.Unmarshal([]byte(args), &input)
			if err != nil {
				return pm.Errorf("failed to unmarshal input: %v", err)
			}

			output, err := base64.StdEncoding.DecodeString(input.Input)
			if err != nil {
				return pm.Errorf("failed to decode input: %v", err)
			}

			result := Base64Output{
				Output: string(output),
			}

			resultBytes, err := json.Marshal(result)

			if err != nil {
				return pm.Errorf("failed to marshal result: %v", err)
			}

			return string(resultBytes)
		},
	})
}
