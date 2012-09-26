/*!
 * routable example
 */

/**
* Module Dependencies
*/

var express = require('express'),
    app = express(),
    namedRoutes = require('express-named-routes'),
    component = require('./component');

// Views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

namedRoutes.extend(app);

app.defineRoute('index', '/');
app.defineRoute('signup', '/signup');

app.get(app.lookupRoute('index'), function (req, res) {
  res.locals.next = req.routeToPath('component');
  res.render('index', {
    title: 'Index'
  });
});

var componentInstance = component('/component');
app.defineRoute('component', componentInstance.lookupRoute());
app.use(componentInstance);

app.use(express.errorHandler());

/**
* Module Exports
*/

if (!module.parent) {
  app.listen(8000);
  console.log('Express app started on port 8000');
};