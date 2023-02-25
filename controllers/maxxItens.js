const itens = require('../model/maxxItens');

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
  const ITEM = {        
    AMBIENTE:     req.body.AMBIENTE,
    LUCRO:        req.body.LUCRO,
    TIPO:         req.body.TIPO,
    NOMENCLATURA: req.body.NOMENCLATURA,
    FORNECEDOR:   req.body.FORNECEDOR,
    DESCRICAO:    req.body.DESCRICAO,
    UND:          req.body.UND,
    QTDE:         req.body.QTDE,
    VLR_UNITARIO: req.body.VLR_UNITARIO,
    FRETE:        req.body.FRETE,
    VLR_MAO_OBRA: req.body.VLR_MAO_OBRA,
    CONTINGENCIA: req.body.CONTINGENCIA,
    OPCAO: req.body.OPCAO ,
    TAXA: req.body.TAXA ,
    PRECO_TOTAL: req.body.PRECO_TOTAL ,
    CUSTO_TOTAL: req.body.CUSTO_TOTAL 
  };

  return ITEM;
}



function getItemFromUpdate(req) {
  const ITEM = {        
    AMBIENTE:     req.body.AMBIENTE,
    LUCRO:        req.body.LUCRO,
    TIPO:         req.body.TIPO,
    NOMENCLATURA: req.body.NOMENCLATURA,
    FORNECEDOR:   req.body.FORNECEDOR,
    DESCRICAO:    req.body.DESCRICAO,
    UND:          req.body.UND,
    QTDE:         req.body.QTDE,
    VLR_UNITARIO: req.body.VLR_UNITARIO,
    FRETE:        req.body.FRETE,
    VLR_MAO_OBRA: req.body.VLR_MAO_OBRA,
    CONTINGENCIA: req.body.CONTINGENCIA,
    OPCAO: req.body.OPCAO ,
    TAXA: req.body.TAXA ,
    PRECO_TOTAL: req.body.PRECO_TOTAL ,
    CUSTO_TOTAL: req.body.CUSTO_TOTAL 
  };

  return ITEM;
 
}


async function post(req, res, next) {
  try {
    let item = getItemFromRec(req);

    item = await itens.create(item);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let ITEM = getItemFromUpdate(req);
    console.log(ITEM)

    ITEM.ID = parseInt(req.params.id, 10);
    
    ITEM = await itens.update(ITEM);

    if (ITEM !== null) {
      res.status(200).json(ITEM);
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

