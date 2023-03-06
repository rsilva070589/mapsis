const itens = require('../model/maxxPedidos');

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
  const PEDIDO = { 
    SEQUENCIA:         req.body.SEQUENCIA,       
    NOME:         req.body.NOME,
    COD_CLIENTE:  req.body.COD_CLIENTE,
    CASA:         req.body.CASA,
    EMPREENDIMENTO: req.body.EMPREENDIMENTO,
    VALOR:        req.body.VALOR,
    DESCONTO:     req.body.DESCONTO,
    DATA:         req.body.DATA,
    STATUS:       req.body.STATUS,
    ITENS:        req.body.ITENS
  };

  console.log(PEDIDO)

  return PEDIDO;
}



function getItemFromUpdate(req) {
  const PEDIDO = {        
    SEQUENCIA:         req.body.SEQUENCIA,  
    NOME:         req.body.NOME,
    COD_CLIENTE:  req.body.COD_CLIENTE,
    CASA:         req.body.CASA,
    EMPREENDIMENTO: req.body.EMPREENDIMENTO,
    VALOR:        req.body.VALOR,
    DESCONTO:     req.body.DESCONTO,
    DATA:         req.body.DATA,
    STATUS:       req.body.STATUS
  };

  return PEDIDO;
 
}


async function post(req, res, next) {
  try {
    let pedido = getItemFromRec(req);

    pedido = await itens.create(pedido);

    res.status(201).json(pedido);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let pedido = getItemFromUpdate(req);
    console.log(pedido)

    pedido.ID = parseInt(req.params.id, 10);
    
    pedido = await itens.update(pedido);

    if (pedido !== null) {
      res.status(200).json(pedido);
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

    const success = await itens.delete(id);

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

