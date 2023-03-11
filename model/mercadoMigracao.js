const oracledb = require('oracledb');
const database = require('../services/database.js');

 
 
  const createSqlVendas=`
  insert into MERCADO_VENDAS(
    ID 
    ,COD_CLIENTE
    ,COD_ENDERECO
    ,VALOR
    ,DESCONTO
    ,DATA_OLD
    ,STATUS
    ,OBSERVACAO
    ) values (
    :ID 
    ,:COD_CLIENTE
    ,:COD_ENDERECO 
    ,:VALOR
    ,:DESCONTO
    ,:DATA_OLD
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
  
   SEQUENCIA_PEDIDO =  ITEM.ID

  const vendasGeral = await database.simpleExecute(createSqlVendas, 
                                                      [ 
                                                        ITEM.ID, 
                                                        ITEM.COD_CLIENTE,
                                                        ITEM.COD_ENDERECO,                                                         
                                                        ITEM.VALOR,
                                                        ITEM.DESCONTO,
                                                        ITEM.DATA_OLD,
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
          