const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const template = path.resolve(`src/templates/artist.js`)

  return graphql(`
    query loadArtistQuery {
      allJsonFiles {
        edges {
          node {
            name
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }
    result.data.allJsonFiles.edges.forEach(edges => {
      createPage({
        path: `${edges.node.name.toLowerCase()}`,
        component: template,
        context: {
          frogs: "frogs",
          regexName: `/^${edges.node.name}$/i`,
        },
      })
    })
  })
}
