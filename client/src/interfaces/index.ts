export interface Artist {
    external_urls: ExternalUrls;
    followers?: Followers;
    genres: Array<string>;
    href: string;
    id: string;
    images?: Array<Image>;
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export interface Track {
    album?: Album;
    artists?: Array<Artist>;
    available_markets?: Array<string>;
    disc_number?: number;
    duration_ms?: number;
    explicit?: boolean;
    external_ids?: ExternalIds;
    external_urls: ExternalUrls;
    genres: Array<string>;
    href: string;
    id: string;
    is_local?: boolean;
    is_playable?: boolean;
    name: string;
    popularity: number;
    preview_url?: string;
    track_number?: number;
    type: string;
    uri: string;
}

export interface Album {
    album_type: string;
    artists: Array<Artist>;
    available_markets: Array<string>;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<Image>;
    name: string;
    popularity: number;
    release_date_precision: string;
    release_date: string;
    total_tracks: number;
    tracks: Array<Track>;
    type: string;
    uri: string;
}

interface ExternalUrls {
    spotify: string;
}

interface Followers {
    href: string | null;
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
