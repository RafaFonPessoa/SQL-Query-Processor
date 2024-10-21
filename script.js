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

  parsed.select = selectMatch ? selectMatch[1] : null;
  parsed.from = fromMatch ? fromMatch[1] : null;
  parsed.where = whereMatch ? whereMatch[1] : null;
  
  return parsed;
}

function generateOperatorGraph(parsed) {
  const graph = [];

  if (parsed.select) {
    graph.push({ operator: 'Projection', details: parsed.select });
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
