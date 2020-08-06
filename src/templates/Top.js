import React, { useEffect, useState, useContext } from "react"
import SVG from "react-inlinesvg"
import {
  playlistButton,
  releasesButton,
  dropNav,
  dropDownButton,
  dropUpButton,
  logButton,
} from "./selectors"
import { isDesk } from "./artist"
import { lerpTranslateY } from "./animations"
import { createLink } from "./utils"
import { playerContext } from "../../wrap-with-provider"
import authSpotify from "../services/spotify-auth"

const Top = ({
  artistName,
  data,
  profileImgUrl,
  setView,
  spotifyAuth,
  viewStates,
}) => {
  const [loaded, setLoaded] = useState(false)
  const context = useContext(playerContext)
  useEffect(() => {
    if (loaded) {
      if (spotifyAuth) {
        logButton().querySelector("text").innerHTML = "LOGOUT"
        logButton().onclick = () => {
          localStorage.removeItem("arcsasT")
          localStorage.removeItem("refrashT")
          context.setSpotifyAuth(false)
          context.setChosenDevice("")
          context.initPlayer()
        }
      }
      if (!spotifyAuth) {
        logButton().querySelector("text").innerHTML = "LOGIN"
        logButton().onclick = authSpotify
      }
    }
  }, [spotifyAuth, loaded])
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
    const dropNavHeight = dropNav().querySelector("rect").getAttribute("height")
    dropNav().setAttribute(
      "transform",
      `translate(0, -${parseInt(dropNavHeight) + 0.1})`
    )

    dropDownButton().onclick = () => lerpTranslateY(dropNav(), -240, -4)
    dropUpButton().onclick = () => lerpTranslateY(dropNav(), 4, -240)

    buttonCreator("soundcloud", 1)
    buttonCreator("spotify", 2)
    buttonCreator("instagram", 3)
    buttonCreator("bandcamp", 4)

    const profileImage = document
      .querySelector("#PROFILE")
      .querySelector("image")
    console.log(profileImage)
    profileImage.setAttribute("xlink:href", profileImgUrl)

    playlistButton().setAttribute("class", "button")
    releasesButton().setAttribute("class", "button")
    playlistButton().onclick = () => setView(viewStates.PLAYLIST)
    releasesButton().onclick = () => setView(viewStates.RELEASES)

    const textEl = document.querySelector("#NAME")
    textEl.style.stroke = "black"
    const tspans = textEl.getElementsByTagName("tspan")
    if (isDesk()) {
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
    setLoaded(true)
  }

  const svgSrc = isDesk() ? require("./TOP_desk.svg") : require("./TOP.svg")
  return (
    <div>
      <SVG src={svgSrc} onLoad={setupButtons} />
    </div>
  )
}

export default Top
