import { Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SettingsCharm({ className }: { className?: string }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Cog size={28} className={cn("cursor-pointer", className)} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function CharmBar() {
  return (
    <div className="fixed top-0 left-0 h-dvh min-h-dvh max-h-dvh w-16 bg-gray-800 text-white flex flex-col items-center justify-between py-3">
      <div className="flex flex-col items-center gap-2">
        {/* Other charms can go here */}
      </div>
      <div className="flex flex-col items-center gap-2">
        <SettingsCharm />
      </div>
    </div>
  );
}
