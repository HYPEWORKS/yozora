import { useEffect, useState, useMemo, Suspense } from "react";
import { OnAppStarted, GetRegisteredPlugins } from "../wailsjs/go/main/App";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import plugins, { getRegisteredFrontendPlugins } from "./plugins";
import React from "react";
import CharmBar from "./components/CharmBar";

function App() {
  const [availablePluginIDs, setAvailablePluginIDs] = useState<string[]>([]);
  const updateAvailablePluginIDs = (registeredBackendPluginIDs: string[]) => {
    const allPluginIDs = [
      ...registeredBackendPluginIDs,
      ...getRegisteredFrontendPlugins(),
    ];
    
    setAvailablePluginIDs(allPluginIDs);
  }
  const [selectedPluginID, setSelectedPluginID] = useState<string | null>(null);

  const pluginComponent = useMemo(() => {
    if (!selectedPluginID) {
      return null;
    }

    const plugin = plugins[selectedPluginID];
    if (!plugin) {
      return null;
    }

    return React.createElement(plugin.component);
  }, [selectedPluginID]);

  useEffect(() => {
    setTimeout(() => {
      OnAppStarted().then(() => {
        GetRegisteredPlugins().then(updateAvailablePluginIDs);
      });
    }, 0);
  }, []);

  return (
    <>
      <CharmBar />
      <main className="ml-16 flex flex-col min-h-svh p-3">
        <h1 className="text-2xl text-center pb-6">Hello Yozora!</h1>
        <div>
          <Select onValueChange={setSelectedPluginID}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a plugin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availablePluginIDs.map((pluginID) => {
                  const plugin = plugins[pluginID];
                  return (
                    <SelectItem key={pluginID} value={pluginID}>
                      {plugin.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="@container/plugin">
            {pluginComponent && (
              <Suspense fallback={<div>Loading...</div>}>
                {pluginComponent}
              </Suspense>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
