const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from mercado_vwdemanda
  where 1=1
  `;

  
 

const sortableColumns = ['dias_restantes'];

async function find(context) {

  
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.dias_restantes = context.id; 
    query += '\nand dias_restantes >= :dias_restantes';
  } 
 
  if (context.sort === undefined) {
    query += '\norder by dias_restantes asc';
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

  var arredonda = function(numero, casasDecimais) {
    casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
    return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
  };

  async function ajustandoLista () {
    result.rows.map(x => {
      const vendasLista = {
        "COD_PRODUTO": x.COD_PRODUTO,
        "NOME":  x.NOME,
        "DEMANDA_DIARIA": arredonda(x.DEMANDA_DIARIA),
        "QTDE_ESTOQUE": arredonda(x.QTDE_ESTOQUE),
        "DIAS_RESTANTES": arredonda(x.DIAS_RESTANTES)    
      }
      arrayVendaLista.push(vendasLista)
    })
  }

  ajustandoLista()
  return arrayVendaLista


}
 

module.exports.find = find;
  