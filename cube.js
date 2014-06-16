/**
 * @requires Vector3
 * Created by ForrestMac on 16/06/2014.
 */
Cube = function (vCenter, vExtend) {
    this.center = vCenter;
    this.extend = vExtend;
};

Cube.prototype =
{
    copy: function () {
        return new Cube(this.center, this.extend);
    },

    initialise: function () {
    },

    min: function () {
        this.center.subtract(this.extend);
    },

    max: function () {
        this.center.add(this.extend);
    },

    intersect : function (ray) {

    }
};


