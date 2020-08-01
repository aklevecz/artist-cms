export const createLink = (site, tag) => {
  switch (site) {
    case "soundcloud":
      return `https://soundcloud.com/${tag}`
    case "spotify":
      return `https://open.spotify.com/artist/${
        tag.split("spotify:artist:")[1]
      }`
    case "instagram":
      return `https://instagram.com/${tag}`
    case "bandcamp":
      return `${tag}`
    default:
      return ""
  }
}
