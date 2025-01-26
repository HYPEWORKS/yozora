import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { CallPlugin } from "../../../wailsjs/go/main/App";
import { useToast } from "@/hooks/use-toast";

interface StartButtonProps {
  isRunning: boolean;
  onToggle: (running: boolean) => void;
}

export function StartButton({ isRunning, onToggle }: StartButtonProps) {
  const { toast } = useToast();

  const [isWaiting, setIsWaiting] = useState(false);

  const handleClick = async () => {
    setIsWaiting(true);

    if (isRunning) {
      await CallPlugin("mock-http", "stop", "");
      setIsWaiting(false);
      onToggle(false);

      toast({
        title: "Stopped",
        description: "The server has been stopped.",
        duration: 2000,
      });

      return;
    }

    const res = await CallPlugin("mock-http", "start", `{ "port": 6969 }`);

    // TODO: type this properly using the zod schema
    const result = JSON.parse(res);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        duration: 2000,
      });

      setIsWaiting(false);
      return;
    }

    toast({
      title: "Started",
      description: "The server has been started.",
      duration: 2000,
    });

    setIsWaiting(false);
    onToggle(true);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isWaiting}
      className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow",
        isRunning
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      )}
    >
      {isWaiting && (
        <div
          className="absolute inset-0 rounded-full border-2 border-t-transparent border-white animate-spin"
          style={{
            animationDuration: "750ms",
          }}
        />
      )}
      {isRunning ? <Square size={24} /> : <Play size={24} />}
    </Button>
  );
}
