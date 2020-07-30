export default async () => {
  console.log("devices")
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
    },
  })
    .then(r => r.json())
    .catch(console.log)
}
