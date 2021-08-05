import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, useTheme } from '@material-ui/core';
import { isEqual } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { logger } from '../../common-util';
import { actions, AppCtx } from '../../context';
import { addTracksToPlaylist, createPlaylist, getArtistTopTracks } from '../../services';
import { Album, Artist, SpotifyRes, Track } from '../../type-defs';
import { alerts } from '../common-ui';
import { DrawerContentContainer } from './index';

const _Drawer = (_props: any) => {
    //#region context and state
    const { state, dispatch } = useContext(AppCtx);
    const theme = useTheme();
    const palette = useMemo(() => theme.palette, [theme]);

    const [artistCount, setArtistCount] = useState(
        state.selected.filter((item: Artist) => isEqual(item.type, 'artist')).length,
    );
    const [trackCount, setTrackCount] = useState(
        state.selected.filter((item: Track) => isEqual(item.type, 'track')).length,
    );
    const [albumCount, setAlbumCount] = useState(
        state.selected.filter((item: Album) => isEqual(item.type, 'album')).length,
    );
    //#endregion

    //#region helpers
    const generatePlaylistName = useCallback(() => {
        const base = 'festival.me';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLen = characters.length;
        let generatedName = base;
        for (let i: number = 0; i < 10; i++) {
            generatedName += characters.charAt(Math.floor(Math.random() * charactersLen));
        }
        logger('generated name is ', generatedName);
        return generatedName;
    }, []);
    //#endregion

    //#region api calls
    const getArtistTops = useCallback(async (artists: Array<Artist>) => {
        try {
            const artistIds = artists.map((a: Artist) => a.id);
            const promises = artistIds.map(getArtistTopTracks);
            const res = await Promise.all(promises);

            if (!res) throw new Error('getArtistTopTracks returned null');

            const sliced = res.flatMap((item) => item.tracks.slice(-2).map((b: SpotifyRes) => b.uri));
            return sliced;
        } catch (err) {
            logger('error thrown in getArtistTops', err);
            throw err;
        }
    }, []);

    const _createPlaylist = useCallback(
        async (trackUris: readonly string[]) => {
            try {
                dispatch({ type: actions.CREATING_PLAYLIST, creatingPlaylist: true });

                if (!trackUris || !Array.isArray(trackUris) || !!!trackUris.length)
                    throw new Error('No trackIds passed to _createPlaylist');

                const playlist = await createPlaylist(generatePlaylistName());

                if (!playlist) throw new Error('No playlist json returned');

                const { id: playlistId } = playlist;

                await addTracksToPlaylist(playlistId, trackUris);

                dispatch({ type: actions.RESET_SELECTED });
            } catch (err) {
                logger('error thrown in createPlaylist', err);
                throw err;
            } finally {
                dispatch({ type: actions.CREATING_PLAYLIST, creatingPlaylist: false });
            }
        },
        [dispatch, generatePlaylistName],
    );
    //#endregion

    //#region builders
    const buildTrackList = useCallback(() => {
        return state.selected.filter((a: Track) => isEqual(a.type, 'track')).flatMap((b: SpotifyRes) => b.uri);
    }, [state.selected]);

    const buildAlbumTrackList = useCallback(() => {
        return state.selected.filter((a: Album) => isEqual(a.type, 'album')).flatMap((b: SpotifyRes) => b.uri);
    }, [state.selected]);
    //#endregion

    //#region handlers
    const handleToggleDrawer = useCallback(() => {
        dispatch({ type: actions.TOGGLE_DRAWER });
    }, [dispatch]);

    const handleBuildPlaylistItems = useCallback(async () => {
        const artistTrackList = await getArtistTops(state.selected.filter((a: Artist) => isEqual(a.type, 'artist')));
        const trackList = buildTrackList();
        const albumTrackList = buildAlbumTrackList();
        const tracksToAdd = artistTrackList.concat(trackList, albumTrackList);
        _createPlaylist(tracksToAdd);
    }, [getArtistTops, state.selected, buildTrackList, buildAlbumTrackList, _createPlaylist]);

    const handleReset = useCallback(() => {
        dispatch({ type: actions.RESET_SELECTED });
    }, [dispatch]);

    const handleConfirmReset = useCallback(() => {
        alerts
            .fire({
                title: 'Are you sure you want to clear your selected items?',
                text: 'You will have to reselect all of your desired items. Press OK to confirm.',
                reverseButtons: true,
                showCancelButton: true,
            })
            .then((selection) => {
                if (selection.isConfirmed) {
                    logger('confirm clear');
                    handleReset();
                    alerts.fire({
                        title: 'You have cleared your selected items',
                        timer: 1000,
                    });
                    return;
                }
                logger('clear canceled');
            });
    }, [handleReset]);

    const handleSetCounts = useCallback(
        (type: 'artist' | 'track' | 'album') => {
            return state.selected.filter((item: SpotifyRes) => isEqual(item.type, type)).length;
        },
        [state.selected],
    );

    const handleRemoveSelected = useCallback(
        (selected: SpotifyRes) => {
            if (isEqual(state.selected.length, 1)) handleReset();
            else dispatch({ type: actions.REMOVE_SELECTED, selected });
        },
        [dispatch, state.selected, handleReset],
    );

    //@ts-ignore
    const handleOpenOptionsModal = useCallback(() => {
        dispatch({ type: actions.TOGGLE_OPTIONS_MODAL });
    }, [dispatch]);
    //#endregion

    //#region useEffects
    useEffect(() => {
        const arCount = handleSetCounts('artist');
        const tCount = handleSetCounts('track');
        const abCount = handleSetCounts('album');
        setArtistCount(arCount);
        setTrackCount(tCount);
        setAlbumCount(abCount);
    }, [state.selected, handleSetCounts]);
    //#endregion

    //#region renders
    const renderContent = useCallback(() => {
        if (!!!state.selected.length || !state.user) return null;
        return (
            <React.Fragment>
                <div id="drawer-float-container">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleToggleDrawer}
                        title="Open Playlist Generator Menu"
                    >
                        <FontAwesomeIcon icon={faCompactDisc} color={palette.info.light} size="2x" />
                    </Button>
                </div>
                <DrawerContentContainer
                    handleRemoveSelected={handleRemoveSelected}
                    palette={palette}
                    handleToggleDrawer={handleToggleDrawer}
                    handleConfirmReset={handleConfirmReset}
                    handleBuildPlaylistItems={handleBuildPlaylistItems}
                    artistCount={artistCount}
                    trackCount={trackCount}
                    albumCount={albumCount}
                />
            </React.Fragment>
        );
    }, [
        albumCount,
        artistCount,
        handleOpenOptionsModal,
        handleConfirmReset,
        handleRemoveSelected,
        handleToggleDrawer,
        palette,
        state.selected,
        state.user,
        trackCount,
    ]);
    //#endregion

    // main render
    return <React.Fragment>{renderContent()}</React.Fragment>;
};

const DrawerItem = React.memo(_Drawer);

export default DrawerItem;
