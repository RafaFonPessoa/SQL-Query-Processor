
//Object que mapeia o nome das tabelas e os nomes das colunas
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

document.getElementById('processQueryBtn').addEventListener('click', function() {
  const query = document.getElementById('queryInput').value;
  
  if (query.trim() === '') {
    alert('Please enter a SQL query');
    return;
  }
  
  if (!validateSQLQuery(query)) {
    alert('A consulta SQL não é válida. Por favor, verifique a sintaxe.');
    return;
  }

  const parsed = parseSQLQuery(query);
  
  if (!validateTablesAndColumns(parsed)) {
    return;
  }

  const operatorGraph = generateOperatorGraph(parsed);
  const executionPlan = generateExecutionPlan(operatorGraph);
  
  displayResults(parsed, operatorGraph, executionPlan);
});


function validateSQLQuery(query) {
  const sqlPattern = /^SELECT\s+.+?\s+FROM\s+.+?(\s+WHERE\s+.+?)?$/i;
  return sqlPattern.test(query.trim());
}

function parseSQLQuery(query) {
  const parsed = {};
  
  const selectMatch = query.match(/SELECT (.+?) FROM/i);
  const fromMatch = query.match(/FROM (.+?)( WHERE|$)/i);
  const whereMatch = query.match(/WHERE (.+)/i);

  parsed.select = selectMatch ? selectMatch[1].split(',').map(col => col.trim()) : null;
  parsed.from = fromMatch ? fromMatch[1].trim() : null;
  parsed.where = whereMatch ? whereMatch[1] : null;
  
  return parsed;
}

function validateTablesAndColumns(parsed) {
  const { select, from } = parsed;

  // Verificar se a tabela existe
  if (!schema[from]) {
    alert(`A tabela "${from}" não existe no banco de dados.`);
    return false;
  }
  
  // Verificar se as colunas existem
  for (const column of select) {
    if (!schema[from].includes(column)) {
      alert(`A coluna "${column}" não existe na tabela "${from}".`);
      return false;
    }
  }
  
  return true;
}

function generateOperatorGraph(parsed) {
  const graph = [];

  if (parsed.select) {
    graph.push({ operator: 'Projection', details: parsed.select.join(', ') });
  }
  
  if (parsed.from) {
    graph.push({ operator: 'Scan', details: parsed.from });
  }
  
  if (parsed.where) {
    graph.push({ operator: 'Selection', details: parsed.where });
  }
  
  return graph;
}

function generateExecutionPlan(graph) {
  return graph.map((node, index) => `passo ${index + 1}: ${node.operator} on ${node.details}`).join('\n');
}

function displayResults(parsed, graph, executionPlan) {
  document.getElementById('parsedQuery').textContent = JSON.stringify(parsed, null, 2);
  
  const graphOutput = graph.map(node => `${node.operator}(${node.details})`).join(' -> ');
  document.getElementById('operatorGraph').textContent = graphOutput;
  
  document.getElementById('executionPlan').textContent = executionPlan;
}
