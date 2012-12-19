/*!
 * routable example
 */

/**
* Module Dependencies
*/

var express = require('express'),
    app = express(),
    namedRoutes = require('express-named-routes'),
    attach = require('attach'),
    Component = require('./component'),
    component = new Component();

namedRoutes.extend(app);
attach.extend(app);

// Views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

app.defineRoute('index', '/');
app.defineRoute('signup', '/signup');
app.defineRoute('component', '/component');

app.get(app.lookupRoute('index'), function (req, res) {
  res.locals.next = req.routeToPath('component.index');
  res.render('index', {
    title: 'Index'
  });
});

app.get(app.lookupRoute('component') + '*', function (req, res, next) {
  res.locals.back = req.routeToPath('index');
  next();
});

app.attach('component', component);

app.get('*', function (req, res, next) {
  next('route');
})

app.use(express.errorHandler());

/**
* Module Exports
*/

if (!module.parent) {
  app.listen(8000);
  console.log('Express app started on port 8000');
};