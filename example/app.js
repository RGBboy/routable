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
    Component = require('./component');

/**
 * Module Exports
 */

exports = module.exports = function () {

  var self = express(),
      component = Component();

  namedRoutes.extend(self);
  attach.extend(self);

  function init () {

    console.log('Application - Init');

    // Views
    self.set('views', __dirname + '/views');
    self.set('view engine', 'jade');
    self.set('view options', { layout: false });

    self.use(express.logger('dev'));
    self.use(express.static(__dirname + '/public'));

    self.defineRoute('index', '/');
    self.defineRoute('signup', '/signup');
    self.defineRoute('component', '/component');

    self.get(self.lookupRoute('index'), function (req, res) {
      res.locals.next = req.routeToPath('component.index');
      res.render('index', {
        title: 'Index'
      });
    });

    self.get(self.lookupRoute('component') + '*', function (req, res, next) {
      res.locals.back = req.routeToPath('index');
      next();
    });

    self.attach('component', component);

    self.get('*', function (req, res, next) {
      next('route');
    })

    self.use(express.errorHandler());

  };

  function ready () {
    console.log('Application - Ready');
    self.emit('ready');
  };

  component.on('init', init);
  component.on('ready', ready);

  return self;

};

if (!module.parent) {
  var app = module.exports();
  app.on('ready', function () {
    app.listen(8000);
    console.log('App started on port 8000');
  });
};