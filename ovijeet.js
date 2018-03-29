var http = require('http');
var express = require('express');
var app = express();
var app1 = express();
var sql = require('mssql');

var record;

var headers = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:34169');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}



var io = require('socket.io');

//var socketlist = [];
var clients=[];
app.use(headers);
app.get('/onload', function (req, res) {
  //   socketlist.push(socket.id);
    
   
    sql.connect("mssql://sa:pass@M2381260/MSSQLSERVER2014/Realtime").then(function () {
        // Query 

        
        new sql.Request().query("SELECT top 5 bid, DATEPART(YYYY, x) AS 'YEAR', DATEPART(MM, x) AS 'MONTH', DATEPART(DD, x) AS 'DATE', DATEPART(HH, x) AS 'Hour', DATEPART(MI, x) AS 'MINUTE', DATEPART(SS, x) AS'SECOND', DATEPART(MS, x) AS 'MILLISECOND' , DATEPART(MCS, x) AS 'MICROSECOND', DATEPART(NS, x) AS 'NANOSECOND', y FROM Realtime.dbo.SensorData").then(function (recordset) {
         
 
         //   console.log("ajax get request from client!");
   
   
            record = recordset;
res.send(record);
            
        }).catch(function (err) {
            
            console.log("SQL ERROR!!!");
        });
         
    });
    
    
    
    
   
    
});
var i = 5;







var io = require('socket.io').listen(app1.listen(8081, function () {
    console.log("Listening on 8081!")
}));




setInterval(function() {   
i = i + 1;   

}, 3000);



io.sockets.on('connection', function(socket) {
    
   console.log('New client connected (id=' + socket.id + ').');
	    clients.push(socket);

    //socketlist.push(socket);
    //socket.emit('socket_is_connected','You are connected!');   
    var tweets=setInterval(function() {    
        sql.connect("mssql://sa:pass@M2381260/MSSQLSERVER2014/Realtime").then(function () {
        
console.log("i=="+ i);
        
        new sql.Request().query("SELECT top 1 bid, DATEPART(YYYY, x) AS 'YEAR', DATEPART(MM, x) AS 'MONTH', DATEPART(DD, x) AS 'DATE', DATEPART(HH, x) AS 'Hour', DATEPART(MI, x) AS 'MINUTE', DATEPART(SS, x) AS 'SECOND', DATEPART(MS, x) AS 'MILLISECOND' , DATEPART(MCS, x) AS 'MICROSECOND', DATEPART(NS, x) AS 'NANOSECOND', y FROM Realtime.dbo.SensorData where bid>" + i + ";").then(function (recordset) {
          
            
          
            
            
            record = recordset;
          
        }).catch(function (err) {
            
            console.log("SQL ERROR!!!");
        });
        
    });
    
    console.log("Data pushed from server to client "+socket.id);
    socket.emit('message',record);
    
    
     

}, 3000);

  socket.on('disconnect',function(){
   var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
     clearInterval(tweets);
    console.log("Client closed");
    
   
    
});

 io.sockets.on('forceDisconnect', function(){
    socket.disconnect();
});   
});


    


//socketlist.forEach(function(socket) {
//  socket.destroy();
//});


app.listen(8080, function () {
    console.log("Listening on 8080!")
});




