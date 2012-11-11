/*!
 * routable component child example
 */

/**
* Module Dependencies
*/

var routable = require('../index');

/**
* Module Exports
*/

exports = module.exports = function (route) {

  var that = routable(route);

  // index
  that.get(that.lookupRoute('index'), function(req, res, next) {
    // test getting a parent route from inside an attached component.
    console.log(req.routeToPath('signup'));// should not throw!
    res.locals.next = req.routeToPath('show', { childComponentId: 1 });
    res.render('index', {
      title: 'Child Component Index'
    });
  });

  that.defineRoute('show', '/:childComponentId');

  // load
  that.get(that.lookupRoute('show'), function (req, res, next) {
    var param = req.params.childComponentId;
    if (/^\d+$/.test(param)) {
      req.childComponent = Number(param);
    };
    next();
  })

  that.get(that.lookupRoute('show'), function (req, res, next) {
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

  return that;

};