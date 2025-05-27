const auras = [
  { name: "Stone Dust", rarity: "common", weight: 50 },
  { name: "Green Glow", rarity: "uncommon", weight: 25 },
  { name: "Blue Spark", rarity: "rare", weight: 10 },
  { name: "Amethyst Wisp", rarity: "epic", weight: 5 },
  { name: "Flame Phoenix", rarity: "legendary", weight: 3 },
  { name: "Crimson Star", rarity: "mythic", weight: 2 },
  { name: "Golden Dragon", rarity: "divine", weight: 1.5 },
  { name: "Abyss Rift", rarity: "exotic", weight: 1 },
  { name: "Celestial Echo", rarity: "godly", weight: 0.5 },
  { name: "Ethereal Wave", rarity: "ethereal", weight: 0.2 },
  { name: "Void Sparkle", rarity: "transcendent", weight: 0.1 },
  { name: "Infinity Core", rarity: "infinity", weight: 0.05 },
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
  if (!name) return alert("Enter your name.");
  if (!playerName) {
    const usedNames = JSON.parse(localStorage.getItem("usedNames")) || [];
    if (usedNames.includes(name)) return alert("This name is taken.");
    usedNames.push(name);
    localStorage.setItem("usedNames", JSON.stringify(usedNames));
    localStorage.setItem("playerName", name);
    playerName = name;
  } else if (name !== playerName && !isDev) {
    return alert("You cannot change names after playing.");
  }

  const aura = getWeightedRandomAura();
  inventory.push(aura);
  localStorage.setItem("inventory", JSON.stringify(inventory));

  document.getElementById("result").innerHTML =
    `You rolled: <span class="${aura.rarity}">${aura.name}</span>`;
  renderInventory();
  updateLeaderboard(playerName, inventory.length);
  playSound();

  if (!isDev) {
    cooldown = true;
    document.getElementById("rollBtn").disabled = true;
    document.getElementById("cooldownMsg").innerText = "Cooldown: 1s";
    setTimeout(() => {
      cooldown = false;
      document.getElementById("rollBtn").disabled = false;
      document.getElementById("cooldownMsg").innerText = "";
    }, 1000);
  }
}

function getWeightedRandomAura() {
  const total = auras.reduce((sum, a) => sum + a.weight, 0);
  let r = Math.random() * total;
  for (let aura of auras) {
    if (r < aura.weight) return aura;
    r -= aura.weight;
  }
  return auras[0];
}

function renderInventory() {
  const list = document.getElementById("auraList");
  list.innerHTML = "";
  inventory.forEach(aura => {
    const li = document.createElement("li");
    li.className = aura.rarity;
    li.textContent = aura.name;
    list.appendChild(li);
  });
}

function updateLeaderboard(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const player = leaderboard.find(p => p.name === name);
  if (player) player.score = score;
  else leaderboard.push({ name, score });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name}: ${p.score}`;
    list.appendChild(li);
  });
}

function playSound() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
  audio.play();
}

window.enableDev = function (key) {
  if (key === "letmein") {
    isDev = true;
    document.getElementById("devPanel").style.display = "block";
    alert("Developer Mode Activated");
  }
};

function grantAllAuras() {
  inventory = [...auras];
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
}

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
}
