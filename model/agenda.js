//const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
`SELECT
        COD_EMPRESA,
        COD_OS_AGENDA,
        STATUS_AGENDA,
        QUEM_ABRIU,
        DATA_ABRIDA,
        DATA_AGENDADA,
        DATA_PREVISAO_FIM,
        PRISMA,
        COD_CLIENTE,
        CLIENTE_NOME,
        CLIENTE_DDD_CEL,
        CLIENTE_FONE_CEL,
        CLIENTE_DDD_RES,
        CLIENTE_FONE_RES,
        EMAIL,
        COD_PRODUTO,
        COD_MODELO,
        CHASSI,
        PLACA,
        COR_EXTERNA,
        ANO,
        TIPO_TOYOTA,
        CLIENTE_AGUARDA,
        TIPO_ATENDIMENTO   
FROM  OS_AGENDA OG 
where 1=1
`;

const sortableColumns = ['id'];

 async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\nand COD_OS_AGENDA= :employee_id';
  }
  const limit = (context.limit > 0) ? context.limit : 30;
  binds.row_limit = limit;
  query += '\nfetch next :row_limit rows only';
  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;


const createSqlOSAgenda =
`INSERT INTO OS_AGENDA (
  COD_EMPRESA,
  COD_OS_AGENDA,
  STATUS_AGENDA,
  QUEM_ABRIU,
  CONSULTOR,
  PRISMA, 
  TIPO_ATENDIMENTO,
  COD_CLIENTE,  
  COD_PRODUTO,
  COD_MODELO,
  ANO_MODELO,
  PLACA,
  CHASSI,
  COR_EXTERNA,
  KM,  
  DATA_ULTIMA_ATUALIZACAO,
  DATA_ABRIDA, 
  DATA_AGENDADA,
  DATA_PREVISAO_FIM,
  DATA_PROMETIDA,
  TIPO_TOYOTA,
  CLIENTE_AGUARDA,
  EH_RETORNO,
  LAVAR_VEICULO,
  VEICULO_PLATAFORMA,
  TAXI,
  BLINDADO,
  TESTE_RODAGEM,
  LEVAR_PECAS_SUBSTITUIDAS,
  VEICULO_MODIFICADO,
  MOBILIDADE,
  MOBILE_OK,
  MOBILE_STATUS,
  REC_INTERATIVA,
  ORCAMENTO,
  CRM_EMAIL,
  CRM_SMS,
  CRM_MALA,
  CARTAO_DOTZ,
  TELE_CONTATO,
  TELE_HORARIO_CONTATO,
  QUICK_STOP,
  EH_FIAT_PROFISSIONAL
  )
   VALUES
  (
  :COD_EMPRESA,
  :COD_OS_AGENDA,
  'A',
  'MAPSIS',
  :CONSULTOR,
  :PRISMA,   
  'R',
  :COD_CLIENTE,
  :COD_PRODUTO,
  :COD_MODELO,
  :ANO_MODELO,
  :PLACA,
  :CHASSI,
  :COR_EXTERNA,
  :KM,  
  sysdate,sysdate,
  :DATA_AGENDADA,
  :DATA_PREVISAO_FIM,
  :DATA_PROMETIDA,
  'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N'
  )    
 `

 const createSqlOsAgendaReclamacao =
 `INSERT INTO OS_AGENDA_RECLAMACAO (  
  DESCRICAO,
  COD_EMPRESA,
  COD_OS_AGENDA,
  ITEM  
  )
 values ( :DESCRICAO,
          :COD_EMPRESA,
          :COD_OS_AGENDA,          
          1)
  `

  const createSqlOsAgendaServico =
  `INSERT INTO OS_AGENDA_SERVICOS ( 
   COD_EMPRESA,
   COD_OS_AGENDA,
   COD_SERVICO,
   PRISMA,
   DATA_COMECA,
   DATA_FIM,
   TEMPO_PADRAO,
   TEMPO_PADRAO_SERVICO,
    STATUS,
    PRECO_VENDA,
    ITEM
   )
  values ( :COD_EMPRESA,
           :COD_OS_AGENDA,  
           :COD_SERVICO,
           :PRISMA,
           :DATA_COMECA,
           :DATA_FIM,
           :TEMPO_PADRAO,
           :TEMPO_PADRAO_SERVICO,
           'C',0,1)
   `

 const SqlNumeracaoOSAgenda = `SELECT SEQ_COD_OS_AGENDA.NEXTVAL COD_OS_AGENDA FROM DUAL` 

  
 async function create(emp) {
 const NEWOSAGENDA = Object.assign({}, emp); 

 const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)
 console.log(result.rows[0])
 const NumeroAgenda = result.rows[0]['COD_OS_AGENDA']

const TabelaOSAgenda = await database.simpleExecute(createSqlOSAgenda, 
                                                      [ 
                                                        NEWOSAGENDA.COD_EMPRESA,
                                                        NumeroAgenda,
                                                        NEWOSAGENDA.CONSULTOR,
                                                        NEWOSAGENDA.PRISMA,            
                                                        NEWOSAGENDA.COD_CLIENTE,
                                                        NEWOSAGENDA.COD_PRODUTO,
                                                        NEWOSAGENDA.COD_MODELO,
                                                        NEWOSAGENDA.ANO_MODELO,
                                                        NEWOSAGENDA.PLACA,
                                                        NEWOSAGENDA.CHASSI,
                                                        NEWOSAGENDA.COR_EXTERNA,
                                                        NEWOSAGENDA.KM,
                                                        NEWOSAGENDA.DATA_AGENDADA,
                                                        NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                        NEWOSAGENDA.DATA_PROMETIDA,

                                                      ]
                                                      , { autoCommit: true });
   
  const TabelaOSAgendaReclamacao = await database.simpleExecute
                                            (createSqlOsAgendaReclamacao, 
                                              [ 
                                                NEWOSAGENDA.RECLAMACAO,
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda                                                
                                              ]
                                              , { autoCommit: true });  

  const TabelaOSAgendaServico = await database.simpleExecute
                                            (createSqlOsAgendaServico, 
                                              [  
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda,     
                                                NEWOSAGENDA.COD_SERVICO, 
                                                NEWOSAGENDA.PRISMA,
                                                NEWOSAGENDA.DATA_AGENDADA,
                                                NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                NEWOSAGENDA.TEMPO_PADRAO,
                                                NEWOSAGENDA.TEMPO_PADRAO 
                                              ]
                                              , { autoCommit: true });   

      return NEWOSAGENDA;
    }

module.exports.create = create;


const deleteSql =
   `delete from os_agenda og
    where og.cod_os_agenda = :ID
    `;

 const deleteAgendaReclamacaopSql =
  `delete from OS_AGENDA_RECLAMACAO ogr
  where ogr.cod_os_agenda = :ID
  `;

  const deleteChipSql =
  `delete from OS_AGENDA_SERVICOS ogs
  where ogs.cod_os_agenda = :ID
  `;

  async function del(ID) {
 
    const result = await database.simpleExecute(deleteSql, [ID], { autoCommit: true });
    const chip   = await database.simpleExecute(deleteChipSql, [ID], { autoCommit: true });
    const Ogr   = await database.simpleExecute(deleteAgendaReclamacaopSql, [ID], { autoCommit: true });
    console.log(ID) 
    return result ;
  }
   

module.exports.delete = del;

