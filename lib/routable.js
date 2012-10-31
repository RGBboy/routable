/*!
 * routable
 * Copyright(c) 2012 RGBboy <me@rgbboy.com>
 * MIT Licensed
 */

/**
* Module Dependencies
*/

var express = require('express'),
    namedRoutes = require('express-named-routes');

/**
 * Create new routable component instance.
 *
 * @param {String} route
 * @api public
 */
exports = module.exports = function (route) {

  var component = express(),
      baseRoute,
      that;

  namedRoutes.extend(component);
  
  if (!route) {
    route = '/';
  }

  if ('string' != typeof route || '/' === route) {
    component.defineRoute('index', '/');
    baseRoute = '';
  } else {
    component.defineRoute('index', route);
    baseRoute = route;
  };

  /**
   * can be used as middleware
   *
   * @param {Object} req
   * @param {Object} res
   * @return {Function} next
   * @api public
   */
  that = function (req, res, next) {
    var orig = req.app,
        origRouteToPath = req.routeToPath;

    // Take the settings from the app and apply them here
    component.set('views', orig.get('views'));
    component.set('view engine', orig.get('view engine'));
    component.set('view options', orig.get('view options'));

    component.handle(req, res, function (err) {
      req.app = res.app = orig;
      req.__proto__ = orig.request;
      res.__proto__ = orig.response;
      req.routeToPath = origRouteToPath;
      next(err);
    });
  };

  /**
   * Attaches a routable component;
   *
   * @comment: When express and connect change to use params with
   * app.use, we can probably change this to just use app.use etc.
   *
   * @param {String} routeName (the name of the route)
   * @param {Component} childComponent (should be routable)
   * @return {Component} for chaining
   * @api public
   */
  that.attachComponent = function (routeName, childComponent) {
    that.defineRoute(routeName, childComponent.lookupRoute());
    that.all(childComponent.lookupRoute('index') + '*', childComponent);
    return that;
  };

  /**
   * Proxy express-named-routes .defineRoute to attach base route to the front.
   *
   * @param {String} routeName (the name of the route)
   * @param {Component} childComponent (should be routable)
   * @return {Component} for chaining
   * @api public
   */
  that.defineRoute = function (routeName, route) {
    if ('string' === typeof route && route != '/') {
      route = baseRoute + route;
    }
    component.defineRoute(routeName, route);
    return that;
  };

  /**
   * Delegate to express-named-routes .lookupRoute
   *
   * @param {String} routeName (the name of the route)
   * @return {String} route
   * @api public
   */
  that.lookupRoute = component.lookupRoute;

  /**
   * Delegate `.VERB(...)` calls to `component.VERB(...)`.
   *
   * @note: Currently this jsut supports GET and POST methods
   */
  var proxyMethods = ['get', 'post'];
  proxyMethods.forEach(function(method){
    that[method] = function () {
      component[method].apply(component, arguments);
      return that;
    }
  });

  /**
   * Special-cased "all" method, applying the given route `path`,
   * middleware, and callback to all methods.
   *
   * @param {String} path
   * @param {Function} ...
   * @return {Component} for chaining
   * @api public
   */
  that.all = function () {
    var args = arguments;
      proxyMethods.forEach(function(method){
        that[method].apply(that, args);
      });
    return that;
  }

  /**
   * Delegate `.use(...)` calls to `component.use(...)`.
   */
  that.use = function () {
    component.use.apply(component, arguments);
    return that;
  }

  return that;

};

/**
* Library version.
*/

exports.version = '0.0.1';