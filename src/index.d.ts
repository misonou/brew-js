/// <reference path="./types.d.ts" />
/// <reference path="./extension/withConfig.d.ts" />
/// <reference path="./extension/withI18n.d.ts" />
/// <reference path="./extension/withLogin.d.ts" />
/// <reference path="./extension/withRouter.d.ts" />
/// <reference path="./extension/withScrollable.d.ts" />
/// <reference path="./extension/withViewport.d.ts" />

import * as methods from "./core";
import { AppInit } from "./app";

const brew: AppInit & typeof methods;
export default brew;
export as namespace brew;
