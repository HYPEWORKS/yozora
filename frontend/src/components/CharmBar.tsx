import { Cog } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

function SettingsCharm({ className }: { className?: string }) {
  // This state is literally only used to keep the icon highlight color when the dropdown is open because we have the icon wrapped in a tooltip
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Cog size={28} className={cn("cursor-pointer text-gray-400 hover:text-white transition-all duration-200", isOpen ? "text-white" : "", className)} />
            </TooltipTrigger>
            <TooltipContent side="right" align="center" sideOffset={10}>
              <p>Settings</p>
              <TooltipArrow width={12} height={10} />
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Check for Updates...</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Something else</DropdownMenuItem>
          <DropdownMenuItem>Another thing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>About...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function CharmBar() {
  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 h-dvh min-h-dvh max-h-dvh w-16 bg-gray-800 text-white flex flex-col items-center justify-between py-3">
        <div className="flex flex-col items-center gap-2">
          {/* Other charms can go here */}
        </div>
        <div className="flex flex-col items-center gap-2">
          <SettingsCharm />
        </div>
      </div>
    </TooltipProvider>
  );
}
