require('dotenv').config()
const PouchDB = require('pouchdb')
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .bulkDocs([
    {
      _id: 'tag_2342_1e4ef292-5a2c-4bf4-a6ed-35e3e297eb98',
      type: 'tag',
      lat: '32.7765° N',
      long: '79.9311° W',
      creatorName: 'EyYoTony',
      creatorId: '2232',
      artTitle: 'hotdogs galore',
      dateTagged: '11:21AM 8/8/2017',
      photo:
        'http://beverlypress.com/wp-content/uploads/2016/07/hot-dog-06.jpg',
      artist: 'Unknown'
    }
  ])
  .then(function(result) {
    console.log('Attempting to load data. Inspect each result item below: ')
    console.log(JSON.stringify(result, null, 2))
  })
  .catch(function(err) {
    console.log(err)
  })

// {
//     "lat": "32.7765° N",
//     "long": "79.9311° W",
//     "creatorName": "EyYoTony",
//     "creatorId": 2342,
//     "artTitle": "hotdogs galore",
//     "dateTagged": "11:21AM 8/8/2017",
//     "photo": "hotdog.jpg",
//     "artist": "ItIsKnown"
// }
