// this is a mapping of plugin ids to a friendly name 

// TODO: should localize this!

import { lazy, LazyExoticComponent, ComponentType } from "react";

/**
 * A plugin is a piece of functionality that can be added to the app.
 */
export type Plugin = {
  /**
   * The name of the plugin.
   * 
   * This will be displayed in the UI including the command palette.
   */
  name: string;

  /**
   * A brief description of the plugin.
   * 
   * This will be displayed in the UI at some point.
   */
  description: string;

  /**
   * The React component that will be rendered when the plugin is activated.
   */
  component: LazyExoticComponent<ComponentType<any>>;

  /**
   * Whether the plugin is in beta.
   * 
   * This is currently displayed as a badge in the plugin list dropdown.
   */
  beta?: boolean;

  /**
   * The order in which the plugin should appear in the list.
   * 
   * This is used to sort the list of plugins in the UI.
   */
  order?: number;

  /**
   * Whether the plugin should be hidden from the app entirely.
   * 
   * This is useful for plugins that are not yet ready for use.
   * 
   * Not used yet.
   */
  hidden?: boolean;
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
  "mock-http": {
    name: "Mock HTTP Server",
    description: "Create a mock HTTP server",
    component: lazy(() => import("./plugins/mock-http")),
    beta: true,
    order: 5,
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