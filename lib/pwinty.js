'use strict';

var _ = require('lodash');
var request = require('request');
var Q = require('q');

function Pwinty(merchantId, key, host) {

    if (!(this instanceof Pwinty)) {
        return new Pwinty(merchantId, key, host);
    }

    this.merchantId = merchantId;
    this.key = key;
    this.host = host || 'https://sandbox.pwinty.com/v2.1/';

    this.defaults = {
        'headers': {
            'X-Pwinty-MerchantId': merchantId,
            'X-Pwinty-REST-API-Key': key
        },
        'json': true
    };
}

Pwinty.prototype = {

    getCatalogue: function (countryCode, qualityLevel, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Catalogue/' + countryCode + '/' + qualityLevel,
            method: 'GET'
        });

        return request(options, function (error, response, body) {
            // Resolve/reject promise
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve(body);
            }

            // Return promise, but also support original node callback style
            deferred.promise.nodeify(callback);
        });
    },

    getCountries: function (callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Country',
            method: 'GET'
        });

        return request.get(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    getOrders: function (callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders',
            method: 'GET'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    getOrder: function (id, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders' + '/' + id,
            method: 'GET'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    createOrder: function (params, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders',
            method: 'POST',
            body: params
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    updateOrder: function (params, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + params.id,
            method: 'PUT',
            body: params
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    updateOrderStatus: function (params, callback) {
        var deferred = Q.defer();

        var allowedStatuses = ['Cancelled', 'AwaitingPayment', 'Submitted'];

        if (allowedStatuses.indexOf(params.status) > -1) {

            var options = _.extend(this.defaults, {
                url: this.host + 'Orders/' + params.id + '/Status',
                method: 'POST',
                body: params
            });

            return request(options, function (error, response, body) {
              if (error) {
                deferred.reject(error);
              } else {
                deferred.resolve(body);
              }

              deferred.promise.nodeify(callback);
            });

        } else {
            deferred.reject(new Error ('invalid status'));
            return deferred.promise.nodeify(callback);
        }
    },

    getOrderStatus: function (id, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/SubmissionStatus',
            method: 'GET'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    getOrderPhoto: function (orderId, photoId, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos/' + photoId,
            method: 'GET'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });

    },

    deleteOrderPhoto: function (orderId, photoId, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos/' + photoId,
            method: 'DELETE'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });

    },

    getOrderPhotos: function (orderId, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos',
            method: 'GET'
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });

    },

    addPhotoToOrder: function (id, photo, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/Photos',
            method: 'POST',
            body: photo
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    },

    addPhotosToOrder: function (id, photos, callback) {
        var deferred = Q.defer();

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/Photos/Batch',
            method: 'POST',
            body: photos
        });

        return request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(body);
          }

          deferred.promise.nodeify(callback);
        });
    }

};

module.exports = Pwinty;
