import { createContext } from 'react';
import { SpotifyRes } from '../types';

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
    openOptionsModal: boolean;
}

export const AppCtx = createContext({} as AppContextInferface);
