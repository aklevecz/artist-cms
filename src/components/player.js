import React, { useEffect, useState, useContext } from "react"
import SVG from "react-inlinesvg"
import "./player.scss"
import { playerContext } from "../../wrap-with-provider"
import { isDesk } from "../templates/artist"
import { createPortal } from "react-dom"
import seekTrack from "../services/seek-track"

const pauseButton = () => document.querySelector("#pause-button")
const playButton = () => document.querySelector("#play-button")
const Player = () => {
  const {
    isPlaying,
    pausePlayback,
    playerType,
    resumePlayback,
    track,
  } = useContext(playerContext)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!loaded) return
    if (isPlaying) {
      playButton().style.visibility = "hidden"
      pauseButton().style.visibility = "visible"
    } else {
      playButton().style.visibility = "visible"
      pauseButton().style.visibility = "hidden"
    }
  }, [isPlaying, loaded])
  useEffect(() => {
    if (!loaded) return
    pauseButton().onclick = () => pausePlayback()
    playButton().onclick = () => resumePlayback()
  }, [playerType, loaded])

  const setup = () => {
    pauseButton().style.visibility = "hidden"
    setLoaded(true)
    // if (!window) return
    // const gatsbyContainer = document.querySelector("#___gatsby")
    // if (gatsbyContainer.getBoundingClientRect().height > window.innerHeight)
    //   return
    // const playerContainer = document.querySelector("#portal")
    // const windowHeight = window.innerHeight
    // const portalHeight = playerContainer.getBoundingClientRect().height
    // gatsbyContainer.style.height = windowHeight - portalHeight + "px"
  }

  const seek = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const width = e.target.getBoundingClientRect().width
    const seekPointPercent = x / width
    const seekPoint = Math.floor(track.item.duration_ms * seekPointPercent)
    seekTrack(seekPoint)
  }

  if (!window) return <div></div>
  const playerSvg = isDesk()
    ? require("../templates/player_desk.svg")
    : require("../templates/player.svg")
  const progress = track && track.progress_ms / track.item.duration_ms
  return createPortal(
    <div className="player">
      {playerType && (
        <>
          <div
            onClick={seek}
            style={{
              position: "absolute",
              top: 0,
              height: 10,
              width: "100%",
              background: "#dd5e5e",
            }}
          ></div>
          <div
            onClick={seek}
            style={{
              position: "absolute",
              top: 0,
              height: 10,
              background: "#c688ff",
              width: progress && window.innerWidth * progress,
            }}
          ></div>
          <SVG src={playerSvg} onLoad={setup} />
        </>
      )}
    </div>,
    document.getElementById("portal")
  )
}

export default Player
