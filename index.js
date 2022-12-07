const webServer = require('./services/web-server.js');
const database = require('./services/database.js');
const dbConfig = require('./config/database.js');
const axios = require('axios');


const defaultThreadPoolSize = 4;

process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;
   
 
  // export LD_LIBRARY_PATH=/home/renato/oracle/instantclient_21_4:$LD_LIBRARY_PATH

async function startup() {
  console.log('Starting application');

  try {
    console.log('Initializing webServer');
    await webServer.initialize();
  } catch (err) {
    console.error(err);
  
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log('Initializing Banco Oracle');    
    await database.initialize(); 
  } catch (err) {
    console.error(err);
  
    process.exit(1); // Non-zero failure code
  }
}

startup();


// *** previous code above this line ***

async function shutdown(e) {
  let err = e;
    
  console.log('Shutting down');

  try {
    console.log('Closing web server module');

    await webServer.close(); 
  } catch (e) {
    console.log('Encountered error', e);

    err = err || e;
  }

  try {
    console.log('Closing database module');
 
    await database.close(); 
  } catch (err) {
    console.log('Encountered error', e);
 
    err = err || e;
  }

  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});



///////////////////////////PARTE DE MONITOR//////////////////////////////
async function monitor () {

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let hora = today.getHours();
  let minutos  = today.getMinutes();
  let seguntos = today.getSeconds();
  
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  if (hora < 10) hora = '0' + hora;
  if (minutos < 10) minutos = '0' + minutos;
  if (seguntos < 10) seguntos = '0' + seguntos;
  
  
  const formattedToday = dd + '/' + mm + '/' + yyyy;
  const HoraMin = hora + ':' + minutos + ':' + seguntos;
 
 

  var axios = require('axios');
	var data = { 
		"email": process.env.NOME_CLIENTE,
    "mensagem": "sistema com funcionamento normal",
    "data": formattedToday + ' ' + HoraMin
	}

var config = {
  method: 'post',
  url: 'https://pap3ln1bx4.execute-api.us-east-1.amazonaws.com/patients/post',
  headers: { 
    'Content-Type': 'text/plain'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  console.log('Monitor do sistema ligado!')
  console.log(data)
})
.catch(function (error) {
  console.log(error);
});




}

//monitor()


function startTimer() { 
 
  timer = setInterval(function() {  
        monitor()      
  }, 900000);
}
    
startTimer()
