import convertBlheli32ToRtttl from "./main.js";

const formListener = (event) => {
    event.preventDefault();
    const formId = event.target.id;
    const formNumber = formId.charAt(formId.length - 1);
    const unformattedSourceMelody = document.getElementById(`unformattedSourceMelody${formNumber}`).value;
    const songName = document.getElementById(`songName${formNumber}`).value;
    const speed = document.getElementById(`speed${formNumber}`).value;
    const duration = document.getElementById(`duration${formNumber}`).value;
    const octave = document.getElementById(`octave${formNumber}`).value;
    const resultField = document.getElementById(`formattedMelody${formNumber}`);
    const invalidSymbolsField = document.getElementById(`invalidSymbols${formNumber}`);

    
    const [formattedMelody, invalidSymbols] = convertBlheli32ToRtttl(unformattedSourceMelody, songName, speed, duration, octave);
    
    const resultText = `Formatted melody: ${formattedMelody}\nInvalid symbols: ${invalidSymbols.join(', ')}`;
    
    resultField.value = formattedMelody;
    invalidSymbolsField.value = invalidSymbols.join(', ');
    
  };
  

  const createDiv = (id) => {
    const container = document.getElementById("container");
    const div = document.createElement("div");
    div.classList.add("grid-item");
    div.innerHTML = `
      <h1>ESC ${id}</h1>
      <form id="melodyForm${id}">
        <div class="form-row">
          <label for="unformattedSourceMelody${id}">BLHELI_32</label>
          <textarea id="unformattedSourceMelody${id}" name="unformattedSourceMelody"></textarea>
          <button type="button" onclick="copyToClipboard('unformattedSourceMelody${id}')">📋</button>
        </div>
        <div class="form-group">
          <div class="form-row">
            <label for="songName${id}">Name:</label>
            <input type="text" id="songName${id}" name="songName" value="test">
            <button type="button" onclick="copyToClipboard('songName${id}')">📋</button>
          </div>
          <div class="form-row">
            <label for="speed${id}">Speed:</label>
            <input type="text" id="speed${id}" name="speed" value="420" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            <button type="button" onclick="copyToClipboard('speed${id}')">📋</button>
          </div>
          <div class="form-row">
            <label for="duration${id}">Duration:</label>
            <input type="text" id="duration${id}" name="duration" value="8" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            <button type="button" onclick="copyToClipboard('duration${id}')">📋</button>
          </div>
          <div class="form-row">
            <label for="octave${id}">Octave:</label>
            <input type="text" id="octave${id}" name="octave" value="5">
            <button type="button" onclick="copyToClipboard('octave${id}')">📋</button>
          </div>
        </div>
        <input type="submit" value="Convert">
      </form>
      <div id="result${id}">
        <div class="form-row">
          <label for="formattedMelody${id}">RTTL🎼</label>
          <textarea id="formattedMelody${id}" name="formattedMelody" readonly></textarea>
          <button type="button" onclick="copyToClipboard('formattedMelody${id}')">📋</button>
        </div>
        <div class="form-row">
          <label for="invalidSymbols${id}">🗑</label>
          <input type="text" id="invalidSymbols${id}" name="invalidSymbols" readonly>
          <button type="button" onclick="copyToClipboard('invalidSymbols${id}')">📋</button>
        </div>
      </div>
    `;
    container.appendChild(div);
    const form = document.getElementById(`melodyForm${id}`);
    form.addEventListener("submit", formListener);
  };
  
  
  const copyToClipboard = (elementId) => {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand("copy");
  };

for (let i = 1; i <= 4; i++) {
  createDiv(i);
}
