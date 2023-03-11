const itens = require('../model/mercadoMigracao.js');

 
 

function getItemFromRec(req) {
  const VENDAS = { 
    ID:           req.body.ID,
    COD_CLIENTE:  req.body.COD_CLIENTE,
    COD_ENDERECO: req.body.COD_ENDERECO,    
    VALOR:        req.body.VALOR,
    DESCONTO:     req.body.DESCONTO,
    DATA_OLD:         req.body.DATA_OLD,
    STATUS:       req.body.STATUS,
    ITENS:        req.body.ITENS
  };

  console.log(VENDAS)

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

  

 