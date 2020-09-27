const Joi = require('joi')

const body = Joi.object().keys({
  descricao  : Joi.string().required(),
  qtdEstoque : Joi.string().required(),
  preco : Joi.string().required()
})

module.exports = { body }
