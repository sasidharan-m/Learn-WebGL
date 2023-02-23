//RotatedTranslatedTriangle.js
//Author: Sasidharan Mahalingam
//Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  ' gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

//Fragment shader program
var FSHADER_SOURCE =
  'void main()  {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

var ANGLE_STEP = 45.0;

function main() {
//Retrieve canvas element
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

//Set positions of vertices
var n = initVertexBuffers(gl);
if(n < 0) {
	console.log('Failed to set the positions of the vertices');
	return;
}

//Set color for clearing the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//Define the rotation matrix
//Note: WebGL uses column major order
var modelMatrix = new Matrix4();

//Current rotational angle of triangle
var currentAngle = 0.0;


//Get storage location of the uniform variable
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if(!u_ModelMatrix) {
	console.log('Failed to get the storage location of u_ModelMatrix');
	return;
}


var tick = function() {
	currentAngle = animate(currentAngle);
	draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
	requestAnimationFrame(tick);
}

tick();

}


function initVertexBuffers(gl)
{
	var vertices = new Float32Array([
		0.0, 0.5,	-0.5,-0.5,	0.5,-0.5
	]);
	var n = 3;
	//Create a buffer object
	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	//Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	//Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	//Get storage location of the atribute variables
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
	  console.log('Failed to get the storage location of a_Position');
	  return;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}


function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
{
	//Set up rotation matrix
	modelMatrix.setRotate(currentAngle, 0, 0, 1);
	//Pass the rotation matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	//Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	//Draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

//Get last time this function was called
var g_last = Date.now();
function animate(angle)
{
	//Calculate elapsed time
	var now = Date.now()
	var elapsed = now - g_last;
	g_last = now;
	//Update the current rotation angle
	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	return newAngle%= 360;
}
