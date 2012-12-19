/*!
 * routable
 * Copyright(c) 2012 RGBboy <me@rgbboy.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express'),
    namedRoutes = require('express-named-routes');

/**
 * Library version.
 */

exports.version = '0.0.2';

/**
 * Module Exports
 */

exports.extend = function (self) {

  var proxy = express();

  /**
   * can be used as middleware
   *
   * @param {Object} req
   * @param {Object} res
   * @return {Function} next
   * @api public
   */
  self.handler = function (req, res, next) {
    var orig = req.app,
        origRouteToPath = req.routeToPath;

    // Take the settings from the app and apply them here
    proxy.set('views', orig.get('views'));
    proxy.set('view engine', orig.get('view engine'));
    proxy.set('view options', orig.get('view options'));

    proxy.handle(req, res, function (err) {
      req.app = res.app = orig;
      req.__proto__ = orig.request;
      res.__proto__ = orig.response;
      req.routeToPath = origRouteToPath;
      next(err);
    });
  };

  /**
   * Delegate `.VERB(...)` calls to `component.VERB(...)`.
   *
   * @note: Currently this just supports GET and POST methods
   */
  var proxyMethods = ['get', 'post', 'put', 'delete'];
  proxyMethods.forEach(function(method){
    self[method] = function () {
      proxy[method].apply(proxy, arguments);
      return self;
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
  self.all = function () {
    var args = arguments;
      proxyMethods.forEach(function(method){
        self[method].apply(self, args);
      });
    return self;
  }

  /**
   * Delegate `.use(...)` calls to `component.use(...)`.
   */
  self.use = function () {
    proxy.use.apply(proxy, arguments);
    return self;
  }

  namedRoutes.extend(self);

  return self;

};