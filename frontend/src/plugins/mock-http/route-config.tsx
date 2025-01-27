import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { Endpoint, MockDataContentType } from "./schema"

interface RouteConfigProps {
  route: Endpoint;
  onDelete: () => void;
  onUpdate: (updatedRoute: Endpoint) => void;
  isRunning: boolean;
}

export function RouteConfig({ route, onDelete, onUpdate, isRunning }: RouteConfigProps) {
  const handleFieldChange = (field: keyof Endpoint, value: any) => {
    onUpdate({ ...route, [field]: value });
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <Label htmlFor="method">Method</Label>
            <Select value={route.method} onValueChange={(e) => handleFieldChange("path", e)} disabled={isRunning}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-5">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              value={route.path}
              onChange={(e) => handleFieldChange("path", e.target.value)}
              placeholder="/api/example"
              disabled={isRunning}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="statusCode">Status</Label>
            <Input
              id="statusCode"
              value={route.statusCode}
              type="number"
              onChange={(e) => handleFieldChange("statusCode", parseInt(e.target.value, 10))}
              placeholder="200"
              disabled={isRunning}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="contentType">Content</Label>
            <Select
              value={route.mockData.type}
              onValueChange={(e) => handleFieldChange("mockData", { ...route.mockData, type: e as MockDataContentType })}
              disabled={isRunning}
            >
              <SelectTrigger id="contentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lorem">Lorem</SelectItem>
                <SelectItem value="faker">Faker</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="destructive" size="icon" className="mt-4" onClick={onDelete} disabled={isRunning}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

