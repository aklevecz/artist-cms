import React, { useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SVG from "react-inlinesvg"

export const query = graphql`
  query($regexName: String!, $cloudinaryArtist: String!) {
    jsonFiles(name: { regex: $regexName }) {
      name
      spotify
      soundcloud
      instagram
      bandcamp
    }
    cloudinaryMedia(public_id: { eq: $cloudinaryArtist }) {
      url
    }
  }
`

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

const Artist = props => {
  if (typeof window === "undefined") return <div></div>
  const isDesk = window.innerWidth > 768
  const elu = isDesk ? require("./elu_desk.svg") : require("./elu.svg")

  const buttonCreator = (id, index) => {
    const element = document.querySelector(`#${id}`)
    element.setAttribute("class", "button")
    element.setAttribute("role", "button")
    element.setAttribute("aria-label", `Go to ${id}`)
    element.setAttribute("tabindex", `${index}`)
    const clickEvent = () =>
      (window.location.href = createLink(id, props.data.jsonFiles[id]))
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
    profileImage.setAttribute("xlink:href", props.data.cloudinaryMedia.url)

    const textEl = document.querySelector("#NAME")
    const tspans = textEl.getElementsByTagName("tspan")
    const artistName = props.data.jsonFiles.name
    if (isDesk) {
      textEl.innerHTML = props.data.jsonFiles.name
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

    const client_id = "68ca93c0637a090be108eb8c8f3f8729"
    console.log(window.SC)
    if (!window.SC) return
    const SC = window.SC
    SC.initialize({
      client_id,
    })

    SC.stream("/tracks/861776977").then(function (player) {
      const listenButton = document.querySelector("#listen")
      listenButton.setAttribute("class", "button")
      listenButton.onclick = () => player.play()
    })
  }
  return (
    <Layout>
      <SEO title="Home" />
      <SVG src={elu} onLoad={setupButtons} />
    </Layout>
  )
}

export default Artist
