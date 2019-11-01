const io = require('socket.io');
const http=require('http');
const fs = require('fs');
const server=http.createServer();
var ios = io.listen(server);

port = 80;
host = 'localhost';

css = 'body{'+
	'margin:0;'+
	'padding:0;'+
	'text-align:center;} '+
	'h1{'+
	'background-color:#43853d;'+
	'color:white;'+
	'padding: .5em;'+
	'font-family:"Consolas";}';

htm='<!DOCTYPE html>'+
	'<html>'+
	'<head>'+
	'<meta charset="UTF-8">'+
	'<title>Первый сервер</title>'+
	'<link rel="stylesheet" href="app.css">'+
	'</head>'+
	'<body>'+
	'<h1>Основы node js</h1>'+
	'<button id="but01">Нажать</button>'+
	'<script src="app.js"></script>'+
	'</body>'+
	'</html>';

js='const but01=document.getElementById("but01");'+
	'but01.onclick=function(){'+
	'alert("Жесть")}';

server.on('request',function(request,response){
	//console.log(request.url);
	if(request.url=='/'){
		response.writeHead(200,{'Content-Type':'text/html'});
		fs.readFile('index.html',function(err0,data0){
			if(!isNaN(err0)){
				htm = data0;}
			response.end(htm);
		});
	}else if(request.url=='/app.js'){
		response.writeHead(200,{'Content-Type':'text/javascript'});
		fs.readFile('app.js',function(err1,data1){
			if(!isNaN(err1)){
				js = data1;}
			response.end(js);
		});
	}else if(request.url=='/app.css'){
		response.writeHead(200,{'Content-Type':'text/css'});
		fs.readFile('app.css',function(err2,data2){
			if(!isNaN(err2)){
				css = data2;}
			response.end(css);
		});
	}else {
		response.writeHead(200,{'Content-Type':'text/html'});
		response.end('Content not found...');
	}
});

server.listen(port,host,function(){
	console.log('Сервер работает. Слушает хост:',host,' ,  порт:',port)
});
//n_disconnect=0
ios.sockets.on('connection', function (socket) {
	socket.on('eventServer', function (data) {
		console.log(data);
		socket.emit('eventClient', { "data": 'Hello Client! You send: '+data });
	});
	socket.on("fnServer",function(data3){
		console.log("Filename: "+data3);
		try {
			var buf = fs.readFileSync(data3,"utf8");
			err="";
		}catch{
			err = "No such file.";
			buf = "";
		}
		socket.emit("fnClient",{"err":err,"filename":data3,"data":buf});
	});
	socket.on("wrServer",function(data4){
		console.log("Write file "+data4.filename);
		try{
			fs.writeFileSync(data4.filename,data4.data);
			err="";
		}catch{
			err = "Can't write file.";			
		}
		socket.emit("wrClient",{"err":err,"filename":data4.filename});
	});
	socket.on('disconnect', function () {
		//console.log('user disconnected',n_disconnect++);
	});
});