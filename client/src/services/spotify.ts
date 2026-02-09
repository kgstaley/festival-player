import { logger } from '../common-util';
import client from './axiosClient';

const rootApi = `${import.meta.env.VITE_API_PREFIX}/spotify`;

export const getTopArtists = async (type: string) => {
    try {
        const config = {
            url: `${rootApi}/me/top/${type}`,
            method: 'GET',
        };
        const { data } = await client(config);

        return data;
    } catch (err) {
        logger('error thrown in getTopArtists', err);
        throw err;
    }
};

export const search = async (query: string, types: string[], limit?: number, offset?: number) => {
    try {
        const qs: string = `q=${query}&types=${encodeURIComponent(
            JSON.stringify(types),
        )}&limit=${limit}&offset=${offset}`;

        const config = {
            url: `${rootApi}/search?${qs}`,
            method: 'GET',
        };
        const { data } = await client(config);
        return data;
    } catch (err) {
        logger('error thrown in search', err);
        throw err;
    }
};

export const createPlaylist = async (name: string, description?: string) => {
    try {
        const qs: string = `?name=${name}&description=${description}`;
        const config = { url: `${rootApi}/playlist/new${qs}`, method: 'POST' };

        const { data } = await client(config);

        return data;
    } catch (err) {
        logger('error thrown in createPlaylist', err);
        throw err;
    }
};

export const addTracksToPlaylist = async (playlistId: string, trackUris: readonly string[]) => {
    try {
        const config = {
            url: `${rootApi}/playlist/${playlistId}/tracks/new`,
            data: { uris: trackUris },
            method: 'POST',
        };

        const { data } = await client(config);

        return data;
    } catch (err) {
        logger('error thrown in addTracksToPlaylist', err);
        throw err;
    }
};

export const getArtistTopTracks = async (artistId: string) => {
    try {
        const config = {
            url: `${rootApi}/artist/${artistId}/tops`,
            method: 'GET',
        };

        const { data } = await client(config);
        return data;
    } catch (err) {
        logger('error thrown in getArtistTopTracks', err);
        throw err;
    }
};
