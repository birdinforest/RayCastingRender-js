"use strict";

//*********************************
// intersection class, stores intersection data
//*********************************
var IntersectResult = function () {
    this.geometry = null;
    this.distance = 0;
    this.position = Vector3.zero;
    this.normal = Vector3.zero;
};
// no hit
IntersectResult.noHit = new IntersectResult();

//*********************************
// Ray class
//*********************************
var Ray3 = function (origin, direction) {
    this.origin = origin;
    this.direction = direction;
};

Ray3.prototype = {
    getPoint : function (t) {
        return this.origin.add(this.direction.multiply(t));
    }
};
//*********************************
// camera, perspective projection
//*********************************
var PerspectiveCamera = function (eye, front, up, fov, distToScreen) {
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

//*********************************
// depth render function
//*********************************
function renderDepth(canvas, scene, camera, maxDepth)
{
    // initialise the rendering shape
    scene.initialise();
    // initialise the camera
    camera.initialise();

    // get imagedata pixels from canvas
    var ctx = canvas.getContext("2d");
    var w = canvas.attributes.width.value;
    var h = canvas.attributes.height.value;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, w, h);
    var imgdata = ctx.getImageData(0, 0, w, h);
    // pixels[0] to pixels[3] presents red, green, blue, alpha of one pixel
    var pixels = imgdata.data;

    // calculate depth render data
    var i = 0;
    for(var y = 0; y < h; y++)
    {
        // y starts from left top
        // sy starts from left bottom
        var sy = 1 - y / h;
        for(var x = 0; x < w; x++)
        {
            var sx = x / w;

            // generate a ray
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);

            // if intersection detected
            if(result.geometry)
            {
                // depth = maxDepth, color = 0 (black)
                // depth = 0, color = 255 (white)
                var depth = 255 -
                    Math.min( (result.distance / maxDepth) * 255, 255 );

                pixels[i    ] = depth;
                pixels[i + 1] = depth;
                pixels[i + 2] = depth;
                pixels[i + 3] = 255;
            }
            i += 4;     // step is 4
        }
    }

    // render
    ctx.putImageData(imgdata, 0, 0);
}
//*********************************
// normal render function
//*********************************
function renderNormal(canvas, scene, camera)
{
    // initialise the rendering shape
    scene.initialise();
    // initialise the camera
    camera.initialise();

    // get imagedata pixels from canvas
    var ctx = canvas.getContext("2d");
    var w = canvas.attributes.width.value;
    var h = canvas.attributes.height.value;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, w, h);
    var imgdata = ctx.getImageData(0, 0, w, h);
    // pixels[0] to pixels[3] presents red, green, blue, alpha of one pixel
    var pixels = imgdata.data;

    // calculate depth render data
    var i = 0;
    for(var y = 0; y < h; y++)
    {
        // y starts from left top
        // sy starts from left bottom
        var sy = 1 - y / h;
        for(var x = 0; x < w; x++)
        {
            var sx = x / w;

            // generate a ray
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);

            // if intersection detected
            if(result.geometry)
            {
                var normal = result.normal;
                // transform vector3 normal.xyz from [-1, 1] to [0, 2]
                // then transform it to [0, 255]
                // finally, assign rgb values to pixels rgb
                pixels[i    ] = (normal.x + 1) * 128;
                pixels[i + 1] = (normal.y + 1) * 128;
                pixels[i + 2] = (normal.z + 1) * 128;
                pixels[i + 3] = 255;
            }
            i += 4;     // step is 4
        }
    }

    // render
    ctx.putImageData(imgdata, 0, 0);
}

