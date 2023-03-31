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
        </div>
        <div class="form-group">
          <div class="form-row">
            <label for="songName${id}">Name:</label>
            <input type="text" id="songName${id}" name="songName" value="test">
          </div>
          <div class="form-row">
            <label for="speed${id}">Speed:</label>
            <input type="text" id="speed${id}" name="speed" value="420" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
          </div>
          <div class="form-row">
            <label for="duration${id}">Duration:</label>
            <input type="text" id="duration${id}" name="duration" value="8" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
          </div>
          <div class="form-row">
            <label for="octave${id}">Octave:</label>
            <input type="text" id="octave${id}" name="octave" value="5">
          </div>
        </div>
        <input type="submit" value="Convert">
      </form>
      <div id="result${id}">
        <div class="form-row">
          <label for="formattedMelody${id}">RTTL🎼</label>
          <textarea id="formattedMelody${id}" name="formattedMelody"></textarea>
          <button type="button" onclick="copyToClipboard('formattedMelody${id}')">📋</button>
        </div>
        <div class="form-row">
          <label for="invalidSymbols${id}">🗑</label>
          <textarea id="invalidSymbols${id}" name="invalidSymbols"></textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
    const form = document.getElementById(`melodyForm${id}`);
    form.addEventListener("submit", formListener);
  };
  
  
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};


  

for (let i = 1; i <= 4; i++) {
  createDiv(i);
}

copyToClipboard('fckaf.de/eis')
