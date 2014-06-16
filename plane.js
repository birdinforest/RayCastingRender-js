/*
 * Created by ForrestMac on 15/06/2014.
 * @requires Vector3
 * @requires IntersectResult
 */
Plane = function(vNormal, fDist) {
    this.normal = vNormal;
    this.distance = fDist;
};

Plane.prototype = {
    copy : function() {
        return new Plane(this.normal.copy(), this.distance);
    },

    initialise : function () {
        this.p0 = this.normal.multiply(this.distance);
    },

    intersect : function (ray) {
        var denom = ray.direction.dot(this.normal);
        // if denom = 0, ray parallel to the plane
        if(denom != 0) {
//            var b = this.normal.dot(ray.origin.subtract(this.p0));
            var b = this.normal.dot(this.p0.subtract(ray.origin));
            var t = b / denom;
            // if t < 0, no intersection
            if(t >= 0) {
                var result = new IntersectResult();
                result.geometry = this;
                result.distance = t;
                result.position = ray.getPoint(result.distance);
                result.normal = this.normal;
                return result;
            }
        }
        return IntersectResult.noHit;
    }
};