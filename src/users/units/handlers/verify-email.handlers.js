const Path = require('path')
const thisModel = Path.dirname( Path.dirname( Path.dirname( __filename ) ) ).split( Path.sep ).pop()
const thisHandler = Path.basename( __filename ).split( '.' )[ 0 ]
const GetModel = require('../../../get-model.js')

const verifyEmail = async (req, res, next) => {
  const BusinessRules = require(`../../domains/business-rules/${thisHandler}.js`)
  req.$model = thisModel
  const query = { email: req.params.email }

  try {
    const doc = await BusinessRules.verifyEmail( req, query )
    res.send( 200, doc || {} )
  } catch (e) {
    console.log('error: \n', e);
    res.send( 500, e.message )
  }
  next()
}

module.exports = { verifyEmail }
