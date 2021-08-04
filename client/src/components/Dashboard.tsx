import { Button, Container, TextField, Typography, useTheme } from '@material-ui/core';
import { debounce, isEqual } from 'lodash';
import React, { BaseSyntheticEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { TransitionGroup } from 'react-transition-group';
import { logger, usePrevious } from '../common-util';
import { AppCtx, actions } from '../context';
import { Album, Artist, Track } from '../interfaces';
import { search } from '../services';
import { FadeIn } from './common-ui';

const emptyAlbum = require('../assets/images/empty-album.jpg').default;

const Dashboard = (_props: any) => {
    const theme = useTheme();
    const { palette } = theme;
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [artists, setArtists]: [artists: Array<Artist>, setArtists: any] = useState([]);
    const [tracks, setTracks]: [tracks: Array<Track>, setTracks: any] = useState([]);
    const [albums, setAlbums]: [albums: Array<Album>, setAlbums: any] = useState([]);
    const [readyForRendering, setReadyForRendering] = useState(false);
    const [offset] = useState(0);
    const [limit] = useState(12);
    const [types] = useState(['artist', 'album', 'track']);
    const prevSearch = usePrevious(search);

    const { state, dispatch } = useContext(AppCtx);

    //#region api calls
    const fetchSearchResults = useCallback(async () => {
        try {
            if (loading || !!!query.length) return;
            logger('firing fetch search results');
            setLoading(true);
            setReadyForRendering(false);
            const res = await search(query, types, limit, offset);
            if (!res) {
                throw new Error('no data returned from search');
            }

            const { artists, tracks, albums } = res;

            setArtists(artists.items || []);
            setAlbums(albums.items || []);
            setTracks(tracks.items || []);
            return res;
        } catch (err) {
            logger('error thrown in fetchSearchResults', err);
            throw err;
        } finally {
            setLoading(false);
            setReadyForRendering(true);
        }
    }, [query, types, limit, offset, loading]);
    //#endregion

    //#region handlers
    const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 800), [fetchSearchResults]);

    const handleSearchChange = useCallback(
        (e: BaseSyntheticEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setQuery(e.target.value);
            if (e.target.value) {
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
        (selected: Artist | Track | Album) => {
            logger('selected in handleSelected', selected);
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
        (item: Artist | Track | Album) => {
            return !!state.selected.find((a: any) => isEqual(a.id, item.id));
        },
        [state.selected],
    );
    //#endregion

    //#region renders
    const renderSearchBox = useCallback(() => {
        return (
            <React.Fragment>
                <div className="flex flex-col">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search for an artist, track or album"
                        onChange={handleSearchChange}
                        value={query}
                        type="text"
                        onKeyUp={handleKeyUp}
                        inputProps={{
                            style: { color: palette.info.main, border: '1px wheat solid', borderRadius: '4px' },
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        className="flex flex-1 clear-button"
                        onClick={handleClear}
                        style={{ marginTop: '1rem' }}
                    >
                        <div style={{ fontSize: '12px' }}>Clear</div>
                    </Button>
                </div>
            </React.Fragment>
        );
    }, [query, handleSearchChange, palette, handleKeyUp, handleClear]);

    const renderMedia = useCallback((media: any, alt: string) => {
        if (!media) return null;
        return (
            <div className="flex flex-1 flex-row">
                <div className="album-container">
                    <img className="flex flex-1" src={media} alt={alt} />
                </div>
            </div>
        );
    }, []);

    const renderArtist = useCallback(
        (artist: Artist) => {
            if (!artist) return null;
            const avatar = artist.images?.length ? artist.images[0].url : emptyAlbum;
            const selectArtist = () => handleSelected(artist);
            const isSelected = checkSelected(artist);

            return (
                <FadeIn in key={`artist-${artist.name}-${artist.id}`}>
                    <div
                        className="search-item-container"
                        onClick={selectArtist}
                        style={{
                            backgroundColor: isSelected ? palette.success.main : undefined,
                            color: isSelected ? 'white' : palette.text.primary,
                        }}
                    >
                        {renderMedia(avatar, 'artist avatar')}
                        <div className="flex flex-col" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {artist.name}
                        </div>
                    </div>
                </FadeIn>
            );
        },
        [renderMedia, handleSelected, palette, checkSelected],
    );

    const renderArtists = useCallback(() => {
        if (!!!artists.length) return null;
        return artists.map(renderArtist);
    }, [renderArtist, artists]);

    const renderTrack = useCallback(
        (track: Track) => {
            if (!track) return null;
            const media = !!track.album?.images?.length ? track.album.images[0].url : emptyAlbum;
            const selectTrack = () => handleSelected(track);
            const isSelected = checkSelected(track);

            return (
                <FadeIn in key={`track-${track.name}-${track.id}`}>
                    <div
                        className="search-item-container"
                        onClick={selectTrack}
                        style={{
                            backgroundColor: isSelected ? palette.success.main : undefined,
                            color: isSelected ? 'white' : palette.text.primary,
                        }}
                    >
                        {renderMedia(media, 'track album cover')}
                        <div className="flex flex-col" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {track.name} by {track.artists?.map((a) => a.name).join(', ')}
                        </div>
                    </div>
                </FadeIn>
            );
        },
        [renderMedia, checkSelected, handleSelected, palette],
    );

    const renderTracks = useCallback(() => {
        if (!!!tracks.length) return null;

        return tracks.map(renderTrack);
    }, [tracks, renderTrack]);

    const renderAlbum = useCallback(
        (album: Album) => {
            if (!album) return null;
            const media = !!album.images?.length ? album.images[0].url : emptyAlbum;
            const selectAlbum = () => handleSelected(album);
            const isSelected = checkSelected(album);

            return (
                <FadeIn in key={`album-${album.name}-${album.id}`}>
                    <div
                        className="search-item-container"
                        onClick={selectAlbum}
                        style={{
                            backgroundColor: isSelected ? palette.success.main : undefined,
                            color: isSelected ? 'white' : palette.text.primary,
                        }}
                    >
                        {renderMedia(media, 'album')}
                        <div className="flex flex-col" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {album.name} by {album?.artists?.map((a) => a.name).join(', ')}
                        </div>
                    </div>
                </FadeIn>
            );
        },
        [renderMedia, checkSelected, handleSelected, palette],
    );

    const renderAlbums = useCallback(() => {
        if (!!!albums.length) return null;
        return albums.map(renderAlbum);
    }, [albums, renderAlbum]);

    const renderArtistsList = useCallback(() => {
        if (!artists || !!!artists.length) return null;
        return (
            <div className="flex flex-1 flex-col" style={{ paddingTop: '2rem' }}>
                <Typography variant="h5" component="h5" style={{ fontFamily: 'monospace' }}>
                    Artists:
                </Typography>
                <div className="flex flex-1 flex-row" style={{ flexWrap: 'wrap' }}>
                    {renderArtists()}
                </div>
            </div>
        );
    }, [artists, renderArtists]);

    const renderAlbumsList = useCallback(() => {
        if (!albums || !!!albums.length) return null;
        return (
            <div className="flex flex-1 flex-col" style={{ paddingTop: '2rem' }}>
                <Typography variant="h5" component="h5" style={{ fontFamily: 'monospace' }}>
                    Albums:
                </Typography>
                <div className="flex flex-1 flex-row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {renderAlbums()}
                </div>
            </div>
        );
    }, [albums, renderAlbums]);

    const renderTracksList = useCallback(() => {
        if (!tracks || !!!tracks.length) return null;
        return (
            <div className="flex flex-1 flex-col" style={{ paddingTop: '2rem' }}>
                <Typography variant="h5" component="h5" style={{ fontFamily: 'monospace' }}>
                    Tracks:
                </Typography>
                <div className="flex flex-1 flex-row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {renderTracks()}
                </div>
            </div>
        );
    }, [tracks, renderTracks]);
    //#endregion

    // main render
    return (
        <React.Fragment>
            <Helmet>
                <title>festival.me - Dashboard</title>
            </Helmet>
            <Container style={{ minHeight: '80vh' }}>
                <div style={{ marginTop: '4rem' }}>
                    <div className="flex flex-1 flex-col dashboard-input-container">
                        <h3 className="header-title" style={{ fontSize: '1.5rem', color: palette.info.main }}>
                            Auto-generate playlists based on a collection of your favorite artists, albums or tracks
                        </h3>
                        {renderSearchBox()}
                    </div>
                </div>
                <TransitionGroup id="dashboard-tsg-1">
                    {readyForRendering && (
                        <div className="flex flex-col">
                            {renderArtistsList()}
                            {renderAlbumsList()}
                            {renderTracksList()}
                        </div>
                    )}
                </TransitionGroup>
            </Container>
        </React.Fragment>
    );
};

export default Dashboard;
