/*!
 * routable component child example
 */

/**
* Module Dependencies
*/

var EventEmitter = require('events').EventEmitter,
    routable = require('../index');

/**
* Module Exports
*/

exports = module.exports = function () {

  var self = new EventEmitter();
  
  routable.extend(self);

  self.on('attached', function () {
    // Define Routes
    self.defineRoute('index', '/');
    self.defineRoute('show', '/:childComponentId');

    // index
    self.get(self.lookupRoute('index'), function(req, res, next) {
      // test getting a parent route from inside an attached component.
      console.log(req.routeToPath('signup'));// should not throw!
      res.locals.next = req.routeToPath('show', { childComponentId: 1 });
      res.render('index', {
        title: 'Child Component Index'
      });
    });

    // load
    self.get(self.lookupRoute('show'), function (req, res, next) {
      var param = req.params.childComponentId;
      if (/^\d+$/.test(param)) {
        req.childComponent = Number(param);
      };
      next();
    })

    self.get(self.lookupRoute('show'), function (req, res, next) {
      if (!req.childComponent) {
        next(new Error('Route Not Found'));
        return;
      };
      if (req.childComponent <= 1) {
        res.locals.back = req.routeToPath('index');
      } else {
        res.locals.back = req.routeToPath('show', { childComponentId: req.childComponent - 1 });
      };
      if (req.childComponent < 3) {
        res.locals.next = req.routeToPath('show', { childComponentId: req.childComponent + 1 });
      }
      res.render('index', {
        title: 'Child Component ' + req.childComponent
      });
    });

    console.log('Child Component - Ready');
    self.emit('ready', self);

  })

  process.nextTick(function () {
    console.log('Child Component - Init');
    self.emit('init', self);
  });

  return self;

};