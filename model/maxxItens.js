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
/*                           
const updateSql =
 `update clientes cli
  set 
  cli.endereco_eletronico     = :ENDERECO_ELETRONICO, 
  cli.rua_res                 = :RUA_RES, 
  cli.fachada_res             = :FACHADA_RES,
  cli.complemento_res         = :COMPLEMENTO_RES,
  cli.bairro_res              = :BAIRRO_RES,
  cli.cod_cid_res             = :COD_CID_RES,
  cli.cep_res                 = :CEP_RES,
  cli.uf_res                  = :UF_RES, 
  cli.prefixo_cel             = :PREFIXO_CEL,
  cli.telefone_cel            = :TELEFONE_CEL

  where cli.cod_cliente = :ID
  `
  ;

async function update(emp) {
  const UpdateCliente = Object.assign({}, emp); 
  const result = await database.simpleExecute(updateSql, UpdateCliente, { autoCommit: true });
  return UpdateCliente;  
}

module.exports.update = update;

/*
const deleteSql =
 `begin

    delete from job_history
    where employee_id = :employee_id;

    delete from employees
    where employee_id = :employee_id;

    :rowcount := sql%rowcount;

  end;`;

async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  };
  const result = await database.simpleExecute(deleteSql, binds, { autoCommit: true });

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;
**/