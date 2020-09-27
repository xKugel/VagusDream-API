const GetModel = require('../../../get-model.js')
const isEmpty = require('lodash/isEmpty')

const getAll = async ( req, query={}, options ) => {
  const model = GetModel( req.$connection, req.$model )
  let customQuery = {}
  if ( query.filter ){
    const regex = `${ query.filter }`
    const regexToFind = { $regex: new RegExp(regex), $options: 'ig' }
    customQuery = { $or: [
      { fullname: regexToFind },
      { username: regexToFind },
      { role: regexToFind } ]
    }
  }
  const count = await model.countDocuments(customQuery)
  const aggregate =  [
      { "$match": customQuery }
    , { $addFields: { "count": count, label: "$fullname", value: "$_id" } }
  ]
  if ( options.limit ) {
    aggregate.push({ $skip: ( options.skip ? options.skip - 1  : options.skip ) * options.limit })
    aggregate.push({ $limit: options.limit })
  }

  if (!isEmpty(options.columns)) {
    const obj = {}
    options.columns.map((cur) => {
      obj[ cur ] = 1
    })
    const fields = { ...obj }
    aggregate.push({ $project: fields})
  }

  const result = await model.aggregate( aggregate )
  return result
}

module.exports = { getAll }
