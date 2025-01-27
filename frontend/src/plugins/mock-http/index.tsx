"use client";

import { useState } from "react";
import { Provider, createStore } from "jotai";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StartButton } from "./start-button";
import { ControlPanel } from "./control-panel";
import OutputDialogButton from "./output-dialog";

const store = createStore();

export default function MockHTTP() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStop = (running: boolean) => {
    setIsRunning(running);
  };

  return (
    <Provider store={store}>
      <div className="h-full flex flex-col">
        <Card className="w-full max-w-4xl mx-auto flex-grow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                Mock HTTP Server Configuration
              </CardTitle>
              <CardDescription>
                Due to a skill issue, there can only be one mock
                server running at a time.
              </CardDescription>
            </div>
            {/* TODO: Save and import buttons */}
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
