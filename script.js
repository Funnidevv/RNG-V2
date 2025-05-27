const auras = [
  { name: "Stone Dust", rarity: "common", weight: 50, value: 1 },
  { name: "Green Glow", rarity: "uncommon", weight: 25, value: 3 },
  { name: "Blue Spark", rarity: "rare", weight: 10, value: 7 },
  { name: "Amethyst Wisp", rarity: "epic", weight: 5, value: 12 },
  { name: "Flame Phoenix", rarity: "legendary", weight: 3, value: 20 },
  { name: "Crimson Star", rarity: "mythic", weight: 2, value: 30 },
  { name: "Golden Dragon", rarity: "divine", weight: 1.5, value: 45 },
  { name: "Abyss Rift", rarity: "exotic", weight: 1, value: 60 },
  { name: "Celestial Echo", rarity: "godly", weight: 0.5, value: 80 },
  { name: "Ethereal Wave", rarity: "ethereal", weight: 0.2, value: 120 },
  { name: "Void Sparkle", rarity: "transcendent", weight: 0.1, value: 200 },
  { name: "Infinity Core", rarity: "infinity", weight: 0.05, value: 500 }
];

let cooldown = false;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let auraCurrency = parseInt(localStorage.getItem("auraCurrency")) || 0;
let playerName = localStorage.getItem("playerName") || "";
let isDev = false;

document.getElementById("playerName").value = playerName;
renderInventory();
renderCurrency();

function rollAura() {
  if (cooldown && !isDev) return;

  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("Enter your name.");
  if (!playerName) {
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
  const shop = document.getElementById("shopList");
  list.innerHTML = "";
  shop.innerHTML = "";

  inventory.forEach((aura, index) => {
    const li = document.createElement("li");
    li.className = aura.rarity;
    li.textContent = aura.name;
    list.appendChild(li);

    const sellLi = document.createElement("li");
    sellLi.innerHTML = `<span class="${aura.rarity}">${aura.name}</span> - ${aura.value} Aura 
      <button onclick="sellAura(${index})">Sell</button>`;
    shop.appendChild(sellLi);
  });
}

function sellAura(index) {
  const sold = inventory.splice(index, 1)[0];
  auraCurrency += sold.value;
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("auraCurrency", auraCurrency);
  renderInventory();
  renderCurrency();
}

function renderCurrency() {
  document.getElementById("auraCurrency").textContent = auraCurrency;
}

function playSound() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
  audio.play();
}

function promptDevCode() {
  const code = prompt("Enter developer code:");
  if (code === "SSGDA") {
    isDev = true;
    document.getElementById("devPanel").style.display = "block";
    alert("Developer mode activated.");
  }
}

function grantAllAuras() {
  inventory = [...auras];
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
}

function addCurrency(amount) {
  auraCurrency += amount;
  localStorage.setItem("auraCurrency", auraCurrency);
  renderCurrency();
}
