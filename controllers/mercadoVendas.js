const itens = require('../model/mercadoVendas.js');

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
  const VENDAS = { 
    ID:         req.body.ID,
    COD_CLIENTE:  req.body.COD_CLIENTE,
    COD_ENDERECO: req.body.COD_ENDERECO,    
    VALOR:        req.body.VALOR,
    DESCONTO:     req.body.DESCONTO,
    DATA:         req.body.DATA,
    STATUS:       req.body.STATUS,
    ITENS:        req.body.ITENS
  };

  console.log(VENDAS)

  return VENDAS;
}



function getItemFromUpdate(req) {
  const VENDAS = {         
    COD_CLIENTE:  req.body.COD_CLIENTE,
    COD_ENDERECO:  req.body.COD_ENDERECO, 
    VALOR:        req.body.VALOR,
    DESCONTO:     req.body.DESCONTO,
    DATA:         req.body.DATA,
    STATUS:       req.body.STATUS
  };

  return VENDAS;
 
}


async function post(req, res, next) {
  try {
    let vendas = getItemFromRec(req);

    vendas = await itens.create(vendas);

    res.status(201).json(vendas);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let vendas = getItemFromUpdate(req);
    console.log(vendas)

    vendas.ID = parseInt(req.params.id, 10);
    
    vendas = await itens.update(vendas);

    if (vendas !== null) {
      res.status(200).json(vendas);
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

