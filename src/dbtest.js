var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123456',
    port: '3306',
    database: 'stdb',
});

connection.connect();
var sqlQuery="SELECT S.Sname,C.Cname,SC.Grade FROM S,SC,C WHERE S.Sno=161520115 AND SC.Sno=S.Sno AND C.Cno=SC.Cno";
connection.query(sqlQuery,function(err,result){
  if(err){
    console.log('[SELECT ERROR] - ',err.message);
    return;
  }

 console.log('--------------------------SELECT----------------------------');
 console.log(result);
 console.log('------------------------------------------------------------\n\n');
})
