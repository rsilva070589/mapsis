const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from vwmercado_vendas
  where 1=1
  `;

  const baseQueryVendaItens =
  `select
    *
    from mercado_vendas_itens
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


  const arrayVendas = []

  async function getItens (ID) { 
      const vendaItens =  await database.simpleExecute(baseQueryVendaItens)   
       return vendaItens.rows      
      }

  const arrayTodosItens = (await getItens())


    async function getItens2 (){
      const arrayTodos = [] 
    
  
      result.rows.map( async t => {   
        const todo = {
          ID: t.ID,
          COD_CLIENTE: t.COD_CLIENTE,
          COD_ENDERECO: t.COD_ENDERECO,
          VALOR: t.VALOR,
          DESCONTO: t.DESCONTO,
          DATA: t.DATA,
          STATUS: t.STATUS,  
          OBSERVACAO: t.OBSERVACAO,
          ITENS: arrayTodosItens.filter(x => x.ID_VENDA==t.ID)
        }
         
      
        arrayTodos.push(todo)  
      
      })   
      return arrayTodos
    }
    arrayVendas.push(await getItens2())   

 
 
  return arrayVendas


}

 

module.exports.find = find;
 
  const createSqlVendas=`
  insert into MERCADO_VENDAS(
    ID 
    ,COD_CLIENTE
    ,COD_ENDERECO
    ,VALOR
    ,DESCONTO
    ,DATA
    ,STATUS
    ,OBSERVACAO
    ) values (
    :ID 
    ,:COD_CLIENTE
    ,:COD_ENDERECO 
    ,:VALOR
    ,:DESCONTO
    ,SYSDATE
    ,1
    ,:OBSERVACAO
    )`

    const createSqlVendasItens=`
    insert into mercado_vendas_itens(
      ID_VENDA
     ,COD_PRODUTO
     ,QTDE
     ,VALOR
     ,DESCONTO
     ) values ( :ID,:COD_PRODUTO,:QTDE,:VALOR,:DESCONTO )`
 
 

async function create(emp) {
  const ITEM = Object.assign({}, emp);

  //NEWMAXX_PEDIDOS_SEQ1
  let SEQUENCIA_PEDIDO = null
 
  async function getSequenciaPedido() {
    const SqlNumeracaoOSAgenda = `SELECT MERCADO_ID_VENDAS.NEXTVAL SEQUENCIA_PEDIDO FROM DUAL`
    const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)  
    const sequencia = result.rows[0]['SEQUENCIA_PEDIDO']
    console.log(sequencia)
    return sequencia
   }
  
   SEQUENCIA_PEDIDO = await getSequenciaPedido()

  const vendasGeral = await database.simpleExecute(createSqlVendas, 
                                                      [ 
                                                        SEQUENCIA_PEDIDO, 
                                                        ITEM.COD_CLIENTE,
                                                        ITEM.COD_ENDERECO,                                                         
                                                        ITEM.VALOR,
                                                        ITEM.DESCONTO,
                                                        ITEM.OBSERVACAO
                                                      ]
                                                      , { autoCommit: true });


   
   async function postItens (codItem,qtde, valor,desconto) {
    const teste =  await database.simpleExecute(createSqlVendasItens,[SEQUENCIA_PEDIDO,codItem,qtde,valor,desconto], { autoCommit: true });
    }
 
    
 
  ITEM.ITENS.map(  x => {
    const itens = Object.assign({}, x);
    console.log(x)
    postItens(itens.COD_PRODUTO,itens.QTDE, itens.VALOR, itens.DESCONTO) 
  }) 
}
module.exports.create = create;
                           
const updateSql =
 `update MERCADO_VENDAS
  set  
  COD_ENDERECO    = :COD_ENDERECO, 
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