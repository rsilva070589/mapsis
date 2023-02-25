const express    = require('express');
const router     = new express.Router('express-promise-router');
const bodyParser = require('body-parser');
var cors = require('cors');


router.use(bodyParser.json()).use(cors());
const { body, validationResult} = require('express-validator'); 
 

const maxImagens   = require('../controllers/maxxImagens.js'); 
const maxItens   = require('../controllers/maxxItens.js'); 
const maxItensTipo   = require('../controllers/maxxItensTipo.js'); 
const clientes   = require('../controllers/clientes.js');
const modelos    = require('../controllers/modelos.js');
const servicos   = require('../controllers/servicos.js');
const tecnicos   = require('../controllers/tecnicos.js');
const cidades    = require('../controllers/cidades.js');
const frota      = require('../controllers/frota.js');
const agenda     = require('../controllers/agenda.js');
const os         = require('../controllers/os.js');
const empresas   = require('../controllers/empresas.js'); 
const res        = require('express/lib/response'); 
const constraint = require('../controllers/constraint.js');
 
 
router.route('/constraint/:id?')
.get(constraint.get);    


router.route('/modelos/:id?')
.get(modelos.get);    

router.route('/servicos/:id?')
.get(servicos.get);     
 
router.route('/tecnicos/:id?')
.get(tecnicos.get);    

router.route('/cidades/:id?')
.get(cidades.get);

router.route('/empresas/:id?')
.get(empresas.get);

router.route('/frota/:id?')
.get(frota.get); 

router.route('/agenda/:id?')
.get(agenda.get)
.delete(agenda.delete)
.post(
  [
    body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
    body("PRISMA").notEmpty().withMessage("Informe o Prisma"),
    body("COD_CLIENTE").isLength({ min: 8, max: 14 }).withMessage("CPF ou CNPJ Precisa ter 11 OU 14 digitos!"),
    body("COD_PRODUTO").notEmpty().withMessage("Informe o Cod Produto"),
    body("COD_MODELO").notEmpty().withMessage("Informe o Cod Modelo"),
    body("COR_EXTERNA").notEmpty().withMessage("Informe a Cor do Veiculo"), 
    body("CHASSI").isLength({ min: 17, max: 17 }).withMessage("o Chassi deve conter 17 digitos"),
    body("PLACA").isLength({ min: 7, max: 9 }).withMessage("Informe uma Placa Valida"),
    body("KM").isInt().withMessage("Informe o KM do Cliente"),
    body("RECLAMACAO").isLength({ min: 1, max: 99 }).withMessage("Informe o Reparo para o veiculo"),
    body("CONSULTOR").isLength({ min: 3, max: 10 }).withMessage("O campo CONSULTOR deve existir um LOGIN no NBS. min 3 e max 10"),
     //body("DATA_AGENDADA").isISO8601('dd/mm/yyyy').isDate().withMessage("Informe uma data de agendamento!"),
    body("DATA_AGENDADA").notEmpty().withMessage("Data do agendamento invalida"),
    body("DATA_PREVISAO_FIM").notEmpty().withMessage("Data previsao invalida"),
    body("DATA_PROMETIDA").notEmpty().withMessage("Data prometida invalida"), 
 
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,agenda.post
  );

router.route('/os/:id?')
.get(os.get)
.post(
  [
   body("COD_CLIENTE").isLength({ min: 11, max: 11 }).withMessage("CPF Precisa ter 11 digitos!"),
   body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
   body("TIPO").isLength({ min: 2, max: 2 }).withMessage("Tipo de OS precisa ser 2 digitos"),
   body("CHASSI").isLength({ min: 17, max: 17 }).withMessage("o Chassi deve conter 17 digitos"),
   body("PLACA").isLength({ min: 8, max: 8 }).withMessage("Informe uma Placa Valida"),
   body("KM").isInt().withMessage("Informe o KM do Cliente"),
   body("RECLAMACAO").isLength({ min: 1, max: 99 }).withMessage("Informe a o Reparo para o veiculo"),
   
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,os.post
  );
 

router.route('/clientes/:id?')
.get(clientes.get)
.put(clientes.put) 
.post(
      [body("ENDERECO_ELETRONICO").isEmail().withMessage("Precisa ser um Email Valido!"),
       body("COD_CLIENTE").isLength({ min: 11, max: 14 }).withMessage("CPF ou CNPJ Precisa ter entre 11 e 14 digitos!"),
       body("NOME").isLength({ min: 3, max: 50 }).withMessage("Valor Maximo do Nome e 50 caracteres"),
       body("RUA_RES").isLength({ min: 3, max: 50 }).withMessage("Valor Maximo do Rua e 30 caracteres"),
       body("FACHADA_RES").isInt().withMessage("Digite um Numero Inteiro"),
       body("COMPLEMENTO_RES").isLength({ min: 0, max: 20 }).withMessage("Valor Maximo do Complemeto e 20 caracteres"),
       body("TELEFONE_CEL").isLength({ min: 8, max: 9 }).withMessage("Infome um telefone Valido"),
      ],
      (req, res, next) => {    
               const errors = validationResult(req);  
               if(!errors.isEmpty()){
                 return res.status(400).json({errors: errors.array()});
               }  
               return next();
              }
       ,clientes.post
      );


router.route('/itens/:id?')
.get(maxItens.get)
.post(
  [

    body("AMBIENTE").notEmpty().withMessage("Informe  AMBIENTE"),
    body("TIPO").notEmpty().withMessage("Informe TIPO"), 
    body("NOMENCLATURA").notEmpty().withMessage("Informe  NOMENCLATURA"),
    body("FORNECEDOR").notEmpty().withMessage("Informe  FORNECEDOR"),
    body("DESCRICAO").notEmpty().withMessage("Informe  DESCRICAO"),
    body("UND").notEmpty().withMessage("Informe  UND"),
    body("QTDE").notEmpty().withMessage("Informe  QTDE"),
    body("VLR_UNITARIO").notEmpty().withMessage("Informe  VLR_UNITARIO"),
    body("FRETE").notEmpty().withMessage("Informe  FRETE"),
    body("VLR_MAO_OBRA").notEmpty().withMessage("Informe  VLR_MAO_OBRA"),
    body("CONTINGENCIA").notEmpty().withMessage("Informe  CONTINGENCIA"),
    body("CUSTO_TOTAL").notEmpty().withMessage("Informe  CUSTO_TOTAL"),
    body("TAXA").notEmpty().withMessage("Informe  TAXA"),
    body("PRECO_TOTAL").notEmpty().withMessage("Informe  PRECO_TOTAL"),
    body("LUCRO").notEmpty().withMessage("Informe  LUCRO")
 
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,maxItens.post
  );

router.route('/itensTipo/:id?')
.get(maxItensTipo.get)

router.route('/imagens/:id?')
.get(maxImagens.get)


 
    
  ;


module.exports = router;
