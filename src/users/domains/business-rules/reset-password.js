const EncryptText = require('../../../../support/in-house-functions/cryptography/encrypt-text.js')
const CurrentDatetimeUtc = require('../../../../support/in-house-functions/date-time/current-datetime-utc.js')
const JwtDecode = require('jwt-decode')
const GetModel = require('../../../get-model.js')

const resetPassword = async (req, query, data ) => {
  const AuthModel = GetModel( req.$connection, 'authentications')
  const model = GetModel( req.$connection, 'users')
  const password = EncryptText( data.password )
  const newValues  = { $set: { password } }
  const foundToken = await AuthModel.findOne(query)
  if (!foundToken) throw new Error('tokenError: Token Invalid')
  const queryUser = {
    _id: foundToken.userId
  }
  const foundUser = await model.findOne(queryUser)
  if ( !foundUser ) throw new Error('userError: User not find.')
  const options = {
      multi: false
    , returnOriginal: true
    , new: true
    , upsert: false
  }

  return model.update( queryUser, newValues, options)
}

module.exports = { resetPassword }
