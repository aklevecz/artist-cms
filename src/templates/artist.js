import React, { useState, useEffect, useContext } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import getPlaylistTracks from "../services/get-playlist-tracks"
import Playlist from "../components/playlist"
import "./artist.scss"
import Top from "./Top"
import Mid from "./Mid"
import { releasesButton, playlistButton, RELEASE_BOX } from "./selectors"
import Player from "../components/player"
import { playerContext } from "../../wrap-with-provider"
import getArtist from "../services/get-artist"
import getArtistTopTracks from "../services/get-artist-top-tracks"

export const query = graphql`
  query(
    $regexName: String!
    $profileUrl: String!
    $midUrl: String!
    $midUrlDesk: String!
    $releaseSquare: String!
  ) {
    jsonFiles(name: { regex: $regexName }) {
      name
      spotify
      soundcloud
      instagram
      bandcamp
      curated_playlist
      soundcloud_release_trackId
    }
    profile: cloudinaryMedia(public_id: { eq: $profileUrl }) {
      url
    }
    mid: cloudinaryMedia(public_id: { eq: $midUrl }) {
      url
    }
    midDesk: cloudinaryMedia(public_id: { eq: $midUrlDesk }) {
      url
    }
    releaseSquare: cloudinaryMedia(public_id: { eq: $releaseSquare }) {
      url
    }
  }
`

export const viewStates = {
  RELEASES: "releases",
  PLAYLIST: "playlist",
  ABOUT: "about",
}
export const isDesk = () => window.innerWidth > 768

const Artist = props => {
  const [image, setImage] = useState(
    props.data.profile && props.data.profile.url
  )
  const [tracks, setTracks] = useState()
  const [view, setView] = useState(viewStates.RELEASES)
  const context = useContext(playerContext)

  const viewPlaylist = () => {
    playlistButton().querySelector("text").style.fill = "#f06a6a"
    releasesButton().querySelector("text").style.fill = "white"
    RELEASE_BOX().style.visibility = "hidden"
  }
  useEffect(() => {
    if (!RELEASE_BOX()) return
    if (view === viewStates.PLAYLIST) {
      alert("AY")
      viewPlaylist()
    }
    if (view === viewStates.RELEASES) {
      playlistButton().querySelector("text").style.fill = "white"
      releasesButton().querySelector("text").style.fill = "#f06a6a"
      RELEASE_BOX().style.visibility = "visible"
    }
  }, [view])

  const getArtistPlaylist = () => {
    if (props.data.jsonFiles.curated_playlist) {
      getPlaylistTracks(props.data.jsonFiles.curated_playlist)
        .then(tracks => {
          setTracks(tracks)
          // context.setSpotifyAuth(true)
        })
        .catch(err => {
          // context.setSpotifyAuth(false)
        })
    } else {
      getArtistTopTracks(props.data.jsonFiles.spotify.split(":")[2]).then(
        tracks => {
          console.log(tracks)
          setTracks(tracks)
        }
      )
    }
  }

  const getArtistsProfile = () => {
    if (image) return
    console.log("calling profile")
    getArtist(props.data.jsonFiles.spotify.split(":")[2]).then(data => {
      setImage(data.images[0].url)
    })
  }

  useEffect(() => {
    context.getAppToken().then(getArtistPlaylist)
    context.getDevices()
    context.initSoundcloud(props.data.jsonFiles.soundcloud_release_trackId)
  }, [])

  useEffect(() => {
    const currentToken = localStorage.getItem("arcsasT")
    if (currentToken) {
      console.log("check the token")
      // getUser(currentToken).then(data => setUser(data.display_name))
    }

    const handlerEvent = event => {
      console.log("index storage event")
      if (event.key !== "arcsasT") return
      // getArtistPlaylist()
      context.getDevices()
    }
    if (window) window.addEventListener("storage", handlerEvent, false)

    return () => window.removeEventListener("storage", handlerEvent, false)
  }, [])

  if (!image) {
    getArtistsProfile()
  }
  if (typeof window === "undefined")
    return (
      <div>
        <SEO title={props.data.jsonFiles.name} image={image} />
      </div>
    )
  return (
    <Layout>
      <SEO title={props.data.jsonFiles.name} image={image} />
      {image && (
        <Top
          profileImgUrl={image}
          isDesk={isDesk}
          data={props.data.jsonFiles}
          artistName={props.data.jsonFiles.name}
          setView={setView}
          viewStates={viewStates}
          spotifyAuth={context.spotifyAuth}
        />
      )}
      {image && (
        <Mid
          mid={props.data.mid}
          midDesk={props.data.midDesk}
          releaseTrackId={props.data.jsonFiles.soundcloud_release_trackId}
          remoteReleaseSquare={props.data.releaseSquare}
          setView={setView}
        />
      )}
      {view === viewStates.PLAYLIST && (
        <Playlist
          tracks={tracks}
          playlistUri={props.data.jsonFiles.curated_playlist}
        />
      )}
      <Player />
    </Layout>
  )
}

export default Artist
