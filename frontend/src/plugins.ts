// this is a mapping of plugin ids to a friendly name 

// TODO: should localize this!

import { lazy, LazyExoticComponent, ComponentType } from "react";

export type Plugin = {
  name: string;
  description: string;
  component: LazyExoticComponent<ComponentType<any>>;
  beta?: boolean;
  order?: number;
};

// these are plugins that are (at least somewhat) implemented on the backend (like Base64 and Lorem Ipsum)
const backendPlugins: Record<string, Plugin> = {
  "base64": {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode text to and from Base64",
    component: lazy(() => import("./plugins/base64")),
    order: 1,
  },
  "lorem-ipsum": {
    name: "Lorem Ipsum Generator",
    description: "Generate random placeholder text",
    component: lazy(() => import("./plugins/lorem-ipsum")),
    beta: true,
    order: 4,
  },
  "qr-code": {
    name: "QR Code Generator",
    description: "Generate QR codes",
    component: lazy(() => import("./plugins/qr-code")),
    beta: true,
    order: 3,
  },
};

// these are plugins that are only implemented on the frontend (like JSON Tools)
const frontendPlugins: Record<string, Plugin> = {
  "json": {
    name: "JSON Tools",
    description: "Prettify and minify JSON",
    component: lazy(() => import("./plugins/json")),
    beta: true,
    order: 2,
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