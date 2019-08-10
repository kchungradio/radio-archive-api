require('now-env')

const url = require('url')
const qs = require('querystring')

const microCors = require('micro-cors')
const cors = microCors({
  allowMethods: ['GET']
})

const db = require('./db')

const handler = async function(req) {
  if (req.url.includes('favicon')) return

  const { limit = 50, page = 0 } = qs.parse(url.parse(req.url).query)

  return db
    .query(
      `SELECT date, path FROM radio.archive
       ORDER BY date DESC
       LIMIT $1 OFFSET $2`,
      [limit, page * limit]
    )
    .then(data => data.rows)
    .then(rows =>
      rows.map(row => ({
        ...row,
        date: row.date.toISOString().split('T')[0]
      }))
    )
    .catch(console.error)
}

module.exports = cors(handler)
