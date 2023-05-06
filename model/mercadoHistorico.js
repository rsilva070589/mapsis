const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from mercado_analise_item
  where 1=1 
  `;

const sortableColumns = ['cod_produto'];

async function find(context) {

  
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.id_produto = context.id;  
    query += '\nand COD_PRODUTO = :id_produto';
    console.log(query)
  } 
 
  
  
  const result = await database.simpleExecute(query, binds);  

  return result.rows


}
 

module.exports.find = find;
  