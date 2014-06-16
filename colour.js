/**
 * @requires Vector3
 * Created by ForrestMac on 16/06/2014.
 */

//*********************************
// Colour
//*********************************
Colour = function(r, g, b){
    this.r = r; this.g = g; this.b = b;
};
Colour.prototype = {
    copy : function () {
        return new Colour(this.r, this.g, this.b);
    },
    add : function (c) {
        return new Colour(this.r + c.r, this.g + c.g, this.b + c.b);
    },
    multiply : function (s) {
        return new Colour(this.r * s, this.g * s, this.b * s);
    },
    modulate : function (c) {
        return new Colour(this.r * c.r, this.g * c.g, this.b * c.b);
    }
};

Colour.black = new Colour(0, 0, 0);
Colour.white = new Colour(1, 1, 1);
Colour.red = new Colour(1, 0, 0);
Colour.green = new Colour(0, 1, 0);
Colour.blue = new Colour(0, 0, 1);
