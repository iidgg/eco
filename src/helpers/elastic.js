const elastic = require('@elastic/elasticsearch')

let instance
const getElasticSearchClient = () => {
  if (instance) return instance
  instance = new elastic.Client({
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    }
  })

  return instance
}

const searchProducts = async (elasticClient, term) => {
  const res = await elasticClient.search({
    index: 'products',
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: term,
              // if exact match then boost by 5
              fields: ['title^5', 'shortDesc^2', 'desc'],
              operator: 'or',
              fuzziness: '0' // first we prefer exact matches
            }
          },
          {
            multi_match: {
              query: term,
              // if fuzzy *title* match then boost by 3
              fields: ['title^3', 'shortDesc', 'desc'],
              operator: 'or',
              fuzziness: 'AUTO' // then we look for fuzziness [car > cat bug]
            }
          }
        ]
      }
    }
  })

  return res.hits
}

module.exports = { getElasticSearchClient, searchProducts }
