import React, { useContext, useEffect } from "react"
import SVG from "react-inlinesvg"
import { playerContext } from "../../wrap-with-provider"
import { isDesk } from "./artist"
import { viewStates } from "./artist"
import Playlist from "../components/playlist"
const Mid = ({
  mid,
  midDesk,
  remoteReleaseSquare,
  setView,
  view,
  tracks,
  playlistUri,
}) => {
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
    console.log(x, y, height)
    // release.setAttribute("width", "100%")
    release.style.maxWidth = "500px"
    release.style.position = "absolute"
    console.log(document.documentElement.scrollTop)
    // release.style.top = y + document.documentElement.scrollTop
    release.style.left = x
    const listenButton = document.querySelector("#listen")
    listenButton.setAttribute("class", "button")
    listenButton.onclick = () => context.playSoundcloud()
    const viewportmeta = document.querySelector("meta[name=viewport]")
    viewportmeta.setAttribute(
      "content",
      `width=${window.innerWidth - 10}; user-scaleable=yes;`
    )
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
      {view === viewStates.PLAYLIST && (
        <Playlist tracks={tracks} playlistUri={playlistUri} />
      )}
    </div>
  )
}

export default Mid
