const auras = [
  { name: "Gray Aura", rarity: "common", chance: 50 },
  { name: "Blue Spark", rarity: "rare", chance: 25 },
  { name: "Purple Flame", rarity: "epic", chance: 15 },
  { name: "Golden Dragon", rarity: "legendary", chance: 8 },
  { name: "Heavenly Beam", rarity: "divine", chance: 2 },
];

let cooldown = false;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let playerName = localStorage.getItem("playerName") || "";
let isDev = false;

document.getElementById("playerName").value = playerName;
renderInventory();
renderLeaderboard();

function rollAura() {
  if (cooldown && !isDev) return;
  
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("Enter your name!");
  if (!isDev && inventory.length > 0 && name !== playerName) return alert("Name change not allowed after rolling.");

  localStorage.setItem("playerName", name);
  playerName = name;

  const roll = Math.random() * 100;
  let sum = 0;
  let resultAura;

  for (let aura of auras) {
    sum += aura.chance;
    if (roll <= sum) {
      resultAura = aura;
      break;
    }
  }

  if (!resultAura) resultAura = auras[0];

  inventory.push(resultAura);
  saveData();
  renderInventory();
  document.getElementById("result").innerHTML = `You rolled: <span class="${resultAura.rarity}">${resultAura.name}</span>`;

  playSound();

  if (!isDev) {
    cooldown = true;
    document.getElementById("rollBtn").disabled = true;
    document.getElementById("cooldownMsg").innerText = "Cooldown: 10s";
    let seconds = 10;
    let interval = setInterval(() => {
      seconds--;
      document.getElementById("cooldownMsg").innerText = `Cooldown: ${seconds}s`;
      if (seconds <= 0) {
        clearInterval(interval);
        cooldown = false;
        document.getElementById("rollBtn").disabled = false;
        document.getElementById("cooldownMsg").innerText = "";
      }
    }, 1000);
  }

  updateLeaderboard(name, inventory.length);
}

function renderInventory() {
  const list = document.getElementById("auraList");
  list.innerHTML = "";
  for (let aura of inventory) {
    let li = document.createElement("li");
    li.className = aura.rarity;
    li.textContent = aura.name;
    list.appendChild(li);
  }
}

function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function updateLeaderboard(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const existing = leaderboard.find(p => p.name === name);
  if (existing) existing.score = score;
  else leaderboard.push({ name, score });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    board.appendChild(li);
  });
}

function playSound() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
  audio.play();
}

// Developer mode (enter key: "letmein" in console)
window.enableDev = function(key) {
  if (key === "letmein") {
    isDev = true;
    document.getElementById("devPanel").style.display = "block";
    alert("Developer mode activated!");
  }
};

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
}

function grantAllAuras() {
  inventory = [...auras];
  saveData();
  renderInventory();
}
