const fetch = require("node-fetch")
const fs = require("fs")

const plraw = fs.readFileSync("all-artists.json")
const pl = JSON.parse(plraw)
const token =
  "BQA-mQY9WlQRmVGvMB6wSfaUU5plBSQ4msmAX0yVL5TlyNFONvphms-q8nAz5g8t8PBHPp_vDeqyqGQgoG_2ePJ5C5Mah54EBXjUiHbtXcB427yRi_UobSufFGIlotyc-c8nX1ZAGB6enAi84gLgaYvLJu0HGjHZXKoSwFxnzdY381GmIZyHBpWfJiDppSY5WKouIICy7hW00F24LkwTSCn26qQZNnWRXyspbfjAiKDIFsZKRyn9CD4Ur0gKDZURQhbIyO7tmg"
pl.forEach((p, i) => {
  const dir_name = p.name.toLowerCase().split(" ").join("-")
  const modelDir = "models/artist"
  const artistDir = `${modelDir}/${dir_name}`
  const checkCurrent = fs.readFileSync(`${artistDir}/data.json`)
  const checkCurrentJson = JSON.parse(checkCurrent)
  if (checkCurrentJson.instagram) {
    return
  }
  try {
    fs.mkdirSync(artistDir)
  } catch (e) {
    e
  }
  setTimeout(
    () =>
      fetch(`https://api.spotify.com/v1/artists/${p.spotify.split(":")[2]}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(r => r.json())
        .then(data => {
          p.spotify_image = data.images[0].url
          fs.writeFileSync(`${artistDir}/data.json`, JSON.stringify(p))
        }),
    i * 1000
  )
})
return
// playlists = []
// fetch(`https://api.spotify.com/v1/me/playlists?limit=50&offset=300`, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
//   .then(r => r.json())
//   .then(data => {
//     fs.writeFileSync("playlists6.json", JSON.stringify(data))
//   })
// allData = []
// ;[0, 1, 2, 3, 4, 5, 6].map(n => {
//   const rdata = fs.readFileSync(`playlists${n}.json`)
//   const data = JSON.parse(rdata)

//   data.items.map(d => allData.push(d))
// })
// console.log(allData.length)
// fs.writeFileSync("playlists.json", JSON.stringify(allData))

// return
const rawData = fs.readFileSync("playlists.json")
const playlists = JSON.parse(rawData)

return
sData = []
const pItems = playlists
pItems.map((p, i) => {
  setTimeout(
    () =>
      fetch(
        `https://api.spotify.com/v1/playlists/${p.uri.split(":")[2]}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(r => r.json())
        .then(d => {
          const data = d.items
          const dO = {
            name: "",
            curated_playlist: "",
            spotify: "",
            instagram: "",
            soundcloud: "",
            bandcamp: "",
            soundcloud_release_trackId: "",
          }
          try {
            data[0]
            console.log("ok")
          } catch (err) {
            console.log(data)
          }
          dO.name = data[0].track.artists[0].name
          dO.spotify = data[0].track.artists[0].uri
          dO.curated_playlist = p.uri
          sData.push(dO)
          if (i === pItems.length - 1) {
            fs.writeFileSync("all-artists.json", JSON.stringify(sData))
          }
        }),
    1000 * i
  )
})
