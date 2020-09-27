const model = ( Schema ) => ({
		descricao: { type: String, required: true }
	, qtdEstoque: { type: Number, required: true }
	, preco: { type: Number, required: true }
})

module.exports = model
