import React from "react";
import { cn } from "@/lib/utils";

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

// TODO: still need to handle scrolling if there are too many tabs and using mousewheel and keyboard shortcuts

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onChangeTab,
  onCloseTab,
  onNewTab,
  className,
}) => {
  return (
    <div className={cn("flex items-center bg-gray-200", className)}>
      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`
              relative flex items-center px-4 py-2 
              text-sm font-medium
              hover:bg-gray-300
              focus:outline-none
              ${isActive ? "bg-white text-blue-600" : "text-gray-700"}
            `}
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
        );
      })}

      {/* New Tab (+) Button */}
      <button
        onClick={onNewTab}
        className="ml-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold focus:outline-none"
      >
        +
      </button>
    </div>
  );
};

export default TabBar;
