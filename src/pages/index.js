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
  return (
    <Layout>
      <SEO title="Home" />
      <h1>HOWDY</h1>
      {data.allJsonFiles.edges.map(n => (
        <Link
          className="link"
          to={`/${n.node.name.split(" ").join("-").toLowerCase()}`}
        >
          {n.node.name}
        </Link>
      ))}
    </Layout>
  )
}

export default IndexPage
