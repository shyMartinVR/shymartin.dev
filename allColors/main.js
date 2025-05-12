const button = document.querySelector("button");

button.addEventListener("click", (event) => {
	button.remove();
	const canvas = document.createElement("canvas");
	canvas.height = canvas.width = 4096;

	const progress = document.createElement("progress");
	progress.value = 0;
	progress.max = canvas.height;

	document.body.append(progress, canvas);
	const ctx = canvas.getContext("2d");

	let line = 0;

	function drawLine() {
		for (let i = 0; i < canvas.width; i++) {
			ctx.fillStyle = `#${(line * canvas.width + i)
				.toString(16)
				.padStart(6, "0")}`;
			ctx.fillRect(i % canvas.width, line, 1, 1);
		}
		if (line === canvas.height) {
			clearInterval(handle);
			progress.remove();
		}
		line++;
		progress.value = line;
	}

	const handle = setInterval(drawLine, 0);
});
