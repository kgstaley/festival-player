import { Container, useTheme } from '@mui/material';
import { debounce, isEqual } from 'lodash';
import React, { BaseSyntheticEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TransitionGroup } from 'react-transition-group';
import { logger, usePrevious } from '../../common-util';
import { actions, AppCtx } from '../../context';
import { search } from '../../services';
import { SpotifyRes } from '../../type-defs';
import { DashSearch, DashContentContainer } from './index';
import { toasts } from '../common-ui';

const Dashboard = (_props: any) => {
    //#region context and state
    const theme = useTheme();
    const palette = useMemo(() => theme.palette, [theme]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [artists, setArtists]: [artists: Array<SpotifyRes>, setArtists: any] = useState([]);
    const [tracks, setTracks]: [tracks: Array<SpotifyRes>, setTracks: any] = useState([]);
    const [albums, setAlbums]: [albums: Array<SpotifyRes>, setAlbums: any] = useState([]);
    const [readyForRendering, setReadyForRendering] = useState(false);
    const [offset] = useState(0);
    const [limit] = useState(12);
    const [types] = useState(['artist', 'album', 'track']);
    const prevSearch = usePrevious(search);

    const { state, dispatch } = useContext(AppCtx);
    //#endregion

    //#region api calls
    const fetchSearchResults = useCallback(async () => {
        try {
            if (loading || !!!query.length) return;
            logger('fetchSearchResults: firing ===');
            setLoading(true);
            setReadyForRendering(false);
            const res = await search(query, types, limit, offset);
            if (!res) {
                throw new Error('no data returned from search');
            }

            const { artists, tracks, albums } = res;

            setArtists(artists?.items || []);
            setAlbums(albums?.items || []);
            setTracks(tracks?.items || []);
            return res;
        } catch (err) {
            logger('fetchSearchResults: error thrown in fetchSearchResults', err);
            toasts.error(`Error thrown: ${err}`, 'fetchSearchResults');
            throw err;
        } finally {
            setLoading(false);
            setReadyForRendering(true);
        }
    }, [query, types, limit, offset, loading]);
    //#endregion

    //#region handlers
    const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 1000), [fetchSearchResults]);

    const handleSearchChange = useCallback(
        (e: BaseSyntheticEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setQuery(e.target.value);
            if (!!e.target.value) {
                debouncedSearch();
            }
        },
        [debouncedSearch],
    );

    const handleKeyUp = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.keyCode === 13) {
                setQuery(e.target.value);
                fetchSearchResults();
            }
        },
        [fetchSearchResults],
    );

    const handleClear = useCallback(() => {
        debouncedSearch.cancel();
        setQuery('');
        setArtists([]);
        setTracks([]);
        setAlbums([]);
    }, [debouncedSearch]);

    const handleSelected = useCallback(
        (selected: SpotifyRes) => {
            const found = state.selected.find((s: any) => isEqual(s.id, selected.id));
            if (!!!found) dispatch({ type: actions.ADD_SELECTED, selected });
            else dispatch({ type: actions.REMOVE_SELECTED, selected });
        },
        [state.selected, dispatch],
    );
    //#endregion

    //#region useEffects
    useEffect(() => {
        if (!isEqual(prevSearch, search)) return debouncedSearch.cancel;
        return;
    }, [prevSearch, debouncedSearch]);
    //#endregion

    //#region helpers
    const checkSelected = useCallback(
        (item: SpotifyRes) => {
            return !!state.selected.find((a: any) => isEqual(a.id, item.id));
        },
        [state.selected],
    );
    //#endregion

    // main render
    return (
        <React.Fragment>
            <Helmet>
                <title>festival.me - Dashboard</title>
            </Helmet>
            <Container style={{ minHeight: '90vh' }}>
                <div style={{ marginTop: '4rem' }}>
                    <div className="dashboard-input-container">
                        <h3 className="title">
                            Auto-generate playlists based on a collection of your favorite artists, albums or tracks
                        </h3>
                        <DashSearch
                            handleSearchChange={handleSearchChange}
                            query={query}
                            handleKeyUp={handleKeyUp}
                            handleClear={handleClear}
                            palette={palette}
                        />
                    </div>
                </div>
                <TransitionGroup id="dashboard-tsg-1">
                    {readyForRendering && (
                        <DashContentContainer
                            handleSelected={handleSelected}
                            checkSelected={checkSelected}
                            palette={palette}
                            artists={artists}
                            tracks={tracks}
                            albums={albums}
                        />
                    )}
                </TransitionGroup>
            </Container>
        </React.Fragment>
    );
};

export default Dashboard;
