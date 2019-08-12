var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql')
// Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'notas'
})

app.get('/', function(req, res){
  res.sendFile('D:/xampp/htdocs/socketio_cat/index.html');
});

io.on('connection', function(socket){
  console.log('an user connected');
  //REQUEST DATABASE AND FILL PAGE
  var datos_db;
  // make to connection to the database.
  db.query("SELECT * FROM notas", function (err, datos_db, fields) {
    console.log('usuario recibio datos cantidad:');
    console.log(datos_db.length);
    socket.emit('populate', datos_db);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  socket.on('send_nota', function(msg){
    console.log('nota: ' + msg.nota);
    console.log('instrumento: ' + msg.instrumento);
    io.emit('add_nota', msg);
    var sql = "INSERT INTO notas (id_instrumento, registro) VALUES (?,?)";
    db.query(sql, [msg.instrumento,msg.nota]);
  });
  socket.on('borrartodo', function() {
    console.log('borrar todo requested');
    db.query("DELETE FROM notas");
  });
});
