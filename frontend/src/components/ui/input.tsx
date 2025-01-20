import * as React from "react";

import { cn, getModifierKey } from "@/lib/utils";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { contextMenuDisabled?: boolean }
>(({ className, type, contextMenuDisabled, ...props }, ref) => {
  const modifierKey = React.useMemo(getModifierKey, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={contextMenuDisabled}>
        <input
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </ContextMenuTrigger>
      {contextMenuDisabled ? null : (
        <ContextMenuContent>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>{modifierKey} + X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>{modifierKey} + C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Paste
            <ContextMenuShortcut>{modifierKey} + V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
});
Input.displayName = "Input";

export { Input };
