$(function () {
    /*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
    //------------------------------------------Variables-----------------------------------------//
    /*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

    let genreKeyword = 'pop';
    let spotifyData = '';
    let genres = [];
    let artists = [];

    // Variables for querying Spotify API
    let token = '';
    let genreNeeded = 'classical';
    let genreQuery = `genre:${genreNeeded}`;

    // These are Kurt's personal keys. Keep them safe please! We will find a way to hide them at deployment
    const clientId = '838b3be49dbd4b3fbeee945d6a9894cc';
    const clientSecret = '21f201cfdb0a474baf535b148e91e24e';


    // API suffices
    // Main suffix passed into getSpotifyData function
    // Update this to desired string, then pass to getSpotifyData
    let apiSuffix = '';


    // Specific suffices for different requests
    // Search for aritsts that include 'genreKeyword' in their description (could be name, genres, etc)
    let artistsByGenreSuffix = `search?q=${encodeURIComponent(genreKeyword)}&type=artist&limit=50`;

    // Return an object of all available genres
    let listGenresSuffix = 'recommendations/available-genre-seeds';


    /*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
    //------------------------------------------Functions-----------------------------------------//
    /*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

    // Make the token request
    // TODO: Eventually, this will need to be wrapped in a function to request a new
    // token every hour (access tokens expire after 1 hour)
    // IF returning a 400 error, check clientId and clientSecret for accuracy
    const getToken = async () => {
        // Convert client ID and client secret to base64 for token request (required)
        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        })
            .then((response) => response.json())
            .then((data) => {
                // Extract the access token from the response and store in global 'token' variable
                // This token is used to make requests to the Spotify API
                token = data.access_token;
                console.log('Access Token:', token);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    // This is the primary Spotify API call function
    // Modify the variable 'apiSuffix' and pass it in to the function call to suit your search
    // e.g. to display all available genres ===> apiSuffix = listGenresSuffix
    function getSpotifyData(apiSuffix) {
        // Spotify API endpoint
        console.log(`suffix is ${apiSuffix}`);
        const spotifyEndpoint = `https://api.spotify.com/v1/${apiSuffix}`;

        // Make the API request to get a list of genres
        fetch(spotifyEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then(data => {
                console.log(data);
                spotifyData = data;
                console.log(data.artists.items[0]);
                artists = data.artists.items;
                subGenres = [];
                artists.forEach(artist => {
                    for (let i=0; i<artist.genres.length; i++) {
                        if (!subGenres.includes(artist.genres[i])) {
                            subGenres.push(artist.genres[i]);
                        }
                    }
                });
                console.log('Here is the array of subgenres');
                console.log(subGenres);
            })
            .catch(error => console.error('Error:', error));
    }

    async function generate() {
        await getToken();
        apiSuffix = artistsByGenreSuffix;
        await getSpotifyData(apiSuffix);
        // apiSuffix = listGenresSuffix;
        // getSpotifyData(apiSuffix);
        // console.log(spotifyData);
    }

    generate();





    /*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
    //-------------------------------------Event listeners----------------------------------------//
    /*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/
    // var genreBtn = document.querySelector("")

});