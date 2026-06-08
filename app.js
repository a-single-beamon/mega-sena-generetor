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

// Track numbers
let currentNumbers = [];
let currentName = '';

function showScreen2(name, numbers, alreadySent = false) {
  currentName = name;                      // save name
  currentNumbers = numbers;      // save numbers
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

function showScreenFinal() {
  document.getElementById('mssg').textContent = "Boa sorte,";
  document.getElementById('finalMsg').classList.remove('hidden');
  document.getElementById('displayName').textContent = document.getElementById('displayName').textContent + "!";

  document.getElementById('buttons').classList.add('hidden');
  document.getElementById('sendBtn').classList.add('hidden');
}

// Check if already answered
const saved = localStorage.getItem('megaSenaSent');
if (saved) {
  const { name, numbers } = JSON.parse(saved);
  showScreen2(name, numbers, true);  // restore locked screen
  showScreenFinal();
}

/* Event listeners */
document.getElementById('goBtn').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value.trim();
  if (name) showScreen2(name, generateNumbers());
});

document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const name = document.getElementById('nameInput').value.trim();
    if (name) showScreen2(name, generateNumbers());
  }
});

document.getElementById('regenBtn').addEventListener('click', () => {
  currentNumbers = generateNumbers();      // update saved numbers on regen
  renderNumbers(currentNumbers);
});

document.getElementById('changeName').addEventListener('click', showScreen1);

document.getElementById('sendBtn').addEventListener('click', () => {
  showScreenFinal();

  const data = {
    name: currentName.toUpperCase(),
    numbers: currentNumbers,
  }

  // Save to localStorage so reload restores the locked screen
  localStorage.setItem('megaSenaSent', JSON.stringify(data));
  
  // Send actual name and numbers to sheets
  sendToSheets(data);
});