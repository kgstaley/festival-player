import { Typography } from '@mui/material';
import { Palette } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { SpotifyRes } from '../../type-defs';
import { FadeIn } from '../common-ui';

const emptyAlbum = require('../../assets/images/empty-album.jpg').default;

const DashContent = ({
    handleSelected,
    checkSelected,
    palette,
    artists,
    tracks,
    albums,
}: {
    handleSelected: any;
    checkSelected: any;
    palette: Palette;
    artists: Array<SpotifyRes>;
    tracks: Array<SpotifyRes>;
    albums: Array<SpotifyRes>;
}) => {
    //#region renders
    const renderMedia = useCallback((media: string, alt: string) => {
        if (!media) return null;
        return (
            <div className="flex flex-1 flex-row">
                <div className="album-container">
                    <img className="flex flex-1" src={media} alt={alt} />
                </div>
            </div>
        );
    }, []);

    const renderSearchItem = useCallback(
        (item: SpotifyRes) => {
            const selectItem = () => handleSelected(item);
            const isSelected = checkSelected(item);

            let media = '';
            let byLine = '';
            switch (item.type) {
                case 'artist':
                    media = item.images?.length ? item.images[0].url : emptyAlbum;
                    break;
                case 'track':
                    media = !!item.album?.images?.length ? item.album.images[0].url : emptyAlbum;
                    byLine = `by ${item.artists?.map((a) => a.name).join(', ')}`;
                    break;
                case 'album':
                    media = !!item.images?.length ? item.images[0].url : emptyAlbum;
                    byLine = `by ${item.artists?.map((a) => a.name).join(', ')}`;
                    break;
                default:
                    break;
            }

            return (
                <FadeIn in key={`track-${item.name}-${item.id}`}>
                    <div
                        className="search-item-container"
                        onClick={selectItem}
                        style={{
                            backgroundColor: isSelected ? palette.success.main : undefined,
                            color: isSelected ? 'white' : palette.text.primary,
                        }}
                    >
                        {renderMedia(media, 'item album cover')}
                        <div className="flex flex-col" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {item.name} {byLine}
                        </div>
                    </div>
                </FadeIn>
            );
        },
        [renderMedia, handleSelected, palette.success.main, palette.text.primary, checkSelected],
    );

    const renderArtists = useCallback(() => {
        if (!!!artists.length) return null;
        return artists.map(renderSearchItem);
    }, [artists, renderSearchItem]);

    const renderTracks = useCallback(() => {
        if (!!!tracks.length) return null;

        return tracks.map(renderSearchItem);
    }, [tracks, renderSearchItem]);

    const renderAlbums = useCallback(() => {
        if (!!!albums.length) return null;
        return albums.map(renderSearchItem);
    }, [albums, renderSearchItem]);

    const renderArtistList = useCallback(() => {
        if (!artists || !!!artists.length) return null;
        return (
            <div className="list-container">
                <Typography variant="h5" component="h5">
                    Artists
                </Typography>
                <div className="card-container">{renderArtists()}</div>
            </div>
        );
    }, [artists, renderArtists]);

    const renderAlbumList = useCallback(() => {
        if (!albums || !!!albums.length) return null;
        return (
            <div className="list-container">
                <Typography variant="h5" component="h5">
                    Albums
                </Typography>
                <div className="card-container">{renderAlbums()}</div>
            </div>
        );
    }, [albums, renderAlbums]);

    const renderTrackList = useCallback(() => {
        if (!tracks || !!!tracks.length) return null;
        return (
            <div className="list-container">
                <Typography variant="h5" component="h5">
                    Tracks
                </Typography>
                <div className="card-container">{renderTracks()}</div>
            </div>
        );
    }, [tracks, renderTracks]);
    //#endregion

    // main render
    return (
        <div className="dash-content-container-outer">
            {renderArtistList()}
            {renderAlbumList()}
            {renderTrackList()}
        </div>
    );
};

export const DashContentContainer = React.memo(DashContent);
