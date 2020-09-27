const GetModel = require('../../../get-model.js')
const Nodemailer = require('nodemailer')
const GenerateJwt = require('../../../../support/in-house-functions/jwt/generate-jwt.js')
const CurrentDatetimeUtc= require('../../../../support/in-house-functions/date-time/current-datetime-utc')

const verifyEmail = async ( req, query ) => {
  const model = GetModel( req.$connection, req.$model )
  const AuthModel = GetModel( req.$connection, 'authentications')

  const user = ( query.email ) ? await model.findOne( query ) : ''
  if (!user) throw new Error('User Not Find')

  const queryAuthLogged = {
      userId : user._id
    , deviceName: 'Notebook'
    , networkIp: '177.255.255.255'
    , platformOS: 'LinuxOS'
    , expire: Date.now() + 3600000
  }

  const payloadToken = {
      userId: user._id
    , userRole: user.role
  }

  const foundAuth = await AuthModel.findOne( queryAuthLogged )
  const tokenObject = {
      secret: req.$client.apiSecret
    , payload: payloadToken
  }
  req.$token =  GenerateJwt( tokenObject )
  const authData = {
      token: req.$token
    , userId: payloadToken.userId
    , deviceName: 'Notebook'
    , networkIp: '177.255.255.255'
    , platformOS: 'LinuxOS'
    , expire: Date.now() + 3600000
  }

  if (!foundAuth) {
    const createData = { ...authData, createdAt: CurrentDatetimeUtc() }
    await AuthModel.create( createData )
  }
  if (foundAuth) {
    const updateData = { ...authData, updatedAt: CurrentDatetimeUtc() }
    await AuthModel.findOneAndUpdate( { _id: foundAuth._id }, updateData, { multi : false } )
  }







  const smtpTransport = Nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPW
    }
  })
  const mailOptions = {
    to: user.email,
    from: process.env.GMAIL,
    subject: 'Alteração de Senha',
    text: `Clique no link abaixo para recuperar sua senha!\n http://localhost:8080/#/auth/reset-password/${req.$token}`
  }
  await smtpTransport.sendMail(mailOptions, function(err) {
    if (err) console.log(err)
  })



  return user || {}
}

module.exports = { verifyEmail }
