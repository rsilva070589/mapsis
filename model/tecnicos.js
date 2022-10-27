const database = require('../services/database.js');

const baseQuery = 
`select 
      st.cod_empresa,
      st.cod_tecnico,
      st.nome,
      pb.prisma box
from  servicos_tecnicos st,
      prisma_box pb
where st.ativo = 'S'
  and st.cod_empresa = pb.cod_empresa_filtro
  and st.cod_tecnico = pb.cod_tecnico
`;

const sortableColumns = ['id', 'nome'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\and st.cod_tecnico = :tipo_id`;
  }

  if (context.NOME) {
    binds.NOME = context.NOME;
    console.log(context.NOME) 
    query += '\nand NOME = :NOME';
  }
  
  if (context.sort === undefined) {
    query += '\norder by NOME asc';
  } else {
    let [column, order] = context.sort.split(':');
 
    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }
 
    if (order === undefined) {
      order = 'asc';
    }
 
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Invalid "sort" order');
    }
 
    query += `\norder by "${column}" ${order}`;
  }

  if (context.skip) {
    binds.row_offset = context.skip;

    query += '\noffset :row_offset rows';
  }

  const limit = (context.limit > 0) ? context.limit : 30;

  binds.row_limit = limit;

  query += '\nfetch next :row_limit rows only';

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;

