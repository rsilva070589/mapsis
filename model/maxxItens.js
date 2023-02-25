const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from newmaxx_itens
  where 1=1
  `;

const sortableColumns = ['ID'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\nand ID = :employee_id';
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
 
  const createSqlItens=`
  insert into NEWMAXX_ITENS(
    LUCRO
    ,QTDE
    ,VLR_UNITARIO
    ,UND
    ,FRETE
    ,FORNECEDOR
    ,OPCAO
    ,TAXA
    ,TIPO
    ,VLR_MAO_OBRA
    ,NOMENCLATURA
    ,DESCRICAO
    ,PRECO_TOTAL
    ,CONTINGENCIA
    ,CUSTO_TOTAL
    ,AMBIENTE
    ) values (
     :LUCRO
    ,:QTDE
    ,:VLR_UNITARIO
    ,:UND
    ,:FRETE
    ,:FORNECEDOR
    ,:OPCAO
    ,:TAXA
    ,:TIPO
    ,:VLR_MAO_OBRA
    ,:NOMENCLATURA
    ,:DESCRICAO
    ,:PRECO_TOTAL
    ,:CONTINGENCIA    
    ,:CUSTO_TOTAL
    ,:AMBIENTE
    )`
 
 

async function create(emp) {
  const ITEM = Object.assign({}, emp);

  
  const cliente_diverso = await database.simpleExecute(createSqlItens, 
                                                      [ ITEM.LUCRO,
                                                        ITEM.QTDE,
                                                        ITEM.VLR_UNITARIO,
                                                        ITEM.UND,
                                                        ITEM.FRETE,
                                                        ITEM.FORNECEDOR,
                                                        ITEM.OPCAO,
                                                        ITEM.TAXA,
                                                        ITEM.TIPO,
                                                        ITEM.VLR_MAO_OBRA,
                                                        ITEM.NOMENCLATURA,                                                        
                                                        ITEM.DESCRICAO,
                                                        ITEM.PRECO_TOTAL,
                                                        ITEM.CONTINGENCIA,
                                                        ITEM.CUSTO_TOTAL,
                                                        ITEM.AMBIENTE
                                                      ]
                                                      , { autoCommit: true });

}                  
module.exports.create = create;
                           
const updateSql =
 `update NEWMAXX_ITENS
  set 
  AMBIENTE        = :AMBIENTE, 
  LUCRO           = :LUCRO, 
  TIPO            = :TIPO,
  NOMENCLATURA    = :NOMENCLATURA,
  FORNECEDOR      = :FORNECEDOR,
  DESCRICAO      = :DESCRICAO,
  UND             = :UND,
  QTDE            = :QTDE,
  VLR_UNITARIO    = :VLR_UNITARIO,
  FRETE           = :FRETE,
  VLR_MAO_OBRA    = :VLR_MAO_OBRA,
  CONTINGENCIA    = :CONTINGENCIA,
  OPCAO           = :OPCAO,
  TAXA            = :TAXA,
  PRECO_TOTAL     = :PRECO_TOTAL,
  CUSTO_TOTAL     = :CUSTO_TOTAL

  where ID = :ID 
  `
  ;

async function update(emp) {
  console.log(emp)

  
  const binds = {
    id: 7
  };

  const result = await database.simpleExecute(updateSql,emp, { autoCommit: true });
  return binds;  
}

module.exports.update = update;


const deleteSql =
 `delete from NEWMAXX_ITENS
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
