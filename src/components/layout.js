/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect } from "react"
import PropTypes from "prop-types"
// import { useStaticQuery, graphql } from "gatsby"
import "./layout.css"

const Layout = ({ children }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)
  useEffect(() => {
    // if (window && window.location.href.includes("token")) {
    //   const token = getQueryParam("token")
    //   const rToken = getQueryParam("r_token")
    //   localStorage.setItem("token", token)
    //   localStorage.setItem("rToken", rToken)
    //   window.close()
    // }
    const code = window.location.search.split("?code=")[1]
    if (!code) return
    const redirect_uri = process.env.GATSBY_REDIRECT_URI
    fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`,
      headers: {
        Authorization: "Basic " + process.env.GATSBY_BB,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then(r => {
        if (r.status !== 200) throw new Error("invalid token")
        return r.json()
      })
      .then(data => {
        console.log("setting token...")
        localStorage.setItem("refrashT", data.refresh_token)
        localStorage.setItem("arcsasT", data.access_token)
        //   window.close()
      })
      .catch(error => {
        console.log("error")
        localStorage.setItem("error", error)
        //   window.close()
      })
  }, [])

  return (
    <>
      <div className="layout">
        <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
