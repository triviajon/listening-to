import { UserProfile } from "./UserProfile";
import { CurrentlyListening, TrackObject, ArtistObject, ImageObject } from "./CurrentlyListening";

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
        default : return artists.reduce((prev: string, curr: string) => prev + ", " + curr);
    }
}

export function populateUI(profile: UserProfile, currentListening: CurrentlyListening): void {
    document.getElementById("displayName")!.innerText = profile.display_name;

    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;

        const avatarSpan = document.getElementById("avatar")!;
        if (avatarSpan.firstChild) avatarSpan.removeChild(avatarSpan.firstChild);
        avatarSpan!.appendChild(profileImage);
    }

    const trackObject: TrackObject | null = currentListening.item;
    const isPlayingTrack = trackObject !== null && currentListening.currently_playing_type === "track";
    if (currentListening.is_playing && isPlayingTrack) {
        const artists: Array<string> = trackObject.artists.map((artist: ArtistObject) => artist.name);
        const albumTitle: string = trackObject.album.name;
        const albumPhotoUrl: string = trackObject.album.images[0].url;
        const songTitle: string = trackObject.name;

        document.getElementById("artist")!.innerText = convertArtistNames(artists);
        document.getElementById("album")!.innerText = albumTitle;
        document.getElementById("song")!.innerText = songTitle;

        console.log(artists, albumTitle, songTitle);
    }
}