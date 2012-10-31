/*!
 * routable component example
 */

/**
* Module Dependencies
*/

var routable = require('../index'),
    childComponent = require('./child-component');

/**
* Module Exports
*/

exports = module.exports = function (route) {

  var that = routable(route);

  // index
  that.get(that.lookupRoute('index'), function(req, res, next) {
    res.locals.next = req.routeToPath('show', { componentId: 1 });
    res.render('index', {
      title: 'Component Index'
    });
  });

  that.defineRoute('show', '/:componentId');

  // load
  that.get(that.lookupRoute('show') + '*', function (req, res, next) {
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
  that.get(that.lookupRoute('show'), function (req, res, next) {
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

  // child-component
  that.childComponentInstance = childComponent(that.lookupRoute('show') + '/child-component');
  that.attachComponent('child-component', that.childComponentInstance);

  that.get('*', function (req, res, next) {
    next('route');
  })

  return that;

};