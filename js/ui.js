document.getElementById('processQueryBtn').addEventListener('click', function() {
    const query = document.getElementById('queryInput').value;
    
    if (query.trim() === '') {
      alert('Escreva uma SQL Query');
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
  
  function displayResults(parsed, graph, executionPlan) {
    document.getElementById('parsedQuery').textContent = JSON.stringify(parsed, null, 2);
    
    const graphOutput = graph.map(node => `${node.operator}(${node.details})`).join(' -> ');
    document.getElementById('operatorGraph').textContent = graphOutput;
    
    document.getElementById('executionPlan').textContent = executionPlan;
  }
  