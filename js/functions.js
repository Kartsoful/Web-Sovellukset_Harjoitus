const links = document.querySelectorAll("aside a")
const counter_element = document.getElementById("click-count")

let clickCount = Number(localStorage.getItem("clickCount")) || 0

counter_element.textContent = clickCount;

links.forEach(link => {
    link.addEventListener("click", () => {
        clickCount++;
        counter_element.textContent = clickCount;

        // tallenna selaimeen
        localStorage.setItem("clickCount", clickCount);
    });
});