// Mapeia o nome das tabelas e os nomes das colunas
const schema = {
    cliente: ['idCliente', 'Nome', 'Email', 'Nascimento', 'Senha', 'TipoCliente_idTipoCliente', 'DataRegistro'],
    endereco: ['idEndereco', 'EnderecoPadrao', 'Logradouro', 'Num', 'Complemento', 'Bairro', 'Cidade', 'UF', 'CEP', 'TipoEndereco_idTipoEndereco', 'Cliente_idCliente'],
    pedido: ['idPedido', 'Status_idStatus', 'DataPedido', 'ValorTotalPedido', 'Cliente_idCliente'],
    produto: ['idProduto', 'Nome', 'Descricao', 'Preco', 'QuantEstoque', 'Categoria_idCategoria'],
    pedido_has_produto: ['idPedidoProduto', 'Pedido_idPedido', 'Produto_idProduto', 'Quantidade', 'PrecoUnitario'],
    status: ['idStatus', 'Descricao'],
    telefone: ['Numero', 'Cliente_idCliente'],
    categoria: ['idCategoria', 'Descricao'],
    tipoendereco: ['idTipoEndereco', 'Descricao'],
    tipocliente: ['idTipoCliente', 'Descricao']
  };