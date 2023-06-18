import { UserProfile } from "./UserProfile";
import { CurrentlyListening, TrackObject, ArtistObject, AlbumObject } from "./CurrentlyListening";

export async function fetchProfile(token: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchCurrentlyListening(token: string): Promise<CurrentlyListening> {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

/**
 * Concatenates the names of artists
 * 
 * @param artists a list of artist names. must have length >= 1
 * @returns the artist names with commas between each name if multiple artists,
 *  else if just 1 artist, just returns the only artist's name
 *  else returns blank string
 */
function convertArtistNames(artists: Array<string>): string {
    switch (artists.length) {
        case (0): return "";
        case (1): return artists[0];
        default : return artists.reduce((prev: string, curr: string, ind: number) => {
            return (ind === artists.length - 1) ? prev + ", and " + curr : prev + ", " + curr;
        });
    }
}

/**
 * Removes any images in the span and loads the new image in. 
 * 
 * @param newImage the image to load in
 * @param divId the divId identifier where the image should be contained
 */
function loadReplaceImage(newImage: HTMLImageElement, divId: string): void {
    const containingDiv = document.getElementById(divId)!;
    const existingImg: HTMLImageElement = containingDiv.getElementsByTagName('img')[0];

    if (existingImg.src === "" || existingImg.src !== newImage.src) {
        existingImg.src = newImage.src;
    }

    return;
}

/**
 * Truncates text to a specified length.
 * 
 * @param text the text to possibly truncate
 * @param length the maximum specified length of the text. must be >= 3
 * @returns either the original text if it's length is <= `length`,
 * or the text truncated to the size `length`, with the last three characters as '...'
 */
function truncateText(text: string, length: number): string {
    if (length < 3) { return text; }
    if (text.length <= length) {
        return text;
    }

    return text.slice(0, length-3).trimEnd() + "...";
}

export function populateUI(profile: UserProfile, currentListening: CurrentlyListening): void {
    document.getElementById("displayName")!.innerText = profile.display_name;

    if (profile.images[0]) { 
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;

        loadReplaceImage(profileImage, "profileImage");
    }

    const trackObject: TrackObject | null = currentListening.item;
    const isPlayingTrack = trackObject !== null && currentListening.currently_playing_type === "track";
    if (currentListening.is_playing && isPlayingTrack) {
        const artists: Array<string> = trackObject.artists.map((artist: ArtistObject) => artist.name);
        const albumTitle: string = trackObject.album.name;
        const songTitle: string = trackObject.name;

        document.getElementById("artist")!.innerText = truncateText(convertArtistNames(artists), 30);
        document.getElementById("album")!.innerText = truncateText(albumTitle, 30);
        document.getElementById("song")!.innerText = truncateText(songTitle, 30);

        const albumObject: AlbumObject = trackObject.album;
        if (albumObject.images[0]) {
            const albumImage = new Image(200, 200);
            albumImage.src = albumObject.images[0].url;
    
            loadReplaceImage(albumImage, "albumImage");
        }
    }
}