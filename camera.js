/**
 * @require Vector3
 * Created by ForrestMac on 16/06/2014.
 */

//*********************************
// camera, perspective projection
//*********************************
PerspectiveCamera = function (eye, front, up, fov, distToScreen) {
    this.eye = eye;
    this.front = front;
    this.refUp = up;
    this.fov = fov;
    this.distToScreen = distToScreen;
};
PerspectiveCamera.prototype = {
    initialise : function() {
        this.right = this.front.cross(this.refUp);
        this.up = this.right.cross(this.front);
        this.fovScale = Math.tan(this.fov * 0.5 * Math.PI / 180) * 2;
    },
    generateRay : function (x, y) {
        var r = this.right.multiply((x - 0.5) * this.fovScale * this.distToScreen);
        var u = this.up.multiply((y - 0.5) * this.fovScale * this.distToScreen);
        return new Ray3(this.eye, this.front.add(r).add(u).normalise());
    }
};
