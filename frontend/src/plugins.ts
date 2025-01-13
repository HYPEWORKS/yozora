// this is a mapping of plugin ids to a friendly name 

// TODO: should localize this!

import { Component, lazy, LazyExoticComponent, ComponentType } from "react";

export type Plugin = {
  name: string;
  component: LazyExoticComponent<ComponentType<any>>;
};

const plugins: Record<string, Plugin> = {
  "base64": {
    name: "Base64 Encoder/Decoder",
    component: lazy(() => import("./plugins/base64")),
  },
  "lorem-ipsum": {
    name: "Lorem Ipsum Generator",
    component: lazy(() => import("./plugins/lorem-ipsum")),
  },
};

export default plugins;