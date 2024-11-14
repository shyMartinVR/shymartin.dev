import { NoteApi } from "./api.js";
const ul = document.querySelector("ul");
const nav = document.querySelector("nav");
const noteForm = document.querySelector("#noteForm");
const dialog = document.querySelector("dialog");
const dialogForm = document.querySelector("#dialogForm");
let apiUrl = localStorage.getItem("apiUrl");
let apiKey = localStorage.getItem("apiKey");
const notes = new Map();
const cats = new Set(["", "all"]);
let active = location.hash.substring(1);
history.replaceState(null, "", `${location.pathname}#${active}`);
cats.add(active);
let api;
loadApiData();
function loadApiData() {
    if (apiUrl && apiKey) {
        api = new NoteApi(apiUrl, apiKey);
        loadNotes();
    }
    else {
        dialog.showModal();
    }
}
async function loadNotes() {
    try {
        const result = await api.read();
        for (const note of result) {
            notes.set(note.id, note);
            cats.add(note.cat);
        }
        makeBoth();
    }
    catch (error) {
        dialog.showModal();
    }
}
dialog.addEventListener("close", async (event) => {
    apiUrl = dialogForm.elements.namedItem("apiUrl").value;
    apiKey = dialogForm.elements.namedItem("apiKey").value;
    localStorage.setItem("apiUrl", apiUrl);
    localStorage.setItem("apiKey", apiKey);
    loadApiData();
});
noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = noteForm.elements.namedItem("content");
    input.value = input.value.replace(/\s+/g, " ").trim();
    const content = input.value;
    const cat = active;
    const body = { content, cat };
    for (const child of noteForm.elements)
        child.disabled = true;
    const li = createEntry({ content });
    li.className = "pending";
    const button = li.children[1];
    button.disabled = true;
    try {
        li.className = "";
        button.disabled = false;
        noteForm.reset();
        const note = await api.create(body);
        li.dataset.id = note.id.toString();
        const id = note.id;
        notes.set(id, { id, content, cat });
    }
    catch (error) {
        console.error(error);
        li.className = "failed";
    }
    finally {
        for (const child of noteForm.elements)
            child.disabled = false;
        input.focus();
    }
});
function makeBoth() {
    makeCats();
    makeNotes();
}
function makeCats() {
    nav.replaceChildren();
    Array.from(cats)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .forEach(createCat);
}
function makeNotes() {
    ul.replaceChildren();
    const list = active === "all"
        ? notes
        : Array.from(notes.values()).filter((note) => note.cat === active);
    list.forEach(createEntry);
}
function createCat(name) {
    const a = document.createElement("a");
    a.href = `#${name}`;
    a.textContent = name === "" ? "misc" : name;
    if (name === active)
        a.className = "active";
    nav.append(a);
}
function createEntry(note) {
    const { content, id } = note;
    const li = document.createElement("li");
    li.dataset.id = id?.toString();
    const span = document.createElement("span");
    span.addEventListener("dblclick", editStart);
    span.textContent = content;
    const button = document.createElement("button");
    button.addEventListener("click", deleteNote);
    button.textContent = "❌";
    li.append(span, button);
    ul.append(li);
    return li;
}
// event handlers
window.addEventListener("hashchange", (event) => {
    active = location.hash.substring(1);
    cats.add(active);
    makeBoth();
});
async function deleteNote(event) {
    const li = this.parentElement;
    li.className = "pending";
    this.disabled = true;
    try {
        const id = parseInt(li.dataset.id);
        await api.delete(id);
        li.remove();
        showUndo(notes.get(id).content);
        notes.delete(id);
    }
    catch (error) {
        console.error(error);
        li.className = "failed";
    }
    finally {
        this.disabled = false;
    }
}
function showUndo(content) {
    const button = document.createElement("button");
    const timeout = setTimeout(() => button.remove(), 10000);
    button.textContent = content;
    button.addEventListener("click", (event) => {
        clearTimeout(timeout);
        const input = noteForm.elements.namedItem("content");
        const current = input.value;
        if (current === "")
            button.remove();
        else
            button.textContent = current;
        input.value = button.textContent;
        // form.submit()
        // simulating submit click, because form.submit doesn't fire submit event
        const submit = noteForm.querySelector("[type=submit]");
        submit.click();
    });
    document.body.append(button);
}
let controller;
function editStart(event) {
    event.preventDefault();
    const li = this.parentElement;
    if (["editing", "pending"].includes(li.className))
        return;
    li.className = "editing";
    try {
        this.contentEditable = "plaintext-only";
    }
    catch (error) {
        this.contentEditable = "true";
    }
    this.focus();
    controller = new AbortController();
    const signal = controller.signal;
    this.addEventListener("blur", editEnd, { signal });
    this.addEventListener("keydown", onKeyDown, { signal });
}
async function editEnd(event) {
    controller.abort();
    this.contentEditable = "false";
    const li = this.parentElement;
    li.className = "pending";
    const content = this.textContent.replace(/\s+/g, " ").trim() ?? "";
    this.textContent = content;
    try {
        const id = parseInt(li.dataset.id);
        await api.update({ id, content });
        li.className = "";
        notes.get(id).content = content;
    }
    catch (error) {
        console.error(error);
        li.className = "failed";
    }
}
function onKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        this.blur();
    }
}
//# sourceMappingURL=main.js.map