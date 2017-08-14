require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const cors = require('cors')
const helmet = require('helmet')
const port = process.env.PORT || 5000
const { pathOr, keys, pick } = require('ramda')

const tagReqFields = checkRequiredFields(['position', 'artTitle', 'photo'])
//'dateTagged',
// 'creatorName',
// 'creatorId',
const userReqFields = checkRequiredFields(['username', 'userId', 'picture'])

app.use(cors({ credentials: true }))
app.use(helmet())
app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send(
    'Welcome to the Tagged API. Here you can manage all the tags and users.'
  )
})

///////////////////////
//       TAGS        //
///////////////////////

//  Create - Post /tags/
app.post('/tags/', function(req, res, next) {
  const body = pathOr(null, ['body'], req)
  const checkResults = tagReqFields(body)

  if (checkResults.length > 0) {
    return next(
      new HTTPError(
        400,
        'Missing required fields in the request body.',
        checkResults
      )
    )
  }

  dal.createTag(body, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    console.log('Successfully created tag', result)
    res.status(201).send(result)
  })
})

//  Read - Get /tags/{:id}
app.get('/tags/:id', (req, res, next) => {
  const id = req.params.id
  dal.readTag(id, (err, result) => {
    if (err) next(new HTTPError(err.status, err.message, err))
    console.log('GET /tags/:id result', result)
    res.status(200).send(result)
  })
})

//  Update - Put /tags/{:id}
app.put('/tags/:id', (req, res, next) => {
  const body = pathOr({}, ['body'], req)
  const checkUpdateFields = checkRequiredFields([
    '_id',
    '_rev',
    'type',
    'lat',
    'long',
    'creatorName',
    'creatorId',
    'artTitle',
    'artist',
    'dateTagged',
    'photo'
  ])

  const checkResults = checkUpdateFields(body)

  if (pathOr(0, ['length'], checkResults) > 0) {
    return next(
      new HTTPError(400, 'Bad request.  Missing required fields', {
        missingFields: checkResults
      })
    )
  }

  // check the id in the path against the id in the body
  if (body['_id'] != req.params.id) {
    return next(
      new HTTPError(
        400,
        'Bad request. Tag id in path must match the tag id in the request body.'
      )
    )
  }

  if (body['type'] != 'tag') {
    return next(new HTTPError(400, "Bad request. Type must be equal to 'tag'."))
  }

  dal.updateTag(
    pick(
      [
        '_id',
        '_rev',
        'type',
        'lat',
        'long',
        'creatorName',
        'creatorId',
        'artTitle',
        'dateTagged',
        'photo',
        'artist'
      ],
      body
    ),
    (err, result) => {
      if (err) next(new HTTPError(err.status, err.message, err))
      console.log('PUT /tags/:id result', result)
      res.status(200).send(result)
    }
  )
})

//  Delete - Delete /tags/{:id}
app.delete('/tags/:id', (req, res, next) => {
  const id = req.params.id
  dal.deleteTag(id, (err, result) => {
    if (err) next(new HTTPError(err.status, err.message, err))
    console.log('DELETE /tags/:id result', result)
    res.status(200).send(result)
  })
})

//  List - Get /tags/
app.get('/tags', function(req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listTags(Number(limit), lastItem, filter, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

///////////////////////
//       USER        //
///////////////////////

//  Create - Post /users/

//  Read - Get /users/{:id}

//  Update - Put /users/{:id}

//  Delete - Delete /users/{:id}

// There is no listing of users because you should only need to see your own user

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API is running on this port: ', port))
