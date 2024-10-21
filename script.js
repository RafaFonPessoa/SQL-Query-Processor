// Processa a consulta ao clicar no botão
document.getElementById('processQueryBtn').addEventListener('click', function() {
    const query = document.getElementById('queryInput').value;
    
    if (query.trim() === '') {
      alert('Please enter a SQL query');
      return;
    }
    
    const parsed = parseSQLQuery(query);
    const operatorGraph = generateOperatorGraph(parsed);
    const executionPlan = generateExecutionPlan(operatorGraph);
    
    displayResults(parsed, operatorGraph, executionPlan);
  });
  
  // Função para fazer o parse da consulta SQL
  function parseSQLQuery(query) {
    const parsed = {};
    
    // Match básico para SELECT, FROM e WHERE
    const selectMatch = query.match(/SELECT (.+?) FROM/i);
    const fromMatch = query.match(/FROM (.+?)( WHERE|$)/i);
    const whereMatch = query.match(/WHERE (.+)/i);
  
    parsed.select = selectMatch ? selectMatch[1] : null;
    parsed.from = fromMatch ? fromMatch[1] : null;
    parsed.where = whereMatch ? whereMatch[1] : null;
    
    return parsed;
  }
  
  // Função para gerar o grafo de operadores (exemplo básico)
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
  
  // Função para gerar o plano de execução
  function generateExecutionPlan(graph) {
    return graph.map((node, index) => `Step ${index + 1}: ${node.operator} on ${node.details}`).join('\n');
  }
  
  // Função para exibir os resultados na interface gráfica
  function displayResults(parsed, graph, executionPlan) {
    document.getElementById('parsedQuery').textContent = JSON.stringify(parsed, null, 2);
    
    const graphOutput = graph.map(node => `${node.operator}(${node.details})`).join(' -> ');
    document.getElementById('operatorGraph').textContent = graphOutput;
    
    document.getElementById('executionPlan').textContent = executionPlan;
  }
  