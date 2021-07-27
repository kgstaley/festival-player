import { actions } from "./actions";
export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.user };
    case actions.GET_USER:
      return { ...state, user: state.user };
    case actions.LOG_OUT:
      return { ...state, user: null };
    case actions.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.isAuthenticated };
    default:
      break;
  }
};
