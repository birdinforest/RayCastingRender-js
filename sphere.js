/**
 * @requires Vector3
 * Created by ForrestMac on 16/06/2014.
 */

//*********************************
// Sphere class
//*********************************
Sphere = function (center, radius) {
    this.center = center;
    this.radius = radius;
};

Sphere.prototype =
{
    copy : function ()
    {
        return new Sphere(this.center.copy(), this.radius.copy());
    },
    initialise : function ()
    {
        // pre calculate this. it is optimise.
        this.sqrRadius = this.radius * this.radius;
    },

    // intersection checking between sphere and ray
    intersect : function (ray)
    {
        var v = ray.origin.subtract(this.center);
        var a0 = v.sqrLength() - this.sqrRadius;
        var DdotV = ray.direction.dot(v);

        // ????????????????????????????????
        // if the origin of ray is outside sphere
        // only when DdotV less/equal than 0, intersection is possible
        // and note that we only look for the nearest intersection
        // ????????????????????????????????
        if (DdotV <= 0)
        {
            var discr = DdotV * DdotV - a0;
            if (discr > 0)
            {
                // record intersection data
                var result = new IntersectResult();

                result.geometry = this;
                result.distance = -DdotV - Math.sqrt(discr);
                result.position = ray.getPoint(result.distance);
                result.normal = result.position.subtract(this.center).normalise();
                return result;
            }
        }
        // if no intersection
        return IntersectResult.noHit;
    }
};

