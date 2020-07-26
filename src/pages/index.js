import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SVG from "react-inlinesvg"
import elu from "./elu.svg"
import im from "../../static/img/doors-02.jpg"
const buttonCreator = (id, index) => {
  const element = document.querySelector(`#${id}`)
  element.setAttribute("class", "button")
  element.setAttribute("role", "button")
  element.setAttribute("aria-label", `Go to ${id}`)
  element.setAttribute("tabindex", `${index}`)
  const clickEvent = () => alert(id)
  element.onclick = clickEvent
  element.onkeydown = e => {
    if (e.key === "Enter") clickEvent()
  }
}

const IndexPage = () => {
  const setupButtons = () => {
    buttonCreator("soundcloud", 1)
    buttonCreator("spotify", 2)
    buttonCreator("instagram", 3)
    buttonCreator("bandcamp", 4)
  }
  return (
    <Layout>
      <SEO title="Home" />
      <img src={im} />
      <SVG src={elu} onLoad={setupButtons} />
    </Layout>
  )
}

export default IndexPage

// const IndexPage = () => (
//   <Layout>
//     <SEO title="Home" />
//     <h1>Hi people</h1>
//     <p>Welcome to your new Gatsby site.</p>
//     <p>Now go build something great.</p>
//     <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
//       <SVG src={elu} />
//       <Image />
//     </div>
//     <Link to="/page-2/">Go to page 2</Link> <br />
//     <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
//   </Layout>
// )
