import { createContext } from "react";

interface AppContextInferface {
  state: any;
  dispatch: any;
}

export const AppCtx = createContext({} as AppContextInferface);
