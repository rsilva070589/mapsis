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
 
  const createSqlCompras=`
  insert into MERCADO_COMPRAS(
     ID_COMPRA 
    ,NOTA
    ,DATA_EMISSAO
    ,DATA_ENTRADA
    ,FORNECEDOR
    ,TOTAL_NOTA 
    )
     values (
     :ID_COMPRA 
    ,:NOTA
    ,:DATA_EMISSAO 
    ,SYSDATE - 0.3
    ,:FORNECEDOR
    ,:TOTAL_NOTA 
    )`

    const createSqlComprasItens=`
    insert into MERCADO_COMPRAS_ITENS(
      ID_COMPRA
     ,COD_PRODUTO
     ,QTDE
     ,VALOR_ITENS 
     ) values ( :ID_COMPRA,:COD_PRODUTO,:QTDE,:VALOR_ITENS)`
 
  const historico_kardex = `
  INSERT INTO MERCADO_PRODUTOS_KARDEX (COD_ITEM,QTDE_ANTERIOR,QTDE_ATUAL,ID_VENDA,CODIGO_BARRAS,TIPO)
                            VALUES    (:COD_ITEM,:QTDE_ANTERIOR,:QTDE_ATUAL,:ID_VENDA,:CODIGO_BARRAS,'COMPRA')
  `

  const updateQtdeItens = `
  update  mercado_produtos set qtde_estoque = :QTDE_ATUAL, valor_custo = :CUSTO
  where id = :ID_ITEM
  `

  //qtde atual do ITEM
let ITEM_QTDE = null

async function getQtdeitem(cod_produto) {
  const SqlGetItem = ` select id, nvl(qtde_estoque,0)qtde_estoque,valor_custo FROM mercado_produtos
                                 where CODIGO_BARRAS = :CODIGO_BARRAS`
  const result   = await database.simpleExecute(SqlGetItem, [cod_produto])  
  const sequencia = result.rows[0] 
  return sequencia
 }
 
async function historicoKardex (codBarras,qtde_compra,ID_COMPRA) { 
  resultItens = await getQtdeitem(codBarras)
  var qtdeFinal = resultItens.QTDE_ESTOQUE+qtde_compra
  const result = await database.simpleExecute(historico_kardex, [resultItens.ID,resultItens.QTDE_ESTOQUE,qtdeFinal,ID_COMPRA,codBarras], { autoCommit: true })
}

 

  async function updateItens (codBarras, qtde_compra,total){
 
    resultItens = await getQtdeitem(codBarras) 
    var qtdeFinal   = resultItens.QTDE_ESTOQUE+qtde_compra
    var custo       = total / qtde_compra
    console.log('o custo atual é: '+custo)

    console.log('qtde Agora é '+ qtdeFinal)
     await database.simpleExecute(updateQtdeItens, [qtdeFinal, custo, resultItens.ID] ,{ autoCommit: true })
      
  }



async function create(emp) {
  const ITEM = Object.assign({}, emp);




  //NEWMAXX_PEDIDOS_SEQ1
  let SEQUENCIA_PEDIDO = null
 
  async function getSequenciaPedido() {
    const SqlNumeracaoOSAgenda = `SELECT MERCADO_COMPRAS_SEQ.NEXTVAL SEQUENCIA_PEDIDO FROM DUAL`
    const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)  
    const sequencia = result.rows[0]['SEQUENCIA_PEDIDO']
    console.log(sequencia)
    return sequencia
   } 
  
   SEQUENCIA_PEDIDO = await getSequenciaPedido()

   //NEWMAXX_PEDIDOS_SEQ1
  let ItemCusto = null || 0
 

  
   

  const vendasGeral = await database.simpleExecute(createSqlCompras, 
                                                      [ 
                                                        SEQUENCIA_PEDIDO, 
                                                        ITEM.NOTA,
                                                        ITEM.DATA_EMISSAO,                                                         
                                                        ITEM.FORNECEDOR,
                                                        ITEM.TOTAL_NOTA                                                      
                                                      ]
                                                      , { autoCommit: true });
 
   
   async function postItens (codItem,qtde, valor) { 
    const teste =  await database.simpleExecute(createSqlComprasItens,[SEQUENCIA_PEDIDO,codItem,qtde,valor], { autoCommit: true });
    }

 
 
     
  ITEM.ITENS.map(  x => {
    const itens = Object.assign({}, x);
  
    postItens(      itens.CODIGO_BARRAS,  itens.QTDE,   itens.VALOR_CUSTO)  
    historicoKardex(itens.CODIGO_BARRAS,  itens.QTDE,   SEQUENCIA_PEDIDO)
    updateItens(    itens.CODIGO_BARRAS,  itens.QTDE, itens.VALOR_CUSTO,  SEQUENCIA_PEDIDO) 

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