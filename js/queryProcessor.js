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
      // if (!involvedTables.has(tableName)) {
      //   alert(`A tabela "${tableName}" não está envolvida na consulta.`);
      //   return false;
      // }
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
    // Remover espaços extras e dividir as partes principais
    const sqlParts = sql.trim().replace(/\s+/g, ' ').split(" ");
    
    // Pegar a lista de colunas
    const selectIndex = sqlParts.indexOf("SELECT");
    const fromIndex = sqlParts.indexOf("FROM");
    const whereIndex = sqlParts.indexOf("WHERE");
    const joinIndex = sqlParts.indexOf("JOIN");

    const columns = sqlParts.slice(selectIndex + 1, fromIndex).join(" ").split(",").map(col => col.trim());

    // Pegar a tabela principal
    const mainTable = sqlParts[fromIndex + 1];

    // Pegar a condição WHERE, se houver
    let whereCondition = "";
    if (whereIndex !== -1) {
        whereCondition = sqlParts.slice(whereIndex + 1).join(" ");
    }

    // Pegar a condição de JOIN, se houver
    let joinTable = "";
    let joinCondition = "";
    if (joinIndex !== -1) {
        joinTable = sqlParts[joinIndex + 1];
        joinCondition = sqlParts.slice(joinIndex + 3, whereIndex !== -1 ? whereIndex : sqlParts.length).join(" ");
    }

    // Construir a álgebra relacional
    let relationalAlgebra = "";

    // Adicionar projeção
    relationalAlgebra += `π_{${columns.join(", ")}}(`;

    // Adicionar seleção para WHERE
    if (whereCondition) {
        relationalAlgebra += `σ_{${whereCondition}}(`;
    }

    // Adicionar produto cartesiano ou junção
    if (joinTable) {
        relationalAlgebra += `${mainTable} ⨝_{${joinCondition}} ${joinTable}`;
    } else {
        relationalAlgebra += mainTable;
    }

    // Fechar parênteses das seleções
    if (whereCondition) {
        relationalAlgebra += ')';
    }

    // Fechar parênteses da projeção
    relationalAlgebra += ')';

    return relationalAlgebra;
}


  
function generateExecutionGraph(graph) {
  // return graph.map((node, index) => `Passo ${index + 1}: ${node.operator} sobre ${node.details}`).join('\n');

}

  