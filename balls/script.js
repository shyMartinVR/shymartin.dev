const root = document.querySelector("main");
root.addEventListener("mouseenter", addChildren, { once: true });

root.addEventListener("click", () => root.classList.toggle("ball"));
root.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	root.classList.toggle("scaled");
});

/** @param {MouseEvent} event  */
function addChildren(event) {
	const element = event.target;
	for (let i = 0; i < 4; i++) {
		const child = document.createElement("grid");
		child.style.backgroundColor = `hsl(${Math.random() * 360} 100% 50%)`;
		element.append(child);
		child.addEventListener("mouseenter", addChildren, { once: true });
	}
}
