var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var post = require('./controllers/post');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var expressSession = require('express-session');
var csrf           = require('csurf');

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

/************************
	Middle Ware
************************/	
//url encoded //bodyに必要
app.use( bodyParser.urlencoded({ extended: true }) );
//json //postに必要
app.use( bodyParser.json() );

//delete,putをhiddenの_method で使うため
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

//logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));//method, url, status,response timeを出力

/************************
		CSRF 	/ npm install cookie-parser express-session csurf /
*************************/
app.use(cookieParser());
app.use(expressSession({secret: 'secret_key'}));
app.use(csrf());
app.use(function(req, res, next) {
    res.locals.token = req.csrfToken();
    next();
});

/************************
		GET
*************************/

app.get('/', post.index);
app.get('/post/new', post.new);
app.get('/post/:id([0-9]+)', post.show);
app.get('/post/:id([0-9]+)/edit', post.edit);

/************************
		POST
*************************/
app.post('/post/create', post.create);
app.put('/post/:id', post.update);
app.delete('/post/:id([0-9]+)',post.destroy);

 


app.listen(8000);

console.log('Server listening... port:8000');



//node app は変更するたびに再立ち上げが必要だが、nodemonを入れることでnodemon appを使うことで立ち上げが必要なくなる。
