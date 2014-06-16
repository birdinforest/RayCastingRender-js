/**
 * @requires Vector3
 * @requires Ray3
 * @requires IntersectResult
 * Created by ForrestMac on 15/06/2014.
 */

Union = function (geometries) {
   this.geometries = geometries;
};

Union.prototype = {
    initialise : function () {
        for (var i in this.geometries)
            this.geometries[i].initialise()
    },

    intersect : function (ray) {
        var minDistance = Infinity;
        var minResult = IntersectResult.noHit;
        for (var i in this.geometries) {
            var geo = this.geometries[i];
            var result = geo.intersect(ray);
//            if(result != IntersectResult.noHit)
//            {
//                alert("get hit");
//            }
            if(result.geometry && result.distance < minDistance) {
                minDistance = result.distance;
                minResult = result;
            }
        }
        return minResult;
    }
};
