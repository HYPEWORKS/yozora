package qrcodeplugin

import (
	"encoding/base64"
	"os"

	json "github.com/goccy/go-json"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"hypeworks.com/yozora/plugins"
)

type QRCodeInput struct {
	ImageBlob string `json:"imageBlob"`
}

type QRCodeOutput struct {
	Ok bool `json:"ok"`
}

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("qr-code", map[string]plugins.PluginFunc{
		"save": func(args string) string {
			var input QRCodeInput
			err := json.Unmarshal([]byte(args), &input)

			if err != nil {
				return pm.Errorf("failed to unmarshal input: %v", err)
			}

			// decode the base64 string
			blob, err := base64.StdEncoding.DecodeString(input.ImageBlob)

			if err != nil {
				return pm.Errorf("failed to decode input: %v", err)
			}

			// show the save file dialog
			options := runtime.SaveDialogOptions{
				Title: "Save QR Code",
				Filters: []runtime.FileFilter{
					{
						DisplayName: "PNG Files",
						Pattern:     "*.png",
					},
				},
				CanCreateDirectories: true,
			}

			filePath, saveFileError := runtime.SaveFileDialog(pm.Context, options)

			if filePath == "" {
				return pm.FromError("No file selected")
			}

			if saveFileError != nil {
				return pm.FromError(saveFileError.Error())
			}

			// save the file
			file, fileCreateError := os.Create(filePath)

			if fileCreateError != nil {
				return pm.FromError(fileCreateError.Error())
			}

			defer file.Close()

			_, writeError := file.Write(blob)

			if writeError != nil {
				return pm.FromError(writeError.Error())
			}

			file.Sync()

			var output QRCodeOutput
			output.Ok = true

			outputBytes, err := json.Marshal(output)

			if err != nil {
				return pm.Errorf("failed to marshal result: %v", err)
			}

			return string(outputBytes)
		},
	})
}
