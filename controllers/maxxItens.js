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
    ID_ITEM:      req.body.IDITEM,
    PAVIMENTO:    req.body.PAVIMENTO,
    AMBIENTE:     req.body.AMBIENTE,
    APLICACAO:    req.body.APLICACAO,
    TIPO:         req.body.TIPO,
    NOMENCLATURA: req.body.NOMENCLATURA,
    FORNECEDOR:   req.body.FORNECEDOR,
    DESCRICAO:    req.body.DESCRICAO,
    UND:          req.body.UND,
    QTDE:         req.body.QTDE,
    VLR_UNITARIO: req.body.VLR_UNITARIO,
    FRETE:        req.body.FRETE,
    VLR_MAO_OBRA: req.body.VLR_MAO_OBRA,
    CONTINGENCIA: req.body.CONTINGENCIA 
  };

  return ITEM;
}



function getItemFromUpdate(req) {
  const ClientUP = { 
    ENDERECO_ELETRONICO: req.body.ENDERECO_ELETRONICO,
    RUA_RES: req.body.RUA_RES,
    FACHADA_RES: req.body.FACHADA_RES,
    COMPLEMENTO_RES: req.body.COMPLEMENTO_RES,
    BAIRRO_RES: req.body.BAIRRO_RES,
    COD_CID_RES: req.body.COD_CID_RES,
    CEP_RES: req.body.CEP_RES,
    UF_RES: req.body.UF_RES,
    PREFIXO_CEL: req.body.PREFIXO_CEL,
    TELEFONE_CEL: req.body.TELEFONE_CEL    
  };

  return ClientUP;
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
    let client = getItemFromUpdate(req);

    client.ID = parseInt(req.params.id, 10);
    console.log(client.ID)
    client = await itens.update(client);

    if (client !== null) {
      res.status(200).json(client);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;

/*
async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await employees.delete(id);

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

*/