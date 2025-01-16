// this is a mapping of plugin ids to a friendly name 

// TODO: should localize this!

import { lazy, LazyExoticComponent, ComponentType } from "react";

export type Plugin = {
  name: string;
  description: string;
  component: LazyExoticComponent<ComponentType<any>>;
};

const backendPlugins: Record<string, Plugin> = {
  "base64": {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode text to and from Base64",
    component: lazy(() => import("./plugins/base64")),
  },
  "lorem-ipsum": {
    name: "Lorem Ipsum Generator",
    description: "Generate random placeholder text",
    component: lazy(() => import("./plugins/lorem-ipsum")),
  },
};

const frontendPlugins: Record<string, Plugin> = {
  "json": {
    name: "JSON Tools",
    description: "Prettify and minify JSON and more!",
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