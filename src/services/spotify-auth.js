export default () => {
  var scopes =
    "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"
  var redirect_uri = process.env.GATSBY_REDIRECT_URI
  window &&
    window.open(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        process.env.GATSBY_SPOTIFY_CLIENT_ID +
        "&scope=" +
        encodeURIComponent(scopes) +
        "&redirect_uri=" +
        encodeURIComponent(redirect_uri),
      "login-popup",
      "width=500, height=400"
    )
}
