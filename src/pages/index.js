import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql, Link } from "gatsby"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allJsonFiles {
        edges {
          node {
            name
          }
        }
      }
    }
  `)
  let heading
  return (
    <Layout>
      <SEO title="Home" />
      <h1>HOWDY</h1>
      {data.allJsonFiles.edges.map(n => {
        const link = n.node.name.split(" ").join("-").toLowerCase()
        if (heading !== link[0]) {
          heading = link[0]
          heading = isNaN(heading) ? heading : "#"
          return (
            <>
              <div className="link-section-heading">{heading}</div>
              <Link className="link" to={`/${link}`}>
                {n.node.name}
              </Link>
            </>
          )
        }
        heading = link[0]
        return (
          <Link className="link" to={`/${link}`}>
            {n.node.name}
          </Link>
        )
      })}
    </Layout>
  )
}

export default IndexPage
