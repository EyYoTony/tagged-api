const { toLower, concat, trim, compose, replace } = require('ramda')

module.exports = (prefix, value) => {
  //prefix :  "tag_"
  //value: "{lat} {long} {owner}"
  // returns: "tag_big_time_owner_33"

  return compose(concat(prefix), replace(/ /g, '_'), trim, toLower)(value)
}
