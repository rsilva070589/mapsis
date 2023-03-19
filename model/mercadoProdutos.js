const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from vwmercado_produtos
  where 1=1
  `;

  

const sortableColumns = ['ID'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id; 
    query += '\nand ID = :id_produto';
  } 
 
  if (context.sort === undefined) {
    query += '\norder by ID asc';
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

  const limit = (context.limit > 0) ? context.limit : 100000;

  binds.row_limit = limit;

  query += '\nfetch next :row_limit rows only';

  const result = await database.simpleExecute(query, binds);  
 
  return result.rows


}
 

module.exports.find = find;
 
  const createSqlVendas=`
  insert into MERCADO_PRODUTOS(
     CATEGORIA
    ,CODIGO_BARRAS
    ,DESCRICAO
    ,FOTO
    ,NOME
    ,SITUACAO
    ,VALOR
    ,VALOR_CUSTO
    ,QTDE_ESTOQUE
    ) values (
    :CATEGORIA 
    ,:CODIGO_BARRAS
    ,:DESCRICAO 
    ,:FOTO
    ,:NOME
    ,:SITUACAO
    ,:VALOR
    ,:VALOR_CUSTO
    ,:QTDE_ESTOQUE
    )`
 

async function create(emp) {
  const ITEM = Object.assign({}, emp); 
  const vendasGeral = await database.simpleExecute(createSqlVendas, 
                                                      [  
                                                        ITEM.CATEGORIA,
                                                        ITEM.CODIGO_BARRAS,                                                         
                                                        ITEM.DESCRICAO,
                                                        ITEM.FOTO,
                                                        ITEM.NOME,
                                                        ITEM.SITUACAO,
                                                        ITEM.VALOR,
                                                        ITEM.VALOR_CUSTO,
                                                        ITEM.QTDE_ESTOQUE
                                                      ]
                                                      , { autoCommit: true });

 
 
}
module.exports.create = create;
                           
const updateSql =
 `update MERCADO_PRODUTOS
  set  
  CATEGORIA     = :CATEGORIA, 
  CODIGO_BARRAS = :CODIGO_BARRAS,
  DESCRICAO     = :DESCRICAO,
  FOTO          = :FOTO,
  NOME          = :NOME,
  SITUACAO      = :SITUACAO,
  VALOR         = :VALOR,
  VALOR_CUSTO   = :VALOR_CUSTO,
  QTDE_ESTOQUE  = :QTDE_ESTOQUE
  where ID      = :ID 
  `
  ;

async function update(emp) {
  const ITEM = Object.assign({}, emp); 
  console.log(ITEM)

  const result = await database.simpleExecute(updateSql,[     ITEM.CATEGORIA,
                                                              ITEM.CODIGO_BARRAS,
                                                              ITEM.DESCRICAO,
                                                              ITEM.FOTO,
                                                              ITEM.NOME,
                                                              ITEM.SITUACAO,
                                                              ITEM.VALOR,
                                                              ITEM.VALOR_CUSTO,
                                                              ITEM.QTDE_ESTOQUE,
                                                              ITEM.ID,
                                                              
                                                        ], { autoCommit: true });
  return ITEM;  
}

module.exports.update = update;


const deleteSql =
 `delete from MERCADO_VENDAS
 where ID = :ID
 `;

async function del(id) {
  const binds = {
    id: id
  };
  const result = await database.simpleExecute(deleteSql, binds, { autoCommit: true });

  return binds;
}
 
module.exports.delete = del;