const imagens = require('../model/maxxImagens');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;

    const rows = await imagens.find(context);

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
    IMG:          req.body.IMG,
    SEQUENCIA:    req.body.SEQUENCIA,
    AMBIENTE:     req.body.AMBIENTE,
  };

  return ITEM;
}



function getItemFromUpdate(req) {
  const ClientUP = { 
    IMG:          req.body.IMG,
    SEQUENCIA:    req.body.SEQUENCIA,
    AMBIENTE:     req.body.AMBIENTE,
  };

  return ClientUP;
}


async function post(req, res, next) {
  try {
    let item = getItemFromRec(req);

    item = await imagens.create(item);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let client = getItemFromUpdate(req); 
     
    client = await imagens.update(client);

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

