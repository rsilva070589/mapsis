const oracledb = require('oracledb');
const database = require('../services/database.js');
 

const baseQuery =
 `  select ID,
 TRUNC(DATA) AS DATA,
 MES,
           COD_PRODUTO,
           NOME,
           QTDE,
           VALOR,
           CUSTO,
           LUCRO, 
           PERC_LUCRO 
    from mercado_venda_itens_lucro 
    where 1=1   
  `; 
const sortableColumns = ['ID'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.id_venda = context.id; 
    query += '\nand ID = :id_venda';
  } 
 
  if (context.sort === undefined) {
    query += '\norder by ID desc';
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
 
  const arrayVendaLista = []


function dataAtualFormatada(dataFormat){
  var data = dataFormat,
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return diaF+"/"+mesF+"/"+anoF;
}

var arredonda = function(numero, casasDecimais) {
  casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
  return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
};

  async function ajustandoLista () {
    result.rows.map(x => {
      const vendasLista = {
        "ID": x.ID,
        "DATA": dataAtualFormatada(x.DATA),
        "MES": x.MES,
        "COD_PRODUTO": x.COD_PRODUTO,
        "NOME": x.NOME,
        "QTDE": x.QTDE,
        "VALOR": arredonda(x.VALOR,2),
        "CUSTO": arredonda(x.CUSTO, 2),
        "LUCRO": arredonda(x.LUCRO,2),
        "PERC_LUCRO": arredonda(x.PERC_LUCRO,2),
      }
      arrayVendaLista.push(vendasLista)
    })
  }

  ajustandoLista()
 
 
return arrayVendaLista
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