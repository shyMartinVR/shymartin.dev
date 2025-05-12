const controlling = document.querySelector("#controlling");
const main = document.querySelector("main");
const slider = document.querySelector("input");
const max = parseInt(slider.max);

let delay = max - parseInt(slider.value);

const queue = [];
let total = 0;

function enqueue(x, y) {
	const target = spawnTarget(x, y);
	queue.push([target, x, y]);

	if (queue.length === 1) {
		setTimeout(dequeue, 0);
	}
}

function dequeue() {
	const [target, x, y] = queue[0];
	controlling.style.left = `${x}px`;
	controlling.style.top = `${y}px`;

	for (let i = 0; i < queue.length; i++) {
		const [target] = queue[i];
		target.textContent = i + 1;
	}
	target.classList.add("target");

	setTimeout(() => {
		target.remove();
		queue.shift();
		if (queue.length > 0) dequeue();
	}, delay);
}

function spawnTarget(x, y) {
	const target = document.createElement("div");
	target.className = "goal ball";

	target.style.left = `${x}px`;
	target.style.top = `${y}px`;
	target.style.zIndex = total--;

	target.textContent = queue.length + 1;
	main.append(target);
	return target;
}

controlling.addEventListener("click", (event) => {
	event.stopPropagation();
	for (let i = 0; i < 100; i++) {
		const x = Math.floor(Math.random() * main.clientWidth);
		const y = Math.floor(Math.random() * main.clientHeight);
		enqueue(x, y);
	}
});

main.addEventListener("click", (event) => enqueue(event.offsetX, event.offsetY));

slider.addEventListener("change", (event) => {
	delay = max - parseInt(slider.value);
	document.documentElement.style.setProperty("--duration", `${delay}ms`);
});
