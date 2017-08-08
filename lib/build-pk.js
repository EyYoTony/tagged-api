const { toLower, concat, trim, compose, replace } = require('ramda')

module.exports = (prefix, value) => {
  //prefix :  "tag_"
  //value: "{owner_user} {uuid.v4()}"
  // returns: "tag_234523_1e4ef292-5a2c-4bf4-a6ed-35e3e297eb98""

  return compose(concat(prefix), replace(/ /g, '_'), trim, toLower)(value)
}
