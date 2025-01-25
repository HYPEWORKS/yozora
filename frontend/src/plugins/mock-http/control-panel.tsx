import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { RouteConfig } from "./route-config";

interface ControlPanelProps {
  isRunning: boolean;
}

export function ControlPanel({ isRunning }: ControlPanelProps) {
  const [port, setPort] = useState("6969");
  const [routes, setRoutes] = useState([{}]);

  const addRoute = () => {
    setRoutes([...routes, {}]);
  };

  const removeRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index));
  };

  return (
    <Tabs defaultValue="routes" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
        <TabsTrigger value="routes">Routes</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="routes" className="overflow-y-auto max-h-[calc(95vh-18rem)]">
        <div className="space-y-4">
          {routes.map((_, index) => (
            <RouteConfig
              key={index}
              onDelete={() => removeRoute(index)}
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
              value={port}
              onChange={(e) => setPort(e.target.value)}
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
