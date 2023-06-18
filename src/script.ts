import { redirectToAuthCodeFlow, getAccessToken, refreshAccessToken } from "./auth";
import { fetchCurrentlyListening, fetchProfile, populateUI } from './loadResources';

// TODO: remove this
import { clientId } from "./clientId";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

const MILLISECONDS = 1000;

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    let accessToken = await getAccessToken(clientId, code);
    console.log('got access token:', accessToken);

    setInterval(async () => {
        accessToken = await refreshAccessToken(accessToken, clientId);
        console.log("Successfully refreshed access token.");
    }, 3600 * MILLISECONDS);
    
    setInterval(async () => {
        const profile = await fetchProfile(accessToken);
        const currentListening = await fetchCurrentlyListening(accessToken);

        populateUI(profile, currentListening);
        console.log("Successfully repopulated UI.");
    }, 2 * MILLISECONDS);
}
