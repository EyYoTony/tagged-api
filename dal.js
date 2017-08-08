require('dotenv').config()
const dalHelper = require('./lib/dal-helper')
const pkGenerator = require('./lib/build-pk')
const { assoc, pathOr, split, last, head, prop } = require('ramda')
const uuid = require('uuid')

////////////////////
//     TAGS       //
////////////////////

// req fields:
// ['lat','long','creatorName','creatorId','artTitle','dateTagged']
// also has 'artist' which defaults to 'Unknown' if no field

const createTag = (tag, callback) => {
  const id = pkGenerator('tag_', `${prop('creatorId', tag)} ${uuid.v4()}`)
  const artCreator = pathOr('Unknown', ['artist'], tag)
  tag = assoc('artist', artCreator, tag)
  tag = assoc('_id', id, tag)
  tag = assoc('type', 'tag', tag)
  console.log('profile', tag)
  dalHelper.create(tag, callback)
}

const readTag = (id, callback) => dalHelper.read(id, callback)

const updateTag = (profile, callback) => dalHelper.update(profile, callback)

const deleteTag = (id, callback) => dalHelper.deleteDoc(id, callback)

////////////////////
//     USERS      //
////////////////////

////////////////////
//     Export     //
////////////////////

const dal = {
  createTag,
  readTag,
  updateTag,
  deleteTag
}

module.exports = dal
