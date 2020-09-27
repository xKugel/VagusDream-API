const pluralize = require('pluralize')
const Mongoose = require( 'mongoose' )
const Schema = Mongoose.Schema
const { capitalize } = require( 'lodash' )
const Path = require('path')

const getModelSchema = modelToGet => {

  const pluralNameModel = pluralize.plural( modelToGet )
  const model = require( `./${ pluralNameModel }/domains/models/${ modelToGet }.js` )( Schema )
  return new Schema( model, {timestamps: true} )
}

const getSingularCollectionName = ( modelName ) =>
  ( modelName ) ? pluralize.singular(modelName) : ''

const getModel = ( connection, modelToGet = '' ) => {
  const singularModelName = getSingularCollectionName( modelToGet )
  const capitalizedModelName = capitalize( singularModelName )

  return ( connection && connection.models && connection.models[ capitalizedModelName ] )
    ? connection.models[ capitalizedModelName ]
    : connection.model( capitalizedModelName,  getModelSchema( singularModelName.toLowerCase() ) )
}

module.exports = getModel
