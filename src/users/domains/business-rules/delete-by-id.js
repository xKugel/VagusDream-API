const GetModel = require('../../../get-model.js')

const deleteById = async ( req, query ) => {
  const model = GetModel(req.$connection, req.$model)
  const foundUser = await model.findOne( query )
  if (!foundUser)
    throw new Error('userError: User Not Found.')
  return model.remove( query )
}
module.exports = { deleteById }
