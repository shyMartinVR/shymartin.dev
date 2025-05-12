const popUrl = "https://b.catgirlsare.sexy/cmx0XVUfUzC5.wav";

for (let x = 0; x < 952; x++) {
  const bubble = document.createElement("div");
  bubble.addEventListener("mousedown", onClick, { once: true });
  bubble.addEventListener("mouseenter", onEnter);
  document.body.append(bubble);
}

/**
 * @this {HTMLDivElement}
 * @param {MouseEvent} event
 */
function onClick(event) {
  this.className = "popped";
  new Audio(popUrl).play();
}

/**
 * @this {HTMLDivElement}
 * @param {MouseEvent} event
 */
function onEnter(event) {
  if (event.buttons === 1) {
    this.className = "popped";
    new Audio(popUrl).play();
  }
}
