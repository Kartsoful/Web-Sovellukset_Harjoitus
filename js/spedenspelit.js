const buttons = document.querySelectorAll(".game button")
const directions = ["up", "down", "left", "right"];
const ctx = new AudioContext();
const frequencies = {
    up: 600,
    down: 300,
    left: 400,
    right: 800
};


let speed = 1000
let playerIndex = 0
let guesses = []
let gameIsActive = false
let intervalId = null;
let highscores = JSON.parse(localStorage.getItem("spedenScoret")) || []

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.dataset.dir;
        console.log("Pressed: ", action)

        if (action === "start") {
            if (!(gameIsActive)) {
                startGame()
            }
        } else if (action === "reset") {
            resetGame()
        } else {
            handleMovement(action)
        }
    })
})

document.addEventListener("keydown", (e) => {
    const keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    }

    const action = keyMap[e.key]

    if (!action) {
        return
    }

    e.preventDefault();

    handleMovement(action)
})


function startGame() {
    guesses = []
    playerIndex = 0;
    document.getElementById("score").innerHTML = playerIndex
    speed = 1000
    gameIsActive = true
    ctx.resume();
    startLoop()
}

function startLoop() {
    intervalId = setInterval(() => {
        const random = directions[Math.floor(Math.random() * directions.length)]
        guesses.push(random)

        highLight(random)
        playBeep(random)
        if (guesses.length % 1 === 0) {
            speed = Math.max(120, speed * 0.99)

            clearInterval(intervalId)
            startLoop();
        }
    }, speed)
    let speedHz = (1000 / speed).toFixed(2)
    document.getElementById("speed").innerHTML = `${speedHz} Hz`
}

function resetGame() {
    if (confirm('Are you sure?')) {
        highscores = []
        localStorage.setItem("spedenScoret", JSON.stringify(highscores))
        renderHighscores()
    }
}

function highLight(dir) {
    const btn = document.querySelector(`[data-dir="${dir}"]`)

    btn.style.background = "red"

    setTimeout(() => {
        btn.style.background = ""
    }, speed / 3)
}

function handleMovement(action) {
    if (!(gameIsActive)) {
        return
    }

    if (action === guesses[playerIndex]) {
        playerIndex++;
        document.getElementById("score").innerHTML = playerIndex
    } else {
        stopLoop()
        gameOver()
    }
}

function stopLoop() {
    clearInterval(intervalId);
    intervalId = null;
}

function gameOver() {
    gameIsActive = false
    saveScore()

}

function saveScore() {
    highscores.push(playerIndex)

    highscores.sort((a, b) => b - a)
    highscores = highscores.slice(0, 10);

    localStorage.setItem("spedenScoret", JSON.stringify(highscores))
    renderHighscores()
}

function renderHighscores() {
    const list = document.getElementById("highscores")
    list.innerHTML = ""

    highscores.forEach((score, index) => {
        const li = document.createElement("li")
        li.textContent = `${score}`
        list.appendChild(li)
    })
}

function playBeep(direction) {
    const freq = frequencies[direction];

    if (!freq) {
        return;
    }

    const osc = ctx.createOscillator()

    osc.type = "sine";
    osc.frequency.value = freq;

    osc.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
        osc.stop();
    }, 100);
}

renderHighscores()