const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from vwnewmaxx_pedidos
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
 
  const createSqlPedido=`
  insert into NEWMAXX_PEDIDOS(
    ID
    ,NOME
    ,COD_CLIENTE
    ,CASA
    ,EMPREENDIMENTO
    ,VALOR
    ,DESCONTO
    ,DATA
    ,STATUS
    ,OBSERVACAO
    ) values (
    :ID
    ,:NOME
    ,:COD_CLIENTE
    ,:CASA
    ,:EMPREENDIMENTO
    ,:VALOR
    ,:DESCONTO
    ,SYSDATE
    ,1
    ,:OBSERVACAO
    )`

    const createSqlPedidoItens=`
    insert into NEWMAXX_PEDIDOS_ITENS(
      ID_PEDIDO
     ,COD_ITEM
     ,VALOR
     ,DESCONTO
     ) values ( :ID,:COD_ITEM,:VALOR,:DESCONTO )`
 
 

async function create(emp) {
  const ITEM = Object.assign({}, emp);

  //NEWMAXX_PEDIDOS_SEQ1
  let SEQUENCIA_PEDIDO = null
 
  async function getSequenciaPedido() {
    const SqlNumeracaoOSAgenda = `SELECT NEWMAXX_PEDIDOS_SEQ1.NEXTVAL SEQUENCIA_PEDIDO FROM DUAL`
    const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)  
    const sequencia = result.rows[0]['SEQUENCIA_PEDIDO']
    console.log(sequencia)
    return sequencia
   }
  
   SEQUENCIA_PEDIDO = await getSequenciaPedido()

  const cliente_diverso = await database.simpleExecute(createSqlPedido, 
                                                      [ 
                                                        SEQUENCIA_PEDIDO,
                                                        ITEM.NOME,
                                                        ITEM.COD_CLIENTE,
                                                        ITEM.CASA,
                                                        ITEM.EMPREENDIMENTO,
                                                        ITEM.VALOR,
                                                        ITEM.DESCONTO,
                                                        ITEM.OBSERVACAO
                                                      ]
                                                      , { autoCommit: true });


   
   async function postItens (codItem, valor,desconto) {
    const teste =  await database.simpleExecute(createSqlPedidoItens,[SEQUENCIA_PEDIDO,codItem, valor,desconto], { autoCommit: true });
    }
   
 
      ITEM.ITENS.map(  x => {
        const itens = Object.assign({}, x);
        console.log(x)
        postItens(itens.COD_ITEM, itens.VALOR, itens.DESCONTO)

       
      })

    
    
    

  } 





 

module.exports.create = create;
                           
const updateSql =
 `update NEWMAXX_PEDIDOS
  set 
  NOME            = :NOME,  
  CASA            = :CASA,
  EMPREENDIMENTO  = :EMPREENDIMENTO,
  VALOR           = :VALOR,
  DESCONTO        = :DESCONTO,
  OBSERVACAO      = :OBSERVACAO,
  STATUS          = :STATUS
  where ID = :ID 
  `
  ;

async function update(emp) {
  console.log(emp)

  const result = await database.simpleExecute(updateSql,emp, { autoCommit: true });
  return binds;  
}

module.exports.update = update;


const deleteSql =
 `delete from NEWMAXX_PEDIDOS
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
