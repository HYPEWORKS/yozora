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
import CharmBar from "@/components/CharmBar";
import TabBar, { Tab } from "@/components/TabBar";
import { Toaster } from "./components/ui/toaster";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

function App() {
  const [availablePluginIDs, setAvailablePluginIDs] = useState<string[]>([]);
  const updateAvailablePluginIDs = (registeredBackendPluginIDs: string[]) => {
    const allPluginIDs = [
      ...registeredBackendPluginIDs,
      ...getRegisteredFrontendPlugins(),
    ].sort((a, b) => {
      const pluginA = plugins[a];
      const pluginB = plugins[b];
      return (pluginA.order ?? 0) - (pluginB.order ?? 0);
    });

    setAvailablePluginIDs(allPluginIDs);
  };
  const [selectedPluginID, setSelectedPluginID] = useState<string | null>(null);

  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, label: "Start" },
    // { id: 2, label: "JSON Tools" },
    // { id: 3, label: "Base64 Encode/Decode" },
    // { id: 4, label: "Lorem Ipsum" },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(tabs[0].id);

  const handleChangeTab = (id: number) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (id: number) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    // If the closed tab was active, switch to another one
    if (id === activeTabId && tabs.length > 1) {
      const nextActive = tabs.find((t) => t.id !== id);
      if (nextActive) setActiveTabId(nextActive.id);
    }

    // If the closed tab was the last one, create a new one
    if (id === activeTabId && tabs.length === 1) {
      const newTab = { id: 1, label: "Start" };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const handleNewTab = () => {
    const newId = Math.max(...tabs.map((t) => t.id)) + 1;
    const newTab = { id: newId, label: `Untitled-${newId}.txt` }; // TODO: make this more dynamic
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

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

  // Start up the app and get the list of registered plugins
  useEffect(() => {
    setTimeout(() => {
      OnAppStarted().then(() => {
        GetRegisteredPlugins().then(updateAvailablePluginIDs);
      });
    }, 0);
  }, []);

  const [commandOpen, setCommandOpen] = useState(false);

  // Shortcut handling to open/close the command dialog
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <span>
        <CharmBar />
        <TabBar
          className="ml-16"
          tabs={tabs}
          activeTabId={activeTabId}
          onChangeTab={handleChangeTab}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
        />
      </span>
      <main className="ml-16 flex flex-col min-h-fit p-3">
        <div>
          <Select onValueChange={setSelectedPluginID}>
            <SelectTrigger className="w-96 relative">
              <SelectValue placeholder="Select a plugin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availablePluginIDs.map((pluginID) => {
                  const plugin = plugins[pluginID];
                  return (
                    <SelectItem
                      key={pluginID}
                      value={pluginID}
                      className="relative flex items-center"
                    >
                      <span className="flex-grow">{plugin.name}</span>
                      {plugin.beta && (
                        <span className="absolute left-[19rem] text-xs p-1 bg-orange-500 text-white">
                          Beta
                        </span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="@container/plugin pt-6">
            {pluginComponent && (
              <Suspense fallback={<div>Loading...</div>}>
                {pluginComponent}
              </Suspense>
            )}
          </div>
        </div>
      </main>
      <Toaster />
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Commands">
              {availablePluginIDs.map((pluginID) => {
                const plugin = plugins[pluginID];
                return <CommandItem key={pluginID}>{plugin.name}</CommandItem>;
              })}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export default App;
