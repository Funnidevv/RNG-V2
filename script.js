const auras = [
  { name: "Stone Dust", rarity: "common", weight: 50, value: 1 },
  { name: "Green Glow", rarity: "uncommon", weight: 25, value: 3 },
  { name: "Blue Spark", rarity: "rare", weight: 10, value: 7 },
  { name: "Amethyst Wisp", rarity: "epic", weight: 5, value: 12 },
  { name: "Flame Phoenix", rarity: "legendary", weight: 2, value: 25 },
  { name: "Infinity Core", rarity: "infinity", weight: 0.1, value: 100 }
];

let cooldown = false;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let auraCurrency = parseInt(localStorage.getItem("auraCurrency")) || 0;
let totalEarned = parseInt(localStorage.getItem("totalEarned")) || 0;
let totalSpent = parseInt(localStorage.getItem("totalSpent")) || 0;
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
    return alert("You can't change names after locking in.");
  }

  const aura = getWeightedRandomAura();
  inventory.push(aura);
  localStorage.setItem("inventory", JSON.stringify(inventory));

  document.getElementById("result").innerHTML =
    `You rolled: <span class="${aura.rarity}">${aura.name}</span>`;
  renderInventory();
  playSound("roll");

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
    li.setAttribute("data-tooltip", `${aura.name} - ${aura.rarity.toUpperCase()} - 🌀 ${aura.value}`);
    li.textContent = aura.name;
    list.appendChild(li);

    const sellLi = document.createElement("li");
    sellLi.innerHTML = `<span class="${aura.rarity}" data-tooltip="${aura.name} - ${aura.rarity.toUpperCase()}"> ${aura.name}</span> - ${aura.value} 
      <button onclick="sellAura(${index})">Sell</button>`;
    shop.appendChild(sellLi);
  });
}

function sellAura(index) {
  const sold = inventory.splice(index, 1)[0];
  auraCurrency += sold.value;
  totalEarned += sold.value;
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("auraCurrency", auraCurrency);
  localStorage.setItem("totalEarned", totalEarned);
  renderInventory();
  renderCurrency();
  playSound("sell");
}

function renderCurrency() {
  document.getElementById("auraCurrency").textContent = auraCurrency;
  document.getElementById("totalEarned").textContent = totalEarned;
  document.getElementById("totalSpent").textContent = totalSpent;
}

function playSound(type) {
  let url = type === "sell"
    ? "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
    : "https://actions.google.com/sounds/v1/cartoon/pop.ogg";
  new Audio(url).play();
}

function promptDevCode() {
  const code = prompt("Enter developer code:");
  if (code === "SSGDA") {
    isDev = true;
    document.getElementById("devPanel").style.display = "block";
    alert("Developer mode activated.");
    logDev("Developer mode unlocked.");
  }
}

function grantAllAuras() {
  inventory = [...auras];
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
  logDev("All auras granted.");
}

function addCurrency(amount) {
  auraCurrency += amount;
  totalEarned += amount;
  localStorage.setItem("auraCurrency", auraCurrency);
  localStorage.setItem("totalEarned", totalEarned);
  renderCurrency();
  logDev(`Added ${amount} Aura.`);
}

function clearInventory() {
  inventory = [];
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
  logDev("Inventory cleared.");
}

function logDev(msg) {
  const log = document.getElementById("devLog");
  log.innerHTML += `> ${msg}<br>`;
  log.scrollTop = log.scrollHeight;
}
