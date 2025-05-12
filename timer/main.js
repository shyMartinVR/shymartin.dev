const body = document.body;
const h1 = document.querySelector("h1");
const start = Date.now();
const button = document.querySelector("button");

let notifAllowed = false;

const units = [86400, 3600, 60, 1];

setInterval(() => {
	let passed = Math.floor((Date.now() - start) / 1000);
	let colorString;
	if (passed < 255) colorString = `rgb(${passed},255,0)`;
	else if (passed < 511) colorString = `rgb(255,${510 - passed},0)`;
	if (colorString) body.style.backgroundColor = colorString;

	if (passed > 600 && notifAllowed) {
		notifAllowed = false;
		const notif = new Notification("Times' up!");
	}

	let output = "";
	let prevUnit = "";
	for (const unit of units) {
		const result = Math.floor(passed / unit);
		if (result > 0 || prevUnit !== "") {
			if (prevUnit === "") {
				prevUnit = result;
			} else {
				prevUnit = `:${result.toString().padStart(2, "0")}`;
			}
		} else {
			prevUnit = "";
		}
		output += prevUnit;
		passed %= unit;
	}
	h1.textContent = output;
}, 1000);

button.addEventListener("click", async (event) => {
	if (!notifAllowed) {
		const permission = await Notification.requestPermission();
		setButton(permission);
	} else setButton("default");
});

function setButton(permission) {
	if (permission === "granted") {
		notifAllowed = true;
		button.textContent = "🔔 on";
	} else {
		notifAllowed = false;
		button.textContent = "🔔 off";
	}
}

setButton(Notification.permission);
