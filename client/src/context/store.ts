import { createContext } from 'react';
import { Album, Artist, Track } from '../interfaces';

interface AppContextInferface {
    state: State;
    dispatch: any;
}

interface State {
    user: any;
    isAuthenticated: boolean;
    selected: Array<Artist | Track | Album>;
    openDrawer: boolean;
}

export const AppCtx = createContext({} as AppContextInferface);
