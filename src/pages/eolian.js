import React, { useState, useEffect, useContext, useRef } from "react"
import SVG from "react-inlinesvg"
import "./eolian.scss"
import {
  lerpTranslateXY,
  lerpOpacityOut,
  lerpOpacityIn,
} from "../templates/animations"
import SignInAndPickDevice from "../components/signin-and-pick-device"
import { playerContext } from "../../wrap-with-provider"
import pausePlaylistTrack from "../services/pause-playlist-track"
import startPlayingPlaylist from "../services/start-playing-playlist"
import SignInPopup from "../components/signin-popup"
import setVolume from "../services/set-volume"
import loadingGif from "../images/loading.gif"
const albumUri = "spotify:album:00DHViaM6QJwQjipBFoqsB"
const trackUris = {
  eolian: "spotify:track:495VVx56Vd5HkCw914GfCZ",
  losing_track: "spotify:track:2KjnarehBXAyjUc6FfcZ70",
  enklave: "spotify:track:5OfV5HdNjjUa8bvk1vBW6H",
  opulence: "spotify:track:4R6ofbEv0bcZzV4SgvzXVn",
  laze: "spotify:track:6afurbtcj10yYm4M1KMf0s",
  ae: "spotify:track:63m5LzFhvTRsze2CrWaAns",
}

const ebid = id => document.querySelector(`#${id}`)
const hel = e => (e.style.visibility = "hidden")
const getBaseId = e => e.id.split("-")[0]
const addClass = (e, c) => e.classList.add(c)
const isDesk = () => {
  if (typeof window !== "undefined")
    return window.innerWidth > window.innerHeight
}
const collectTextEls = g => {
  const texts = g.getElementsByTagName("text")
  return Array.from(texts)
}

const collectCoords = g => {
  const targets = g.getElementsByTagName("text")
  const data = {}
  Array.from(targets).forEach(target => {
    const baseId = getBaseId(target)
    const transform = target
      .getAttribute("transform")
      .split("(")[1]
      .split(")")[0]
      .split(" ")
    const x = parseFloat(transform[0])
    const y = parseFloat(transform[1])
    data[baseId] = { x, y }
  })
  return data
}

const DevicePicker = ({
  devices,
  pickDevice,
  setShowDevicePicker,
  queuedTrack,
}) => {
  const deviceBoxRef = useRef()
  const pickIcon = ebid("pick-device")
  const { x, y, width: pWidth } = pickIcon.getBoundingClientRect()
  useEffect(() => {
    const { height, width } = deviceBoxRef.current.getBoundingClientRect()
    deviceBoxRef.current.style.marginTop =
      -1 * (height / 2 + 10 * devices.length + 20 + 10) + "px"
    deviceBoxRef.current.style.marginLeft = (-1 * width) / 2 + pWidth / 2 + "px"
  }, [devices])
  if (typeof window === "undefined") return <div></div>
  return (
    <div
      className="device-box-container"
      ref={deviceBoxRef}
      style={{
        top: y + window.scrollY,
        left: x,
      }}
    >
      {devices.map(device => (
        <div
          style={{
            textAlign: "left",
            display: "grid",
            gridTemplateColumns: "12px 1fr",
            gridColumnGap: "7px",
          }}
          key={device.id}
          className="device"
          onClick={() => {
            pickDevice(device.id, albumUri, queuedTrack)
            setShowDevicePicker(false)
          }}
        >
          {device.is_active && (
            <div style={{ height: 10, fill: "#3fff48" }}>
              <SVG src={require("../images/music-note.svg")} />
            </div>
          )}
          <div style={{ gridColumn: 2 }}>{device.name}</div>
        </div>
      ))}
      <div className="bottom-notch">
        <SVG src={require("../images/bottom-notch.svg")} />
      </div>
    </div>
  )
}

