interface BaseSpotifyRes {
    external_urls: Array<ExternalUrls>;
    href: string;
    id: string;
    name: string;
    type: SpotifyResponseType;
    uri: string;
}

interface ExternalUrls {
    spotify: string;
}

interface Followers {
    href?: string | null;
    total: number;
}

interface Image {
    height: number;
    width: number;
    url: string;
}

interface ExternalIds {
    isrc: string;
}

export enum SpotifyResponseType {
    Artist = 'ARTIST',
    Album = 'ALBUM',
    Track = 'TRACK',
}

export interface Artist extends BaseSpotifyRes {
    type: SpotifyResponseType.Artist;
    followers: Followers;
    genres: Array<string>;
    images: Array<Image>;
    popularity: number;
}

export interface Track extends BaseSpotifyRes {
    type: SpotifyResponseType.Track;
    album: Album;
    artists: Array<Artist>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: Array<ExternalIds>;
    genres: Array<string>;
    is_local: boolean;
    is_playable: boolean;
    popularity: number;
    preview_url: string;
    track_number: number;
}

export interface Album extends BaseSpotifyRes {
    type: SpotifyResponseType.Album;
    album_type: string;
    artists: Array<Artist>;
    available_markets: Array<string>;
    external_ids: Array<ExternalIds>;
    images: Array<Image>;
    popularity: number;
    release_date_precision: string;
    release_date: string;
    total_tracks: number;
    tracks: Array<Track>;
}

export type SpotifyRes = Artist | Track | Album;
