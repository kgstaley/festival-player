import { faList, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, List, ListItem, useTheme } from '@material-ui/core';
import { isEqual } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { logger } from '../common-util';
import { actions, AppCtx } from '../context';
import { addTracksToPlaylist, createPlaylist, getArtistTopTracks } from '../services';
import { Album, Artist, SpotifyRes, Track } from '../type-defs';
import { AblumItem, ArtistItem, TrackItem } from './common-ui';

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
    const renderDeleteIcon = useCallback(
        (item: SpotifyRes) => {
            const removeItem = () => handleRemoveSelected(item);
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className="drawer-remove-icon"
                    key={`remove-icon-${item.id}`}
                    style={{ boxShadow: '2px 2px 10px 1px rgba(0, 0, 0, 0.3)' }}
                >
                    <FontAwesomeIcon
                        title="Remove item"
                        icon={faTrash}
                        color={palette.success.dark}
                        onClick={removeItem}
                        size="2x"
                    />
                </Button>
            );
        },
        [palette, handleRemoveSelected],
    );

    const renderSelectedItems = useCallback(() => {
        return state.selected
            .sort((a, b) => a.type.localeCompare(b.type))
            .map((item: SpotifyRes) => {
                return (
                    <div className="drawer-listitem-container" key={`selected-${item.type}-${item.id}`}>
                        <ListItem
                            key={`selected-${item.type}-${item.id}`}
                            className="drawer-listitem"
                            style={{ justifyContent: 'space-between' }}
                        >
                            {item.type === 'artist' && <ArtistItem {...item} />}
                            {item.type === 'track' && <TrackItem {...item} />}
                            {item.type === 'album' && <AblumItem {...item} />}
                        </ListItem>
                        {renderDeleteIcon(item)}
                    </div>
                );
            });
    }, [state.selected, renderDeleteIcon]);

    const renderClearButton = useCallback(() => {
        if (!state.selected || !!!state.selected.length) return null;
        return (
            <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleReset} title="Clear selected">
                    <div>Clear</div>
                </Button>
            </React.Fragment>
        );
    }, [state.selected, handleReset]);

    const renderCloseButton = useCallback(() => {
        return (
            <div className="flex" style={{ marginTop: '0.5rem' }}>
                <Button variant="outlined" color="secondary" onClick={handleToggleDrawer} title="Close drawer">
                    <div>Close</div>
                </Button>
            </div>
        );
    }, [handleToggleDrawer]);

    const renderCreatePlaylistButton = useCallback(() => {
        if (!state.selected || !!!state.selected.length) return null;

        return (
            <div className="flex" style={{ justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    className="flex flex-row flex-align-center"
                    style={{ justifyContent: 'space-around', padding: '0.5rem 2rem' }}
                    onClick={handleBuildPlaylistItems}
                    disabled={!!!state.selected.length || state.creatingPlaylist}
                >
                    <FontAwesomeIcon icon={faPlay} color={palette.text.primary} size="1x" />
                    <div style={{ paddingLeft: '1rem' }}>Generate Playlist</div>
                </Button>
            </div>
        );
    }, [state.selected, palette, handleBuildPlaylistItems, state.creatingPlaylist]);

    const renderContent = useCallback(() => {
        if (!!!state.selected.length) return null;
        return (
            <div id="drawer-float-container">
                <Button variant="contained" color="primary" onClick={handleToggleDrawer} title="View selected items">
                    <FontAwesomeIcon icon={faList} color={palette.info.light} size="2x" />
                </Button>
                <Drawer open={state.openDrawer} onClose={handleToggleDrawer} anchor="right" id="drawer">
                    <List
                        id="drawer-list"
                        className="flex flex-1 flex-col"
                        style={{ margin: 0, padding: 0, backgroundColor: palette.success.light }}
                    >
                        <div id="drawer-header" style={{ backgroundColor: palette.success.dark }}>
                            <div id="drawer-header-text">
                                <h5 className="flex flex-align-center" style={{ fontFamily: 'monospace' }}>
                                    {state.selected.length} Selected Items:
                                </h5>
                                <div>
                                    <span>{artistCount} artists, </span>
                                    <span>{trackCount} tracks, </span>
                                    <span>{albumCount} albums</span>
                                </div>
                            </div>
                            <div className="flex">
                                {renderCreatePlaylistButton()}
                                <div className="flex flex-col flex-justify-center" style={{ marginLeft: '1rem' }}>
                                    {renderClearButton()}
                                    {renderCloseButton()}
                                </div>
                            </div>
                        </div>
                        {renderSelectedItems()}
                        <div id="drawer-list-bottom-gradient" />
                    </List>
                </Drawer>
            </div>
        );
    }, [
        albumCount,
        artistCount,
        handleToggleDrawer,
        palette,
        renderClearButton,
        renderCloseButton,
        renderCreatePlaylistButton,
        renderSelectedItems,
        state.openDrawer,
        state.selected,
        trackCount,
    ]);
    //#endregion

    // main render
    return renderContent();
};

const DrawerItem = React.memo(_Drawer);

export default DrawerItem;
