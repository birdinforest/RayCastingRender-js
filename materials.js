/*
 *@requests Vector3
 *@requests Color
 * Created by ForrestMac on 16/06/2014.
 */


//*********************************
// Material
//*********************************

// Checker Material
// scale = 0.1 means there are 0.1 grid in 1 * 1 area
// so that grid size is 10 * 10
//var CheckerMaterial = function (scale, reflectiveness) {
//    this.scale = scale;
//    this.reflectiveness = reflectiveness;
//};
//CheckerMaterial.prototype = {
//    sample : function (ray, position, normal) {
//        return Math.abs( (Math.floor(position.x * 0.1) +
//                          Math.floor(position.z * this.scale)) % 2
//                       ) < 1 ? Colour.black : Color.white;
//    }
//};
CheckerMaterial = function(scale, reflectiveness) { this.scale = scale; this.reflectiveness = reflectiveness; };

CheckerMaterial.prototype = {
    sample : function(ray, position, normal) {
        return Math.abs((Math.floor(position.x * 0.1) + Math.floor(position.z * this.scale)) % 2) < 1 ? Colour.black : Colour.white;
    }
};

// Phone Material
PhongMaterial = function (diffuse, specular, shininess, reflectiveness) {
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
    this.reflectiveness = reflectiveness;
};

// global temp
var lightDir = new Vector3(1, 1, 1).normalise();
var lightColour = Colour.white;

PhongMaterial.prototype = {
    sample : function (ray, position, normal) {
        var NdotL = normal.dot(lightDir);
        var H = (lightDir.subtract(ray.direction)).normalise();
        var NdotH = normal.dot(H);
        var diffuseTerm = this.diffuse.multiply( Math.max(NdotL, 0) );
        var specularTerm = this.specular.multiply( Math.pow(Math.max(NdotH, 0), this.shininess) );
        return lightColour.modulate( diffuseTerm.add(specularTerm) );
    }
};
