'use strict';

var _ = require('lodash');
var request = require('request');

function Pwinty(merchantId, key, host) {
    if (!(this instanceof Pwinty)) {
        return new Pwinty(merchantId, key, host);
    }

    this.merchantId = merchantId;
    this.key = key;
    this.host = host || 'https://sandbox.pwinty.com/v2.3/';

    this.defaults = {
        'headers': {
            'Accept': 'application/json',
            'X-Pwinty-MerchantId': merchantId,
            'X-Pwinty-REST-API-Key': key
        },
        'json': true
    };
}

Pwinty.prototype = {

    getCatalogue: function (countryCode, qualityLevel, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Catalogue/' + countryCode + '/' + qualityLevel,
            method: 'GET'
        });

        return this._request(options, callback);
    },

    getCountries: function (callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Country',
            method: 'GET'
        });

        return this._request(options, callback);
    },

    getOrders: function (callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders',
            method: 'GET'
        });

        return this._request(options, callback);
    },

    getOrdersWithStatus: function (status, callback) {
        var allowedStatuses = ['NotYetSubmitted', 'Submitted', 'AwaitingPayment', 'Complete', 'Cancelled'];

        if (allowedStatuses.indexOf(status) > -1) {

            var options = _.extend(this.defaults, {
                url: this.host + 'Orders?orderStatus=' + status,
                method: 'GET'
            });

            return this._request(options, callback);
        } else {
            return callback(new Error ('invalid status'), null);
        }
    },

    getOrder: function (id, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders' + '/' + id,
            method: 'GET'
        });

        return this._request(options, callback);
    },

    createOrder: function (params, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders',
            method: 'POST',
            body: params
        });

        return this._request(options, callback);
    },

    updateOrder: function (params, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + params.id,
            method: 'PUT',
            body: params
        });

        return this._request(options, callback);
    },

    updateOrderStatus: function (params, callback) {
        var allowedStatuses = ['Cancelled', 'AwaitingPayment', 'Submitted'];

        if (allowedStatuses.indexOf(params.status) > -1) {

            var options = _.extend(this.defaults, {
                url: this.host + 'Orders/' + params.id + '/Status',
                method: 'POST',
                body: params
            });

            return this._request(options, callback);
        } else {
            return callback(new Error ('invalid status'), null);
        }
    },

    getOrderStatus: function (id, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/SubmissionStatus',
            method: 'GET'
        });

        return this._request(options, callback);
    },

    getOrderPhoto: function (orderId, photoId, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos/' + photoId,
            method: 'GET'
        });

        return this._request(options, callback);
    },

    deleteOrderPhoto: function (orderId, photoId, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos/' + photoId,
            method: 'DELETE'
        });

        return this._request(options, callback);
    },

    getOrderPhotos: function (orderId, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + orderId + '/Photos',
            method: 'GET'
        });

        return this._request(options, callback);
    },

    addPhotoToOrder: function (id, photo, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/Photos',
            method: 'POST',
            body: photo
        });

        return this._request(options, callback);
    },

    addPhotosToOrder: function (id, photos, callback) {

        var options = _.extend(this.defaults, {
            url: this.host + 'Orders/' + id + '/Photos/Batch',
            method: 'POST',
            body: photos
        });

        return this._request(options, callback);
    },

    _request: function(options, callback) {

        return request(options, function (error, response, body) {
            if (error == null && (response.statusCode < 200 || response.statusCode >= 300)) {
                var errorMessage = "Invalid HTTP code";
                switch (response.statusCode) {
                    case 400: 
                        errorMessage = "HTTP Code 400: Bad or Missing Input Parameters; " + body.errorMessage;
                        break;
                    case 401: 
                        errorMessage = "HTTP Code 401: Request Unauthorized";
                        break;
                    case 403: 
                        errorMessage = "HTTP Code 403: Forbidden. The request is not valid for the resource in its current state";
                        break;
                    case 404: 
                        errorMessage = "HTTP Code 404: Resource not Found";
                        break;
                    case 411:
                        errorMessage = "HTTP Code 411: Empty HTTP Request";
                        break;
                    case 500:
                        errorMessage = "HTTP Code 500: Server Error";
                        break;
                }

                callback(errorMessage, body);
            } else {
                callback(error, body);
            }
        });

    }

};

module.exports = Pwinty;
