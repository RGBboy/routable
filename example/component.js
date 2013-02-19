/*!
 * routable component example
 */

/**
* Module Dependencies
*/

var EventEmitter = require('events').EventEmitter,
    routable = require('../index'),
    attach = require('attach'),
    ChildComponent = require('./child-component');

/**
* Module Exports
*/

exports = module.exports = function () {

  var self = new EventEmitter(),
      childComponent = new ChildComponent();

  routable.extend(self);
  attach.extend(self);

  self.on('attached', function () {
    // define routes
    self.defineRoute('index', '/');
    self.defineRoute('show', '/:componentId');
    self.defineRoute('child-component', '/:componentId/child-component');

    // index
    self.get(self.lookupRoute('index'), function(req, res, next) {
      res.locals.next = req.routeToPath('show', { componentId: 1 });
      res.render('index', {
        title: 'Component Index'
      });
    });

    // load
    self.get(self.lookupRoute('show') + '*', function (req, res, next) {
      var param = req.params.componentId;
      if (/^\d+$/.test(param)) {
        req.component = Number(param);
          res.locals.back = req.routeToPath('show');
        if (req.component < 3) {
          res.locals.next = req.routeToPath('show', { componentId: req.component + 1 });
        }
      };
      next();
    })

    // show
    self.get(self.lookupRoute('show'), function (req, res, next) {
      if (!req.component) {
        next(new Error('Route Not Found'));
        return;
      }
      if (req.component <= 1) {
        res.locals.back = req.routeToPath('index');
      } else {
        res.locals.back = req.routeToPath('child-component.show', { componentId: req.component - 1, childComponentId: 3 });
      }
      res.locals.next = req.routeToPath('child-component.index');
      res.render('index', {
        title: 'Component ' + req.component
      })
    });

    self.attach('child-component', childComponent);

    // there is a bug in the router that causes a range error if this
    // is not here. It has something to do with the load route.
    self.get('*', function (req, res, next) {
      next('route');
    })
  })

  childComponent.on('init', function () {
    console.log('Component - Init');
    self.emit('init', self);
  });

  childComponent.on('ready', function () {
    console.log('Component - Ready');
    self.emit('ready', self);
  });

  return self;

};