import './style.css'

document.querySelector('#app').innerHTML = `
<nav class="navbar">
  <h1 class="app_name">
    <span>
      <img src="./public/assets/sensei's-board.png" alt="App Logo" class="logo"/>
    </span>
    Sensei's Board
  </h1>
</nav>
<div class="board-container">
  <div class="myCanvas_container">
    <canvas id="myCanvas" width="800" height="600">
      Sorry, your browser does not support canvas.
    </canvas>
  </div>
  <div class="canvas_controls">
    <h2>Controls</h2>
    <div class="fonts">
      <label>Fonts: </label>
      <select id="font_dropdown">
        <option value="select current font" disabled selected>Select current font</option>
        <option value="Italic">Italic</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Poppins">Poppins</option>
        <option value="Roboto">Roboto</option>
        <option value="Arial">Arial</option>
      </select>
    </div>
    <div class="sizes">
      <label>Font size: </label>
      <input type="number" id="font_size" min="10" max="100" value="50"/>
    </div>
    <div class="text">
      <label>Add Text:</label>
      <input type="text" id="text_input"/>
      <button id="add_text_btn">Add Text</button>
      <p id="error_message" style="display:none;">Font size exceeds the limit of 100.</p>
    </div>
    <div class="controls">
      <button id="undo_btn">Undo</button>
      <button id="redo_btn">Redo</button>
    </div>
  </div>
</div>
`

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let actions = [];
let undoStack = [];
let yOffset = 80; // Initial y-offset for text positioning

const addText = () => {
  const text = document.getElementById("text_input").value;
  const font = document.getElementById("font_dropdown").value;
  const fontSize = parseInt(document.getElementById("font_size").value);
  const errorMessage = document.getElementById("error_message");

  if (fontSize > 100) {
    errorMessage.style.display = "block";
    return;
  } else {
    errorMessage.style.display = "none";
  }

  if (text && font && fontSize) {
    const fontStr = `${fontSize}px ${font}`;
    ctx.font = fontStr;

    const x = 10; // Fixed x position
    const y = yOffset; // Incremental y position

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    actions.push({ type: "text", font: fontStr, text, x, y });
    undoStack = []; // Clear the undo stack whenever new text is added

    redrawCanvas();

    yOffset += fontSize + 10; // Update y-offset for next text
    document.getElementById("text_input").value = ''; // Clear input
  }
}

const undo = () => {
  if (actions.length > 0) {
    undoStack.push(actions.pop());
    redrawCanvas();
  }
}

const redo = () => {
  if (undoStack.length > 0) {
    actions.push(undoStack.pop());
    redrawCanvas();
  }
}

const redrawCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actions.forEach(action => {
    if (action.type === "text") {
      ctx.font = action.font;
      ctx.fillText(action.text, action.x, action.y);
    }
  });
}

document.getElementById("add_text_btn").addEventListener("click", addText);
document.getElementById("undo_btn").addEventListener("click", undo);
document.getElementById("redo_btn").addEventListener("click", redo);
