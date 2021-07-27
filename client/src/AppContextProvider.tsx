import PropTypes from "prop-types";
import { useReducer } from "react";
import { reducer } from "./context/reducer";
import { AppCtx } from "./context";

const init = () => ({ user: null, isAuthenticated: false });

export const AppContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    reducer,
    { user: null, isAuthenticated: false },
    init
  );

  return (
    <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>
  );
};
AppContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.func,
  ]),
};
