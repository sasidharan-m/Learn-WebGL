//ClickedPoint.js
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
  'void main()  {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

//Pass point size to the attribute variable
gl.vertexAttrib1f(a_PointSize, 10.0);

//Register function(event handler) to be called on mouse press
canvas.onmousedown = function(ev) {click(ev, gl, canvas, a_Position);};

//Set the color for clearing the <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//Clear canvas
gl.clear(gl.COLOR_BUFFER_BIT);

}

//Array to store mouse press positions
var g_points = [];
function click(ev, gl, canvas, a_Position)
{
  //Store X co-ordinate of the mouse click
  var x = ev.clientX;
  //Store Y co-ordinate of the mouse click
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
  y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
  //Store the co-ordinates into the mouse click array
  g_points.push(x);
  g_points.push(y);
  //Set the color for clearing the <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  var len = g_points.length;
  for(var i = 0; i < len; i+=2) {
    //Pass the position of the point to a_Position
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

    //Draw the point
    gl.drawArrays(gl.POINTS, 0, 1);
  }

}