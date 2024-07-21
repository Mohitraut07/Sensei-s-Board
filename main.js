import './style.css'

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
