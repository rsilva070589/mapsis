const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  *
  from maxx_ambiente_imagens
  where 1=1
  `;

const sortableColumns = ['AMBIENTE','SEQUENCIA'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\nand AMBIENTE = :employee_id';
  }


 
  if (context.sort === undefined) {
    query += '\norder by SEQUENCIA asc';
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

const createSql =
 `insert into MAXX_AMBIENTE_IMAGENS cd (
                                        cd.AMBIENTE,
                                        cd.SEQUENCIA,
                                        cd.IMG )
 values (:AMBIENTE, 
         :SEQUENCIA,
         :IMG )
  `
 
  

async function create(emp) {
  const ambiente = Object.assign({}, emp);

  
  const process = await database.simpleExecute(createSql, 
                                                      [ 
                                                        ambiente.AMBIENTE,
                                                        ambiente.SEQUENCIA,
                                                        ambiente.IMG 
                                                      ]
                                                      , { autoCommit: true }); 
   
  return ambiente;
}

module.exports.create = create;

const updateSql =
 `update MAXX_AMBIENTE_IMAGENS 
  set  
  IMG             = :IMG,
  SEQUENCIA       = :SEQUENCIA    
  where AMBIENTE  = :AMBIENTE
  `
  ;

async function update(emp) { 

  const ambiente = Object.assign({}, emp);
console.log(ambiente)

  const result = await database.simpleExecute(updateSql, ambiente,{ autoCommit: true });
  return result;  
}

module.exports.update = update;


const deleteSql =
 ` DELETE FROM MAXX_AMBIENTE_IMAGENS
   WHERE AMBIENTE = :AMBIENTE`;

async function del(AMBIENTE) {
  const binds = {
    AMBIENTE: AMBIENTE    
  };
  const result = await database.simpleExecute(deleteSql, binds, { autoCommit: true });

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;
 