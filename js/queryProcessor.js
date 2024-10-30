function validateSQLQuery(query) {
  const sqlPattern = /^SELECT\s+.+?\s+FROM\s+.+?(\s+JOIN\s+.+?\s+ON\s+.+?)*(\s+WHERE\s+.+?)?$/i;
  return sqlPattern.test(query.trim());
}

  
function parseSQLQuery(query) {
  const parsed = {};
  
  const selectMatch = query.match(/SELECT (.+?) FROM/i);
  const fromMatch = query.match(/FROM (.+?)( JOIN| WHERE|$)/i);
  const whereMatch = query.match(/WHERE (.+)/i);
  const joinMatches = query.match(/JOIN (.+?) ON (.+?)( JOIN| WHERE|$)/gi);

  parsed.select = selectMatch ? selectMatch[1].split(',').map(col => col.trim()) : null;
  parsed.from = fromMatch ? fromMatch[1].trim() : null;
  parsed.where = whereMatch ? whereMatch[1].trim() : null;
  
  if (joinMatches) {
    parsed.joins = joinMatches.map(join => {
      const [_, table, condition] = join.match(/JOIN (.+?) ON (.+?)( JOIN| WHERE|$)/i);
      return { table: table.trim(), condition: condition.trim() };
    });
  } else {
    parsed.joins = [];
  }

  return parsed;
}

  
function validateTablesAndColumns(parsed) {
  const { select, from, joins } = parsed;

  // Verifica se a tabela principal existe no schema
  if (!schema[from]) {
    alert(`A tabela "${from}" não existe no banco de dados.`);
    return false;
  }

  // Cria um conjunto de tabelas envolvidas na consulta
  const involvedTables = new Set([from]);

  // Adiciona tabelas de JOIN ao conjunto
  for (const join of joins) {
    involvedTables.add(join.table);
  }

  // Percorre cada coluna no SELECT
  for (const column of select) {
    // Remove o prefixo do nome da tabela, se existir
    const [tableName, columnWithoutTable] = column.includes('.') ? column.split('.') : [null, column];

    // Se a coluna tem um prefixo de tabela
    if (tableName) {
      if (!involvedTables.has(tableName)) {
        alert(`A tabela "${tableName}" não está envolvida na consulta.`);
        return false;
      }
    } else {
      // Se não há prefixo, verifica nas tabelas envolvidas
      const existsInAnyTable = [...involvedTables].some(table => schema[table].includes(column));
      if (!existsInAnyTable) {
        alert(`A coluna "${column}" não existe em nenhuma tabela envolvida na consulta.`);
        return false;
      }
    }

    // Verifica se a coluna existe na tabela associada
    if (tableName && !schema[tableName].includes(columnWithoutTable)) {
      alert(`A coluna "${column}" não existe na tabela "${tableName}".`);
      return false;
    }
  }

  return true;
}




  
function sqlToAlgebraRelacional(sql) {
  // Remove espaços em branco adicionais e transforma em letras minúsculas
  sql = sql.trim().toLowerCase();

  // Verifica se a consulta é do tipo SELECT
  if (!sql.startsWith("select")) {
    throw new Error("A consulta deve começar com SELECT");
  }

  // Extrai os campos de seleção
  const selectMatch = sql.match(/select (.+?) from/i);
  if (!selectMatch) {
    throw new Error("Não foi possível extrair os campos da consulta");
  }
  const fields = selectMatch[1].split(",").map(field => field.trim());

  // Extrai as tabelas da consulta
  const fromMatch = sql.match(/from (.+?)( join | where|$)/i);
  if (!fromMatch) {
    throw new Error("Não foi possível extrair as tabelas da consulta");
  }

  const tables = [fromMatch[1].trim()];  // Tabela principal
  
  // Extrai as junções e condições ON
  const joinMatches = [...sql.matchAll(/join (.+?) on (.+?)( join| where|$)/g)];
  
  let joinConditions = [];
  
  joinMatches.forEach(match => {
    const joinTable = match[1].trim();
    const joinCondition = match[2].trim();
    tables.push(joinTable);
    joinConditions.push(joinCondition);
  });

  // Monta a álgebra relacional
  let algebra = '';
  if (joinConditions.length > 0) {
    // Se houver condições de junção
    const joinExpression = `σ(${joinConditions.join(' ∧ ')})(${tables.join(' ⨝ ')})`;
    algebra = `π(${fields.join(', ')})(${joinExpression})`;
  } else {
    // Produto cartesiano se não houver junção
    algebra = `π(${fields.join(', ')})(${tables.join(' × ')})`;
  }

  alert(algebra);
  return algebra;
}


  
function generateExecutionPlan(graph) {
  // return graph.map((node, index) => `Passo ${index + 1}: ${node.operator} sobre ${node.details}`).join('\n');

}

  