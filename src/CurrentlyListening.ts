// https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
export interface AlbumObject {
    name: string;
    images: Array<ImageObject>;
}

export interface ImageObject {
    url: string;
    height: number;
    width: number;
} 

export interface ArtistObject {
    name: string;
}

export interface TrackObject {
    album: AlbumObject;
    artists: Array<ArtistObject>;
    name: string;
} 

export interface CurrentlyListening {
    is_playing: boolean;
    currently_playing_type: string;
    item: TrackObject | null;
    id: string;
}