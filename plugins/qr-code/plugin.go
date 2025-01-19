package qrcodeplugin

import (
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"hypeworks.com/yozora/plugins"
)

func Register(pm *plugins.PluginManager) {
	pm.RegisterPlugin("qr-code", map[string]plugins.PluginFunc{
		"save": func(args ...interface{}) (interface{}, error) {
			if len(args) != 1 {
				return nil, fmt.Errorf("save expects exactly 1 argument")
			}

			// Check if the argument is a slice of interface{}
			byteSlice, ok := args[0].([]interface{})
			if !ok {
				return nil, fmt.Errorf("input is not a valid array of bytes: %#v", args[0])
			}

			// Convert the slice of interface{} to a slice of bytes
			blob := make([]byte, len(byteSlice))
			for i, v := range byteSlice {
				// Wails serializes numbers as float64
				b, ok := v.(float64)
				if !ok {
					return nil, fmt.Errorf("invalid byte value at index %d: %#v", i, v)
				}
				blob[i] = byte(b) // Convert float64 to byte
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

			if saveFileError != nil {
				return nil, saveFileError
			}

			// save the file
			file, fileCreateError := os.Create(filePath)

			if fileCreateError != nil {
				return nil, fileCreateError
			}

			defer file.Close()

			_, writeError := file.Write(blob)

			if writeError != nil {
				return nil, writeError
			}

			file.Sync()

			return nil, nil
		},
	})
}
