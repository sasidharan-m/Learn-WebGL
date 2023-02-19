//ColoredPoint.js
//Author: Sasidharan Mahalingam
//Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position;\n' +
  ' gl_PointSize = a_PointSize;\n'+
  '}\n';

//Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main()  {\n' +
  ' gl_FragColor = u_FragColor;\n' +
  '}\n';

function main() {
// Retrieve canvas element
var canvas = document.getElementById('webgl');

//Get the rendering context for WebGL
var gl = getWebGLContext(canvas);
if(!gl) {
  console.log('Failed to get the rendering context for WebGL');
  return;
}

//Initialize shaders
if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to initialize shaders.');
  return;
}

//Get storage location of the atribute variables
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if(a_Position < 0) {
  console.log('Failed to get the storage location of a_Position');
  return;
}

var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
if(a_PointSize < 0) {
  console.log('Failed to get the storage location of a_PointSize');
  return;
}

//Get storage location of the uniform variable
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
if(!u_FragColor) {
	console.log('Failed to get the storage location of u_FragColor');
	return;
}

//Pass point size to the attribute variable
gl.vertexAttrib1f(a_PointSize, 10.0);

//Register function(event handler) to be called on mouse press
canvas.onmousedown = function(ev) {click(ev, gl, canvas, a_Position, u_FragColor);};

//Set the color for clearing the <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//Clear canvas
gl.clear(gl.COLOR_BUFFER_BIT);

}

//Array to store mouse press positions
var g_points = [];
//Array to store the color for the mouse press positions
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor)
{
  //Store X co-ordinate of the mouse click
  var x = ev.clientX;
  //Store Y co-ordinate of the mouse click
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
  y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
  //Store the co-ordinates into the mouse click array
  g_points.push([x,y]);
  //Store the color value for the mouse click co-ordinates
  //Store red color for the 1st quadrant
  if(x >= 0.0 && y >= 0.0) {
  	g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } 
  //Store green color for the 3rd quadrant
  else if(x < 0.0 && y < 0.0) {
  	g_colors.push([0.0, 1.0, 0.0, 1.0]);
  }
  //Store white color for other quadrants
  else {
  	g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }
  //Set the color for clearing the <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  var len = g_points.length;
  for(var i = 0; i < len; ++i) {
  	var xy = g_points[i];
  	var rgba = g_colors[i];
    //Pass the position of the point to a_Position
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    //Pass the color of the point to u_FragColor
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //Draw the point
    gl.drawArrays(gl.POINTS, 0, 1);
  }

}