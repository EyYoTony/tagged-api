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

const listTags = (limit, lastItem, filter, cb) => {
  var query = {}
  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = isNaN(Number(last(arrFilter)))
      ? last(arrFilter)
      : Number(last(arrFilter))
    const selectorValue = arrFilter.length === 3
      ? assoc(filterField, assoc('$' + arrFilter[1], filterValue, {}), {})
      : assoc(filterField, filterValue, {})
    query = { selector: selectorValue, limit }
  } else if (lastItem) {
    query = { selector: { _id: { $gt: lastItem }, type: 'tag' }, limit }
  } else {
    query = { selector: { _id: { $gte: null }, type: 'tag' }, limit }
  }

  dalHelper.findDocs(query, cb)
}

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
  deleteTag,
  listTags
}

module.exports = dal
