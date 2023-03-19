const itens = require('../model/mercadoCompras.js');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;

    const rows = await itens.find(context);

    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;

function getItemFromRec(req) {
  const COMPRAS = { 
    ID_COMPRA:    req.body.ID_COMPRA,
    NOTA:         req.body.NOTA,
    DATA_EMISSAO: req.body.DATA_EMISSAO,    
    FORNECEDOR:   req.body.FORNECEDOR,
    TOTAL_NOTA:   req.body.TOTAL_NOTA,
    ITENS:        req.body.ITENS
  };

  console.log(COMPRAS)

  return COMPRAS;
}



function getItemFromUpdate(req) {
   const COMPRAS = { 
    ID_COMPRA:    req.body.ID_COMPRA,
    NOTA:         req.body.NOTA,
    DATA_EMISSAO: req.body.DATA_EMISSAO,    
    FORNECEDOR:   req.body.FORNECEDOR,
    TOTAL_NOTA:   req.body.TOTAL_NOTA,
    ITENS:        req.body.ITENS
  };

  console.log(COMPRAS)
  return COMPRAS;
 
}


async function post(req, res, next) {
  try {
    let compras = getItemFromRec(req);

    compras = await itens.create(compras);

    res.status(201).json(compras);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let compras = getItemFromUpdate(req);
    console.log(compras)

    compras.ID = parseInt(req.params.id, 10);
    
    compras = await itens.update(compras);

    if (compras !== null) {
      res.status(200).json(compras);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;


async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await vendas.delete(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;

