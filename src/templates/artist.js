import React from "react"
import { graphql } from "gatsby"
export const query = graphql`
  query($regexName: String!) {
    jsonFiles(name: { regex: $regexName }) {
      name
      spotify
      soundcloud
      instagram
      bandcamp
    }
  }
`
const Artist = props => {
  return (
    <div style={{ color: "white" }}>{JSON.stringify(props.data.jsonFiles)}</div>
  )
}

export default Artist
