import { logger } from '../common-util';
import client from './axiosClient';

const rootApi = `${process.env.REACT_APP_API_PREFIX}/spotify`;

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
        const qs = `q=${query}&types=${encodeURIComponent(JSON.stringify(types))}&limit=${limit}&offset=${offset}`;

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
