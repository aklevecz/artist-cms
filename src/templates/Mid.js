import React, { useContext, useEffect } from "react"
import SVG from "react-inlinesvg"
import { playerContext } from "../../wrap-with-provider"
import { isDesk } from "./artist"
import { viewStates } from "./artist"
const Mid = ({ mid, midDesk, remoteReleaseSquare, setView }) => {
  const context = useContext(playerContext)

  // redundant
  useEffect(() => {
    const listenButton = document.querySelector("#listen")
    if (!listenButton) return
    listenButton.onclick = () => context.playSoundcloud()
  }, [context.playSoundcloud])

  const checkView = () => {
    if (!remoteReleaseSquare) setView(viewStates.PLAYLIST)
  }

  const setupSquare = () => {
    const bbox = document.querySelector("#BODY_BOX")
    const release = document.querySelector("#RELEASES")
    const { x, y, width, height } = bbox.getBoundingClientRect()
    release.setAttribute("width", width)
    release.style.position = "absolute"
    release.style.top = y
    release.style.left = x
    const listenButton = document.querySelector("#listen")
    listenButton.setAttribute("class", "button")
    listenButton.onclick = () => context.playSoundcloud()
  }

  let releaseSquare
  if (remoteReleaseSquare) {
    releaseSquare = remoteReleaseSquare.url
      .replace("/q_auto,f_auto", "")
      .replace("http", "https")
    // releaseSquare =
    //   process.env.NODE_ENV !== "development"
    //     ? require(`./release-square.svg`)
    //     : remoteReleaseSquare.url
    //         .replace("/q_auto,f_auto", "")
    //         .replace("http", "https")
  } else {
    releaseSquare = undefined
  }

  const svgSrc = require(`./MID${isDesk() ? "_desk" : ""}.svg`)
  return (
    <div id="mid-container">
      <SVG src={svgSrc} onLoad={checkView} />
      {releaseSquare && <SVG src={releaseSquare} onLoad={setupSquare} />}
    </div>
  )
}

export default Mid
