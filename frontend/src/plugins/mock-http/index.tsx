"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StartButton } from "./start-button";
import { ControlPanel } from "./control-panel";
import OutputDialogButton from "./output-dialog";
import { Provider } from "jotai";

export default function MockHTTP() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStop = (running: boolean) => {
    setIsRunning(running);
  };

  return (
    <Provider>
      <div className="h-full flex flex-col">
        <Card className="w-full max-w-4xl mx-auto flex-grow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Mock HTTP Server Configuration
            </CardTitle>
            {isRunning && <OutputDialogButton />}
            <StartButton isRunning={isRunning} onToggle={handleStartStop} />
          </CardHeader>
          <CardContent className="overflow-y-auto flex-grow">
            <ControlPanel isRunning={isRunning} />
          </CardContent>
        </Card>
      </div>
    </Provider>
  );
}