const Eolian = () => {
  const [src, setSrc] = useState(
    isDesk()
      ? require("../images/eolian-desk.svg")
      : require("../images/eolian-mobile.svg")
  )
  const [playerOpen, setPlayerOpen] = useState(false)
  const [track, setTrack] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [queuedTrack, setQueuedTrack] = useState("")
  const [showDevicePicker, setShowDevicePicker] = useState(false)
  const volChangeRef = useRef(Date.now())
  const [loaded, setLoaded] = useState(false)

  const context = useContext(playerContext)
  useEffect(() => {
    context.initPlayer().then(() => {
      context.getDevices()
    })
  }, [])
  useEffect(() => {
    if (!context.track) return
    const duration = context.track.item.duration_ms
    const progress = context.track.progress_ms
    const durationEl = ebid("duration")
    const dX1 = parseFloat(durationEl.getAttribute("x1"))
    const dX2 = parseFloat(durationEl.getAttribute("x2"))
    const length = dX2 - dX1
    const progressEl = ebid("progress")
    progressEl.setAttribute("x2", dX1 + length * (progress / duration))
  }, [context.track])

  // **PLAYER OPEN EFFECT**
  useEffect(() => {
    if (!loaded || typeof window === "undefined") return
    const player = ebid("player")
    const playerTarget = ebid("player-target")
    const tY = parseFloat(playerTarget.getAttribute("y"))
    const cY = parseFloat(player.querySelector("#bg").getAttribute("y"))
    if (playerOpen) {
      ebid("slider").style.display = "inherit"
      lerpTranslateXY(player, 1, 1, 0, tY - cY, 0.05).then(() => {
        const { x: vX, y: vY, width } = ebid(
          "volume-target"
        ).getBoundingClientRect()
        ebid("volume-slider").style.top = vY + window.scrollY - 5 + "px"
        ebid("volume-slider").style.left = vX + "px"
        ebid("volume-slider").style.width = width + "px"

        const x1 = parseInt(ebid("volume-target").getAttribute("x1"))
        const x2 = parseInt(ebid("volume-target").getAttribute("x2"))
        ebid("volume-target").setAttribute("x2", (x2 - x1) / 2 + x1)
      })
    } else {
      ebid("slider").style.display = "none"
      const playerY = player
        .getAttribute("transform")
        .split("(")[1]
        .split(")")[0]
        .split(",")[1]
      lerpTranslateXY(player, 1, 1, parseFloat(playerY), 0, 0.05)
      setShowDevicePicker(false)
    }
    if (!context.spotifyAuth) {
      ebid("pick-device").style.display = "none"
    }
  }, [playerOpen])

  useEffect(() => {
    if (!loaded) return
    const currentTrack = ebid("track-name").textContent
    if (currentTrack !== context.track.item.name) {
      lerpOpacityOut(ebid("track-name")).then(() => {
        ebid("track-name").textContent = context.track.item.name
        lerpOpacityIn(ebid("track-name"))
      })
    }
    ebid("track-name").textContent = currentTrack
  }, [context.track && context.track.item.name])
  // ***

  useEffect(() => {
    if (playerOpen) {
      context.playSpotifyTrack(albumUri, queuedTrack)
    }
    if (!playerOpen && context.chosenDevice) {
      context.playSpotifyTrack(albumUri, queuedTrack)
    }
  }, [queuedTrack])

  useEffect(() => {
    if (!loaded) return
    if (context.isPlaying) {
      ebid("pause").style.display = "inherit"
      ebid("play").style.display = "none"
    } else {
      ebid("pause").style.display = "none"
      ebid("play").style.display = "inherit"
    }
  }, [context.isPlaying])

  useEffect(() => {
    if (typeof window === "undefined") return
    const resize = () => {
      setSrc(
        isDesk()
          ? require("../images/eolian-desk.svg")
          : require("../images/eolian-mobile.svg")
      )
    }
    window.addEventListener("resize", resize, false)

    return () => window.removeEventListener("resize", resize, false)
  }, [])

  const toggleDevicePicker = () => {
    setShowDevicePicker(!showDevicePicker)
  }
  useEffect(() => {
    if (!loaded) return
    const devicePicker = ebid("pick-device")
    if (!context.spotifyAuth) {
      devicePicker.style.display = "none"
    } else {
      devicePicker.style.display = "inherit"
    }
    devicePicker.onclick = toggleDevicePicker
  }, [showDevicePicker, context.spotifyAuth])

  const startPlaying = () => {
    startPlayingPlaylist().catch(e => {
      startPlayingPlaylist(albumUri, queuedTrack)
    })
  }

  // ** VOLUME CHANGE
  const volumeChange = e => {
    // STAR IS THE ICON #SLIDER IS ITS DIV
    ebid("star").style.display = "inherit"
    const { x, y, width } = e.target.getBoundingClientRect()
    // SLIDER IS THE INPUT ELEMENT
    ebid("slider").style.top = y + window.scrollY - 7 + "px"
    const volPos =
      x +
      width * (e.target.value / 100) -
      ebid("slider").getBoundingClientRect().width / 2
    ebid("slider").style.left = volPos + "px"
    if (typeof window === "undefined") return
    ebid("volume-target").setAttribute(
      "x2",
      volPos *
        (parseInt(
          document
            .querySelectorAll("svg")[1]
            .getAttribute("viewBox")
            .split(" ")[2]
        ) /
          window.innerWidth)
    )
    if (Date.now() - volChangeRef.current > 1000) {
      setVolume(e.target.value)
      volChangeRef.current = Date.now()
    }
  }

  // UPDATE PLAY CLICK
  useEffect(() => {
    if (!loaded) return
    const play = ebid("play")
    play.onclick = () => startPlaying()
  }, [queuedTrack])

  // ** SETUP **
  const setup = () => {
    const viewBox = document.querySelector("#viewBox")
    const svg = document.querySelectorAll("svg")[1]
    svg.setAttribute(
      "viewBox",
      `0 0 ${viewBox.getAttribute("width")} ${viewBox.getAttribute("height")}`
    )
    ebid("track-name").textContent = ""
    const tracksPre = ebid("tracks-pre")
    const tracksTarget = ebid("tracks-target")
    const listenButton = ebid("listen-button")
    hel(tracksTarget)
    const preTexts = collectTextEls(tracksPre)
    const tarCoords = collectCoords(tracksTarget)
    const preCoords = collectCoords(tracksPre)

    const pause = ebid("pause")
    pause.style.display = "none"
    pause.onclick = () => pausePlaylistTrack()
    const play = ebid("play")
    play.onclick = () => startPlaying()

    const close = ebid("player-close")
    const closePlayer = () => {
      setPlayerOpen(false)
    }
    close.onclick = closePlayer
    const openPlayer = e => {
      setTrack(e.currentTarget.id.split("-")[0].replace("_", " "))
      setPlayerOpen(true)
    }

    const moveTracks = () => {
      lerpOpacityOut(listenButton).then(() => {
        listenButton.remove()
      })
      preTexts.forEach(text => {
        const uri = trackUris[text.id.toLowerCase().split("-")[0]]
        text.onclick = e => {
          setShowPopup(true)
          setQueuedTrack(uri)
          openPlayer(e)
        }
        text.setAttribute("track-data", uri)
        addClass(text, "button")
        const baseId = getBaseId(text)
        lerpTranslateXY(
          text,
          preCoords[baseId].x,
          tarCoords[baseId].x,
          preCoords[baseId].y,
          tarCoords[baseId].y
        )
      })
    }

    const devicePicker = ebid("pick-device")
    devicePicker.onclick = toggleDevicePicker

    addClass(listenButton, "button")
    listenButton.onclick = moveTracks

    setTimeout(() => {
      document.body.style.background = viewBox.style.fill
      document.querySelector("html").style.background = viewBox.style.fill
      setLoaded(true)
    }, 3000)

    if (typeof window !== "undefined")
      ebid("bandcamp").onclick = () =>
        window.open("https://shallnotfade.bandcamp.com/album/eolian-ep")
    ebid("soundcloud").onclick = () =>
      window.open("https://soundcloud.com/eluize")
    ebid("spotify").onclick = () =>
      window.open("https://open.spotify.com/artist/4UynZk3RxczOK1AwaHR5ha")
  }

  // This could be backwards where the presentational layer (the SVG)
  // is at the top of the hierarchy since it needs to load before any
  // interactions can be defined

  // So a control layer would be defined once that is loaded (and even the window)
  // to reduce need for checking for objects that are not present.

  // This presenational layer could have more complex SVG logic that builds various
  // components of a frontend that can then be unified once they are all loaded

  // This would allow control layers to be more modular

  return (
    <>
      <div>
        <SVG
          style={{ width: 20, display: "none" }}
          id="slider"
          src={require("../images/star.svg")}
        />
      </div>
      {!loaded && (
        <img
          style={{ display: "block", margin: "16% auto" }}
          id="loading-gif"
          src={loadingGif}
        />
      )}
      {showPopup && !context.chosenDevice && (
        <SignInPopup showPopup={setShowPopup} />
      )}
      {showDevicePicker && (
        <DevicePicker
          devices={context.devices}
          pickDevice={context.pickDevice}
          setShowDevicePicker={setShowDevicePicker}
          queuedTrack={queuedTrack}
        />
      )}
      <SVG
        src={src}
        onLoad={setup}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}
      />
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="slider"
        id="volume-slider"
        onChange={volumeChange}
        onMouseUp={() => (ebid("star").style.display = "none")}
        onTouchEnd={() => (ebid("star").style.display = "none")}
      />
    </>
  )
}

export default Eolian
