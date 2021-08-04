import { isEqual } from 'lodash';
import { actions } from './actions';
export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case actions.SET_USER:
            return { ...state, user: action.user };
        case actions.GET_USER:
            return { ...state, user: state.user };
        case actions.LOG_OUT:
            return { ...state, user: null, isAuthenticated: false };
        case actions.SET_AUTHENTICATED:
            return { ...state, isAuthenticated: action.isAuthenticated };
        case actions.ADD_SELECTED:
            return { ...state, selected: [...state.selected, action.selected] };
        case actions.REMOVE_SELECTED:
            return { ...state, selected: state.selected.filter((s: any) => !isEqual(s.id, action.selected.id)) };
        case actions.TOGGLE_DRAWER:
            return { ...state, openDrawer: !state.openDrawer };
        default:
            break;
    }
};
