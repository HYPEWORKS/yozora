import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { RouteConfig } from "./route-config";
import { ServerConfigAtom, Endpoint } from "./schema";
import { useAtom } from "jotai";

interface ControlPanelProps {
  isRunning: boolean;
}

export function ControlPanel({ isRunning }: ControlPanelProps) {
  const [serverConfig, setServerConfig] = useAtom(ServerConfigAtom);

  // Use `serverConfig.endpoints` as the source of truth for the routes.
  const routes = serverConfig.endpoints || [];

  const setRoutes = (updatedRoutes: Endpoint[]) => {
    setServerConfig({ ...serverConfig, endpoints: updatedRoutes });
  };

  const addRoute = () => {
    setRoutes([
      ...routes,
      {
        path: "/",
        method: "GET",
        mockData: { type: "json", content: "{}" },
        statusCode: 200,
        headers: {},
      },
    ]);
  };

  const removeRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index));
  };

  const updateRoute = (index: number, updatedRoute: Endpoint) => {
    const newRoutes = [...routes];
    newRoutes[index] = updatedRoute;
    setRoutes(newRoutes);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerConfig({ ...serverConfig, port: parseInt(e.target.value, 10) || 0 });
  };

  return (
    <Tabs defaultValue="routes" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
        <TabsTrigger value="routes">Routes</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="routes" className="overflow-y-auto max-h-[calc(95vh-18rem)]">
        <div className="space-y-4">
          {routes.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">
              No routes added. A default <pre className="inline">GET</pre> route at the root (<pre className="inline">/</pre>) will be added. It will return lorem ipsum data with a status code of 200.
            </div>
          )}
          {routes.map((route, index) => (
            <RouteConfig
              key={index}
              route={route}
              onDelete={() => removeRoute(index)}
              onUpdate={(updatedRoute) => updateRoute(index, updatedRoute)}
              isRunning={isRunning}
            />
          ))}
          <Button onClick={addRoute} className="w-full" disabled={isRunning}>
            <Plus className="mr-2 h-4 w-4" /> Add Route
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="space-y-4">
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              value={serverConfig.port || ""}
              onChange={handlePortChange}
              placeholder="6969"
              disabled={isRunning}
            />
          </div>
          {/* Add more settings here if needed */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
