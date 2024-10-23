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
  
    if (!schema[from]) {
      alert(`A tabela "${from}" não existe no banco de dados.`);
      return false;
    }
    
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
    return graph.map((node, index) => `Passo ${index + 1}: ${node.operator} sobre ${node.details}`).join('\n');
  }
  