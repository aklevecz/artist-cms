import React, { useContext, useEffect } from "react"
import SVG from "react-inlinesvg"
import { playerContext } from "../../wrap-with-provider"
import { isDesk } from "./artist"

import releaseSquare from "./release-square.svg"

const Mid = ({ mid, midDesk, remoteReleaseSquare }) => {
  const context = useContext(playerContext)

  // redundant
  useEffect(() => {
    const listenButton = document.querySelector("#listen")
    if (!listenButton) return
    listenButton.onclick = () => context.playSoundcloud()
  }, [context.playSoundcloud])

  const setupMidButtons = () => {}

  const setupSquare = () => {
    // const picture = document.querySelector("#RELEASES").innerHTML
    // const g = document.createElement("g")
    // g.innerHTML = picture
    // const release = document.querySelector("#BODY_BOX")
    // release.appendChild(g)
    const bbox = document.querySelector("#BODY_BOX")
    const release = document.querySelector("#RELEASES")
    console.log(release, bbox)
    const { x, y, width, height } = bbox.getBoundingClientRect()
    release.setAttribute("width", width)
    release.style.position = "absolute"
    release.style.top = y
    release.style.left = x
    const listenButton = document.querySelector("#listen")
    listenButton.setAttribute("class", "button")
    listenButton.onclick = () => context.playSoundcloud()
  }
  const remoteSvgFile = isDesk() ? midDesk : mid
  console.log(remoteReleaseSquare)
  const releaseSquare =
    process.env.NODE_ENV === "development"
      ? require(`./release-square.svg`)
      : remoteReleaseSquare.url
          .replace("/q_auto,f_auto", "")
          .replace("http", "https")

  const svgSrc = require(`./MID${isDesk() ? "_desk" : ""}.svg`)
  return (
    <div id="mid-container">
      <SVG src={svgSrc} onLoad={setupMidButtons} />
      <SVG src={releaseSquare} onLoad={setupSquare} />
    </div>
  )
}

export default Mid
