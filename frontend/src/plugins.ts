// this is a mapping of plugin ids to a friendly name 

// TODO: should localize this!

import { Component, lazy, LazyExoticComponent, ComponentType } from "react";

export type Plugin = {
  name: string;
  component: LazyExoticComponent<ComponentType<any>>;
};

const backendPlugins: Record<string, Plugin> = {
  "base64": {
    name: "Base64 Encoder/Decoder",
    component: lazy(() => import("./plugins/base64")),
  },
  "lorem-ipsum": {
    name: "Lorem Ipsum Generator",
    component: lazy(() => import("./plugins/lorem-ipsum")),
  },
};

const frontendPlugins: Record<string, Plugin> = {
  "json": {
    name: "JSON Tools",
    component: lazy(() => import("./plugins/json")),
  },
};

const plugins = {
  ...backendPlugins,
  ...frontendPlugins,
};

export function getRegisteredFrontendPlugins() {
  return Object.keys(frontendPlugins);
}

export default plugins;