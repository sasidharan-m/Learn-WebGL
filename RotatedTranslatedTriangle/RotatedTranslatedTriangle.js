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


//Define the rotation matrix
//Note: WebGL uses column major order
var modelMatrix = new Matrix4();

//Rotation angle
var ANGLE = 60;
//Translation value
var Tx = 0.5;

//Set the rotation matrix to modelMatrix
modelMatrix.setRotate(ANGLE, 0, 0, 1);
//Add the translation value to the modelMatrix
modelMatrix.translate(Tx, 0, 0); 

//Get storage location of the uniform variable
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if(!u_ModelMatrix) {
	console.log('Failed to get the storage location of u_ModelMatrix');
	return;
}


//Pass the matrix value from xformMatrix to u_xformMatrix
gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);


//Set the color for clearing the <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//Clear canvas
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, n);

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