//*********************************
// Material render function
//*********************************
function materialRender(canvas, scene, camera)
{
    // initialise the rendering shape
    scene.initialise();
    // initialise the camera
    camera.initialise();

    // get imagedata pixels from canvas
    var ctx = canvas.getContext("2d");
    var w = canvas.attributes.width.value;
    var h = canvas.attributes.height.value;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, w, h);
    var imgdata = ctx.getImageData(0, 0, w, h);
    // pixels[0] to pixels[3] presents red, green, blue, alpha of one pixel
    var pixels = imgdata.data;

    // calculate depth render data
    var i = 0;
    for(var y = 0; y < h; y++)
    {
        // y starts from left top
        // sy starts from left bottom
        var sy = 1 - y / h;
        for(var x = 0; x < w; x++)
        {
            var sx = x / w;

            // generate a ray
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);

            // if intersection detected
            if(result.geometry)
            {
                var colour = result.geometry.material.sample( ray, result.position, result.normal );
                pixels[i    ] = colour.r * 255;
                pixels[i + 1] = colour.g * 255;
                pixels[i + 2] = colour.b * 255;
                pixels[i + 3] = 255;
            }
            i += 4;     // step is 4
        }
    }

    // render
    ctx.putImageData(imgdata, 0, 0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//*********************************
// Render
//*********************************

// canvas 1
var bgCanvas = document.getElementById("bgCanvas");
var bg_ctx = bgCanvas.getContext("2d");
var bg_w = bgCanvas.attributes.width.value;
var bg_h = bgCanvas.attributes.height.value;
bg_ctx.fillStyle = "rgb(0,0,0)";
bg_ctx.fillRect(0, 0, bg_w, bg_h);
var bg_imgdata = bg_ctx.getImageData(0, 0, bg_w, bg_h);
var bg_pixels = bg_imgdata.data;
var i = 0;
for (var bg_y = 0; bg_y < bg_h; bg_y++)
    for (var bg_x = 0; bg_x < bg_w; bg_x++)
    {
        bg_pixels[i++] = bg_x / bg_w * 255;
        bg_pixels[i++] = bg_y / bg_h * 255;
        bg_pixels[i++] = 0;
        bg_pixels[i++] = 200;
    }
bg_ctx.putImageData(bg_imgdata, 0, 0);

// canvas 2
var fgCanvas = document.getElementById("fgCanvas");
var fg_ctx = fgCanvas.getContext("2d");
var fg_w = fgCanvas.attributes.width.value;
var fg_h = fgCanvas.attributes.height.value;
fg_ctx.fillStyle = "rgb(0,0,0)";
fg_ctx.fillRect(0, 0, fg_w, fg_h);
var fg_imgdata = fg_ctx.getImageData(0, 0, fg_w, fg_h);
var fg_pixels = fg_imgdata.data;
i = 0;
for (var fg_y = 0; fg_y < fg_h; fg_y++)
    for (var fg_x = 0; fg_x < fg_w; fg_x++)
    {
//        pixels[i++] = fg_y / fg_h * 255;
        fg_pixels[i++] = fg_x / fg_w * 255;
        fg_pixels[i++] = 0;
        fg_pixels[i++] = fg_y / fg_h * 255;
        fg_pixels[i++] = 200;
    }
fg_ctx.putImageData(fg_imgdata, 0, 0);

// depth render
var depthCanvas = document.getElementById('depthCanvas');
var sphere = new Sphere(new Vector3(0, 0, 0), 10);
renderDepth(depthCanvas, sphere,
            new PerspectiveCamera( new Vector3(0, 0, 20),
                                   new Vector3(0, 0, -1), new Vector3(0, 1, 0),
                                   90, 1 ),
            20);

// normal render
var normalCanvas = document.getElementById('normalCanvas');
renderNormal(normalCanvas, sphere,
             new PerspectiveCamera( new Vector3(0, 0, 20),
             new Vector3(0, 0, -1), new Vector3(0, 1, 0),
             90, 1 ));

// material Phong lighting render
var plane = new Plane(new Vector3(0, 1, 0), 0);
var sphereRed = new Sphere(new Vector3(-10, 10, -10), 10);
var sphereBlue = new Sphere(new Vector3(10, 10, -10), 10);
plane.material = new CheckerMaterial(0.1);
sphereRed.material = new PhongMaterial(Colour.red, Colour.white, 16);
sphereBlue.material = new PhongMaterial(Colour.blue, Colour.white, 16);
materialRender(
    document.getElementById('materialCanvas'),
    new Union([plane, sphereRed, sphereBlue]),
//    new Union([sphereRed, sphereBlue]),
    new PerspectiveCamera( new Vector3(0, 5, 15),
                           new Vector3(0, 0, -1), new Vector3(0, 1, 0),
                           90, 1 )
);
