import { createContext } from 'react';
import { SpotifyRes } from '../type-defs';

interface AppContextInferface {
    state: State;
    dispatch: any;
}

interface State {
    user: any;
    isAuthenticated: boolean;
    selected: Array<SpotifyRes>;
    openDrawer: boolean;
    loading: boolean;
    creatingPlaylist: boolean;
}

export const AppCtx = createContext({} as AppContextInferface);
