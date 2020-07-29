import React, { useContext } from "react"
import SVG from "react-inlinesvg"
import MidSVG from "./MID.svg"
import { playerContext } from "../../wrap-with-provider"

const Mid = ({ svg }) => {
  const context = useContext(playerContext)
  const setupMidButtons = () => {
    const listenButton = document.querySelector("#listen")
    listenButton.setAttribute("class", "button")
    listenButton.onclick = () => context.initSoundcloud()
  }
  return (
    <SVG
      src={svg.replace("/q_auto,f_auto", "").replace("http", "https")}
      onLoad={setupMidButtons}
    />
  )
}

export default Mid
