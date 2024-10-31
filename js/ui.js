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
  
    const operatorGraph = sqlToAlgebraRelacional(query);
    console.log(operatorGraph)
    const executionPlan = generateExecutionGraph(operatorGraph);
    
    displayResults(parsed, operatorGraph, executionPlan);
  });
  
  function displayResults(parsed, operatorGraph, executionPlan) {
    document.getElementById('parsedQuery').textContent = JSON.stringify(parsed, null, 2);
    console.log(operatorGraph)
    document.getElementById('operatorGraph').textContent = operatorGraph;
    
    document.getElementById('executionPlan').textContent = executionPlan;
  }
  