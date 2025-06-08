// define buttons to access
let toolBtns = document.querySelectorAll(".tool-btn");
let advToolBtns = document.querySelectorAll(".adv-tool-btn");

// add event listeners
toolBtns.forEach((b) => {
    b.addEventListener("click", () => {
        document.execCommand(b.id, false, null);
    });
});

// define adv buttons that need value argument
advToolBtns.forEach((b) => {
    b.addEventListener("click", () => {
        document.execCommand(b.classList.item(1), false, b.id);
    });
});