//HelloTriangle_FragCoord.js
//Author: Sasidharan Mahalingam
//Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position;\n' +
  '}\n';

//Fragment shader program
var FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform float u_Width;\n' +
	'uniform float u_Height;\n' +
  'void main()  {\n' +
  ' gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
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

//Set positions of vertices
var n = initVertexBuffers(gl);
if(n < 0) {
	console.log('Failed to set the positions of the vertices');
	return;
}

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

	var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
	if(!u_Width) {
		console.log('Failed to get the storage location of u_Width');
		return;
	}

	var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
	if(!u_Height) {
		console.log('Failed to get the storage location of u_Height');
		return;
	}

	//Pass the width and height of the <canvas> element
	gl.uniform1f(u_Width, gl.drawingBufferWidth);
	gl.uniform1f(u_Height, gl.drawingBufferHeight);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	//Unbind the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return n;
}

