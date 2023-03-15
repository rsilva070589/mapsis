const itens = require('../model/mercadoProdutos.js');

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
  const PRODUTOS = {  
    ID:             req.body.ID,         
    CATEGORIA:      req.body.CATEGORIA,
    CODIGO_BARRAS:  req.body.CODIGO_BARRAS,    
    DESCRICAO:      req.body.DESCRICAO,    
    FOTO:           req.body.FOTO,
    NOME:           req.body.NOME,
    SITUACAO:       req.body.SITUACAO,
    VALOR:          req.body.VALOR,
    VALOR_CUSTO:    req.body.VALOR_CUSTO,
    QTDE_ESTOQUE:   req.body.QTDE_ESTOQUE
  };

  console.log(PRODUTOS)

  return PRODUTOS;
}



function getItemFromUpdate(req) {
  const PRODUTOS = {     
    ID:  req.body.ID,  
    CATEGORIA:  req.body.CATEGORIA,
    CODIGO_BARRAS: req.body.CODIGO_BARRAS,    
    DESCRICAO:  req.body.DESCRICAO,    
    FOTO:       req.body.FOTO,
    NOME:       req.body.NOME,
    SITUACAO:   req.body.SITUACAO,
    VALOR:      req.body.VALOR,
    VALOR_CUSTO: req.body.VALOR_CUSTO,
    QTDE_ESTOQUE:   req.body.QTDE_ESTOQUE
  };

  return PRODUTOS;
 
}


async function post(req, res, next) {
  try {
    let produto = getItemFromRec(req);

    produto = await itens.create(produto);

    res.status(201).json(produto);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let produto = getItemFromUpdate(req);
    
    produto.ID = parseInt(req.params.id, 10);
    
    produto = await itens.update(produto);

    if (produto !== null) {
      res.status(200).json(produto);
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

