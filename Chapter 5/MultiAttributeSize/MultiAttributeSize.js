//MultiAttributeSize.js
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

gl.drawArrays(gl.POINTS, 0, n);

}


function initVertexBuffers(gl)
{
	var vertices = new Float32Array([
		0.0, 0.5,	-0.5,-0.5,	0.5,-0.5
	]);

	var sizes = new Float32Array([
		10, 20, 30
	])
	var n = 3;
	//Create the buffer objects
	var vertexBuffer = gl.createBuffer();
	var sizeBuffer = gl.createBuffer();

	//check if the buffers were created properly
	if(!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	if(!sizeBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	//Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	//Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	//Get storage location of the attribute variable
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
	  console.log('Failed to get the storage location of a_Position');
	  return;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);


	//Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);

	//Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

	//Get the storage location of the attribute variable
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	if(a_PointSize < 0) {
	  console.log('Failed to get the storage location of a_PointSize');
	  return;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_PointSize);


	return n;
}

