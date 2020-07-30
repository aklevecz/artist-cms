import React, { useContext } from "react"
import SVG from "react-inlinesvg"
import { playerContext } from "../../wrap-with-provider"
import { isDesk } from "./artist"

const Mid = ({ mid, midDesk }) => {
  const context = useContext(playerContext)
  const setupMidButtons = () => {
    const listenButton = document.querySelector("#listen")
    listenButton.setAttribute("class", "button")
    listenButton.onclick = () => context.initSoundcloud()
  }
  //   const formattedName = artistName.split(" ").join("-").toLowerCase()
  //   const filePath = `Artists/${formattedName}/MID${isDesk() ? "_desk" : ""}/svg`

  const remoteSvgFile = isDesk() ? midDesk : mid

  const svgSrc =
    process.env.NODE_ENV !== "development"
      ? require(`./MID${isDesk() ? "_desk" : ""}.svg`)
      : remoteSvgFile.url.replace("/q_auto,f_auto", "").replace("http", "https")
  console.log(svgSrc)
  return (
    <div id="mid-container">
      <SVG src={svgSrc} onLoad={setupMidButtons} />
    </div>
  )
}

export default Mid
