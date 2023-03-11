//LookAtTriangles.js
//Author: Sasidharan Mahalingam
//Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  ' gl_Position = u_ViewMatrix * a_Position;\n' +
  ' v_Color = a_Color;\n' +
  '}\n';

//Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
	'varying vec4 v_Color;\n' +
  'void main()  {\n' +
  ' gl_FragColor = v_Color;\n' +
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
	return -1;
}

//Set the color for clearing the <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Get the storage location of u_ViewMatrix
var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
if (!u_ViewMatrix) { 
  console.log('Failed to get the storage locations of u_ViewMatrix');
  return;
}

// Set the eye point, look-at point and up direction
var viewMatrix = new Matrix4();

viewMatrix.setLookAt(0.25, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

//Clear canvas
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, n);

}


function initVertexBuffers(gl)
{
	var verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ]);
  var n = 9;


	//Create the buffer objects
	var vertexColorBuffer = gl.createBuffer();

	//check if the buffers were created properly
	if(!vertexColorBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}


	//Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

	//Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

	var FSIZE = verticesColors.BYTES_PER_ELEMENT;

	//Get storage location of the attribute variable
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
	  console.log('Failed to get the storage location of a_Position');
	  return -1;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);


	//Get the storage location of the attribute variable
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if(a_Color < 0) {
	  console.log('Failed to get the storage location of a_PointSize');
	  return -1;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Color);

	// Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return n;
}

