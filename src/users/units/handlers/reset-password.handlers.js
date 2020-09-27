const Path = require('path')
const thisModel = Path.dirname( Path.dirname( Path.dirname( __filename ) ) ).split( Path.sep ).pop()
const GetModel = require('../../../get-model.js')
const thisHandler = Path.basename( __filename ).split( '.' )[ 0 ]

const resetPassword = async (req, res, next) => {
  const BusinessRules = require(`../../domains/business-rules/${thisHandler}.js`)
  const query = {
    token: req.params.token
  }
  try {
    await BusinessRules.resetPassword( req, query, req.body )
    return res.send( 200 ,'Alterado com Sucesso')
  } catch (e) {
    console.log('error: \n', e);
    return res.send( 404 , 'User Not Found' )
  }
  next()
}

module.exports = { resetPassword }
