const coins = [
	1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
];
const buttonDiv = document.querySelector("#buttons");
const outputDiv = document.querySelector("#output");
const totalSpan = document.querySelector("#total");

let total = 0;

function addTotal(value) {
	total += value;
	const euro = Math.floor(total / 100);
	const cent = total % 100;
	totalSpan.textContent = `${euro},${cent.toString().padStart(2, 0)}€`;
}

for (const coin of coins) {
	const buttonImg = document.createElement("img");
	buttonImg.src = `img/${coin}.png`;
	buttonImg.alt = coin;
	buttonImg.addEventListener("click", (event) => {
		const outputImg = document.createElement("img");
		outputImg.src = `img/${coin}.png`;
		outputImg.alt = coin;
		outputImg.addEventListener("click", (event) => {
			outputImg.remove();
			addTotal(-coin);
		});
		outputDiv.append(outputImg);
		addTotal(coin);
	});
	buttonDiv.append(buttonImg);
}
