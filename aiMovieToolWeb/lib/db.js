/**
 * db.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.03.20
 * author : sdkim
 */

var mysql   = require('mysql');
var config  = require('../config');
/*
var db      = mysql.createConnection({
   host:`${config.apps[0].env.DB_CONN_IP}`,
   user:`${config.apps[0].env.DB_CONN_ID}`,
   password:`${config.apps[0].env.DB_CONN_PW}`,
   database:`${config.apps[0].env.DB_CONN_DB}`,
   multipleStatements: true
});
db.connect();  // 모듈에서 한번만 연결하면 됨. dao 함수 내에서 요청 시마다 연결하니깐 두번 호출시 에러 발생.

module.exports  = db;
*/


var dbc      = {
   host:`${config.apps[0].env.DB_CONN_IP}`,
   user:`${config.apps[0].env.DB_CONN_ID}`,
   password:`${config.apps[0].env.DB_CONN_PW}`,
   database:`${config.apps[0].env.DB_CONN_DB}`,
   multipleStatements: true
};

var db;

function handleDisconnect() {
  db = mysql.createConnection(dbc); // Recreate the connection, since
                                                  // the old one cannot be reused.

  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db###:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }
     console.log('end of connect###');
                                            // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.

                                          // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error###', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      console.log('protocol lost###');
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      console.log('else lost####');
      throw err;                                  // server variable configures this)
    }
      console.log('end of db error###');
  });


  console.log('end of handleDisconnect###');
}

handleDisconnect();

setInterval(function () {
    db.query('SELECT 1');
}, 5000);

module.exports  = db;

/*


var db      = mysql.createPool({
   host:`${config.apps[0].env.DB_CONN_IP}`,
   user:`${config.apps[0].env.DB_CONN_ID}`,
   password:`${config.apps[0].env.DB_CONN_PW}`,
   database:`${config.apps[0].env.DB_CONN_DB}`,
   multipleStatements: true
});

exports.getUsers = function(callback) {
  db.getConnection(function(err, connection) {
    if(err) {
      console.log("create pool error1");
      console.log(err);
      callback(true);
      return;
    }
    var sql = "SELECT group_cd FROM common_cd";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) {
        console.log("create pool error2");
        console.log(err);
        callback(true);
        return;
      }
      callback(false, results);
    });
  });
};

module.exports  = db;

*/
