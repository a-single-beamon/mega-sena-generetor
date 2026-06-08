/* ── Mega-Sena Number Generator ── */

async function sendToSheets(data) {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbyo0uTULNfSbX51b8ALYC0TwUKvOf6bg2KbGkqkrexoWY2Lfmz2kMbXqd79Yu3GFxG9/exec";

  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("Data sent successfully");
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

function generateNumbers() {
  const nums = new Set();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 60) + 1);
  }
  return [...nums].sort((a, b) => a - b);
}

function renderNumbers(nums) {
  document.getElementById('numbersGrid').innerHTML = nums
    .map(n => `
      <div class="num-ball">
        <div class="ball">${String(n).padStart(2, '0')}</div>
      </div>
    `)
    .join('');
}

// ── Track current state ──────────────────────────────
let currentNumbers = [];
let currentName = '';
// ────────────────────────────────────────────────────

function showScreen2(name) {
  currentName = name;                      // save name
  currentNumbers = generateNumbers();      // save numbers
  document.getElementById('displayName').textContent = name.toUpperCase();
  renderNumbers(currentNumbers);
  document.getElementById('screen1').classList.add('hidden');
  document.getElementById('screen2').classList.remove('hidden');
  document.getElementById('finalMsg').classList.add('hidden');
}

function showScreen1() {
  document.getElementById('nameInput').value = '';
  document.getElementById('screen2').classList.add('hidden');
  document.getElementById('screen1').classList.remove('hidden');
}

/* Event listeners */
document.getElementById('goBtn').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value.trim();
  if (name) showScreen2(name);
});

document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const name = document.getElementById('nameInput').value.trim();
    if (name) showScreen2(name);
  }
});

document.getElementById('regenBtn').addEventListener('click', () => {
  currentNumbers = generateNumbers();      // update saved numbers on regen
  renderNumbers(currentNumbers);
  console.log("click");
});

document.getElementById('changeName').addEventListener('click', showScreen1);

document.getElementById('sendBtn').addEventListener('click', () => {
  document.getElementById('mssg').textContent = "Boa sorte,";
  document.getElementById('finalMsg').classList.remove('hidden');
  document.getElementById('displayName').textContent = document.getElementById('displayName').textContent + "!";

  document.getElementById('buttons').classList.add('hidden');
  document.getElementById('sendBtn').classList.add('hidden');

  const data = {
    name: currentName.toUpperCase(),
    numbers: currentNumbers,
  }
  // Send actual name and numbers to sheets
  sendToSheets(data);
});