const express    = require('express');
const router     = new express.Router('express-promise-router');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const { body, validationResult, param} = require('express-validator'); 
const metadata = require('gcp-metadata');
const {OAuth2Client} = require('google-auth-library');
 
const oAuth2Client = new OAuth2Client();
//const clientes   = require('../controllers/clientes.js');
const modelos    = require('../controllers/modelos.js');
const servicos   = require('../controllers/servicos.js');
const tecnicos   = require('../controllers/tecnicos.js');
//const cidades    = require('../controllers/cidades.js');
const frota      = require('../controllers/frota.js');
const agenda     = require('../controllers/agenda.js');
//const os         = require('../controllers/os.js');
const empresas   = require('../controllers/empresas.js'); 
const constraint  = require('../controllers/constraint.js');

//require("dotenv-safe").config();
//const jwt = require('jsonwebtoken');
 
 
//authentication
router.route('/login')
.post((req, res, next) => {
  if(req.body.USER === 'integracao@grupoagp.com.br' && req.body.PASSWORD === '@asdfnk#'){
    //auth ok
    const id = 1; 
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    });
    return res.json({ auth: true, token: token });
  }
  
  res.status(500).json({message: 'Login inválido!'});
})

function verifyJWT(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  console.log(req.headers['authorization'])
  console.log(process.env.SECRET)
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}


 
router.route('/constraint/:id?')
.post(constraint.get);    


router.route('/modelos/:id?')
.post(modelos.get);    



router.route('/servicos/:id?')
.post(servicos.get);     
 
router.route('/tecnicos/:id?')
.post(tecnicos.get);    

//router.route('/cidades/:id?').post(cidades.get);

router.route('/empresas/:id?')
.post(empresas.get);
 

  

 

router.route('/frota/:id?')
.post(frota.get); 

router.route('/agenda/:id?')
.get(agenda.get)
.delete(agenda.delete)
.put(agenda.put)
.post(
  [
    body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
//    body("PRISMA").notEmpty().withMessage("Informe o Prisma"),
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
     
     body("TIPO_ATENDIMENTO").isLength({ min: 1, max: 11 }).withMessage("enviar 'R' receptivo, 'A' ativo ou 'P' passante"),
     
     
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

  /** 
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
 */
/** 
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
*/    
  


module.exports = router;

