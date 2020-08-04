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
  console.log(track)
  return createPortal(
    <div className="player">
      <div
        onClick={seek}
        style={{
          position: "absolute",
          top: 0,
          height: 10,
          width: "100%",
          background: "yellow",
        }}
      ></div>
      <div
        onClick={seek}
        style={{
          position: "absolute",
          top: 0,
          height: 10,
          background: "red",
          width: progress && window.innerWidth * progress,
        }}
      ></div>
      {playerType && <SVG src={playerSvg} onLoad={setup} />}
    </div>,
    document.getElementById("portal")
  )
}

export default Player
