import React, { useMemo, useRef, useState } from "react";
import { cn, getModifierKey } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";

export interface Tab {
  id: number;
  label: string;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTabId: number;
  onChangeTab: (id: number) => void;
  onCloseTab: (id: number) => void;
  onNewTab: () => void;
  className?: string;
}

// TODO: still need to handle keyboard shortcuts

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onChangeTab,
  onCloseTab,
  onNewTab,
  className,
}) => {
  const modifierKey = useMemo(getModifierKey, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [newTabId, setNewTabId] = useState<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      e.preventDefault(); // Prevent default vertical scrolling
    }
  };

  // literally just for handling the animation
  const handleNewTab = () => {
    onNewTab();

    if (tabs.length > 0) {
      const lastTabId = tabs[tabs.length - 1].id;
      setNewTabId(lastTabId + 1);
      setTimeout(() => setNewTabId(null), 151); // remove the animation class after it finishes
    }
  };

  return (
    <div className={cn("flex items-center bg-gray-200", className)}>
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        {/* Tabs */}
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isNew = tab.id === newTabId;

          return (
            <ContextMenu>
              <ContextMenuTrigger>
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={cn(
                    "relative flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-300 focus:outline-none transition-transform",
                    {
                      "bg-white text-blue-600": isActive,
                      "text-gray-700": !isActive,
                      "animate-slide-in": isNew,
                    }
                  )}
                >
                  {/* Active indicator (thin bottom border) */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}

                  <span className="mr-2">{tab.label}</span>

                  {/* Close button */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // prevent switching tabs if close clicked
                      onCloseTab(tab.id);
                    }}
                    className="ml-auto text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    ×
                  </span>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  Close
                  <ContextMenuShortcut>{modifierKey} + W</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>

      {/* New Tab (+) Button */}
      <button
        onClick={handleNewTab}
        className="ml-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold focus:outline-none"
      >
        +
      </button>
    </div>
  );
};

export default TabBar;
