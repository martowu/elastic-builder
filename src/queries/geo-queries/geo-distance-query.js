'use strict';

const isNil = require('lodash.isnil');

const { GeoPoint, util: { checkType, invalidParam } } = require('../../core');

const GeoQueryBase = require('./geo-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html';

const invalidDistanceTypeParam = invalidParam(ES_REF_URL, 'distance_type', "'plane' or 'arc'");

/**
 * Filters documents that include only hits that exists within a specific distance from a geo point.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
 *
 * @example
 * const geoQry = bob.geoDistanceQuery('pin.location', bob.geoPoint().lat(40).lon(-70))
 *  .distance('12km');
 *
 * const geoQry = bob.geoDistanceQuery()
 *  .field('pin.location')
 *  .distance('200km')
 *  .geoPoint(bob.geoPoint().lat(40).lon(-70));
 */
class GeoDistanceQuery extends GeoQueryBase {
    /**
     * Creates an instance of `GeoDistanceQuery`
     *
     * @param {string=} field
     * @param {GeoPoint=} point Geo point used to measure and filter documents based on distance from it.
     */
    constructor(field, point) {
        super('geo_distance', field);

        if (!isNil(point)) this.geoPoint(point);
    }

    /**
     * Sets the radius of the circle centred on the specified location. Points which
     * fall into this circle are considered to be matches. The distance can be specified
     * in various units.
     *
     * @param {string|number} distance Radius of circle centred on specified location.
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained.
     */
    distance(distance) {
        this._queryOpts.distance = distance;
        return this;
    }

    /**
     * Sets the distance calculation mode, `arc` or `plane`.
     * The `arc` calculation is the more accurate.
     * The `plane` is the faster but least accurate.
     *
     * @param {string} type
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained
     * @throws {Error} If `type` is neither `plane` nor `arc`.
     */
    distanceType(type) {
        if (isNil(type)) invalidDistanceTypeParam(type);

        const typeLower = type.toLowerCase();
        if (typeLower !== 'plane' && typeLower !== 'arc') invalidDistanceTypeParam(type);

        this._queryOpts.distance_type = typeLower;
        return this;
    }

    /**
     * Sets the point to filter documents based on the distance from it.
     *
     * @param {GeoPoint} point Geo point used to measure and filter documents based on distance from it.
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained
     * @throws {TypeError} If parameter `point` is not an instance of `GeoPoint`
     */
    geoPoint(point) {
        checkType(point, GeoPoint);

        this._fieldOpts = point;
        return this;
    }
}

module.exports = GeoDistanceQuery;
