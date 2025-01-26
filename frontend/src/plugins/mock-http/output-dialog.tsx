import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquareTerminal } from "lucide-react";

// TODO: rather than just rawdogging the messages into the Textarea, we should parse them and display them in a more readable format
// NOTE: move this into the button to retain message history
function OutputDialogContent() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:6969/__YOZORA_WS__");
    wsRef.current = ws;

    // Handle incoming messages
    ws.onmessage = (event) => {
      const message = event.data;
      setMessages((prev) => [...prev, JSON.stringify(message)]);

      // Auto-scroll to the bottom of the textarea
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    };

    // Handle WebSocket errors
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Server Output</DialogTitle>
        <DialogDescription>
          Inspect incoming requests, and their headers and bodies.
        </DialogDescription>
      </DialogHeader>
      <div>
        <Textarea
          ref={textareaRef}
          className="w-full h-96 resize-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          readOnly
          value={messages.join("\n")} // Render messages in the Textarea
        />
      </div>
      <DialogFooter>
        <DialogDescription>History will be cleared when this popup is closed.</DialogDescription>
        <DialogClose asChild>
          <Button type="submit">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export default function OutputDialogButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button>
                <SquareTerminal />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" sideOffset={10}>
              <p>Server Output</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <OutputDialogContent />
      </DialogContent>
    </Dialog>
  );
}
