import React from "react"
import SVG from "react-inlinesvg"
import TopSVG from "./TOP.svg"
import { playlistButton, releasesButton } from "./selectors"

const createLink = (site, tag) => {
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

const Top = ({
  artistName,
  data,
  isDesk,
  profileImgUrl,
  setView,
  viewStates,
}) => {
  const buttonCreator = (id, index) => {
    const element = document.querySelector(`#${id}`)
    element.setAttribute("class", "button")
    element.setAttribute("role", "button")
    element.setAttribute("aria-label", `Go to ${id}`)
    element.setAttribute("tabindex", `${index}`)
    const clickEvent = () => (window.location.href = createLink(id, data[id]))
    element.onclick = clickEvent
    element.onkeydown = e => {
      if (e.key === "Enter") clickEvent()
    }
  }

  const setupButtons = () => {
    buttonCreator("soundcloud", 1)
    buttonCreator("spotify", 2)
    buttonCreator("instagram", 3)
    buttonCreator("bandcamp", 4)

    const profileImage = document
      .querySelector("#PROFILE")
      .querySelector("image")
    profileImage.setAttribute("xlink:href", profileImgUrl)

    playlistButton().onclick = () => setView(viewStates.PLAYLIST)
    releasesButton().onclick = () => setView(viewStates.RELEASES)

    const textEl = document.querySelector("#NAME")
    const tspans = textEl.getElementsByTagName("tspan")
    if (isDesk) {
      textEl.innerHTML = artistName
    } else {
      const templateString = artistName
        .split(" ")
        .map((word, i) => {
          if (i === 0) {
            return word
          } else {
            console.log(i)
            const t = tspans[i - 1].cloneNode(false)
            t.innerHTML = word
            return t.outerHTML
          }
        })
        .join("")
      textEl.innerHTML = templateString
    }
  }

  return (
    <div>
      <SVG src={TopSVG} onLoad={setupButtons} />
    </div>
  )
}

export default Top
