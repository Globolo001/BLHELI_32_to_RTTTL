
// Alpha in JavaScript

/** 
 * This program takes a BLHELI_32 music string and converts it to RTTTL for BlueJay ESC.
 * 
 * API: Call 'convert_unformatted_string_to_rtttl_with_prefixbuilder_return_invalid_symbols' with the optional parameter and an unformatted BL_HELI_32 string;
 * It returns the rtttl string and the invalid-symbols-strings-array (eg [32DJ, 1/]) as an array;
 * 
 * For using a custom prefix (not reccommended):
 * Call 'convert_unformatted_string_to_rtttl_return_invalid_symbols' with the unformatted BL_HELI_32 string;
 * 'convert_unformatted_string_to_rtttl' only returns the rtttl string without the invalid-symbols-strings;
 * 
 * Prefix systax: '${name}:d=8,o=5,b=${speed_int}'; (No colon ':').
 * To not use a prefix, call 'convert_unformatted_string_to_rtttl_stock_prefix' with an unformatted BL_HELI_32 string and no prefix;
 */

// ############################# Just some code #############################

const noteRegex = /^[CDEFGABP]#?\d{0,4}$/; // Example: C, C#, D3, G#5
const durationWholeRegex = /^(?:1|2|4|8|16|32|64|128)$/; // Example: 4, 8, 16, 32
const durationFractionRegex = /^\d\/(?:1|2|4|8|16|32|64|128)$/; // Example: 1/2, 3/16, 7/128
const noteWithDurationRegex = /^[CDEFGABP]\d\/(?:1|2|4|8|16|32|64|128)$/; // Example: C4/4, A#2/16, G3/8



const replacesymbolsRegex = /["'`\n]/g;
const removeRegex = /\s|\t|\n/g;

/**
 * Converts most BLHELI_32 notation to the correct format used by the script. Also removes spaces and tabs.
 * @param {String} inputString Any BLHELI_32 notation
 * @returns {String} Formatted BLHELI_32 notation
 */
function getIntoRightFormat(inputString) {
  const workingArray = inputString.replaceAll(replacesymbolsRegex, '').split(' ');
  const invalid_notes = [];
  const correctStringArray = [];

  for (const element of workingArray) {
    if (removeRegex.test(element) || element == '') {
      continue;
    } else if (noteRegex.test(element)) {
      // If it is a note: add it to the array
      correctStringArray.push(element);
    } else if (durationWholeRegex.test(element)) {
      // If it is a duration in format number (eg 4): add it to the last note
      correctStringArray[correctStringArray.length - 1] += element;
    } else if (durationFractionRegex.test(element)) {
      // If the duration is in format '1/X' (eg 1/4): add it to the last note
      correctStringArray[correctStringArray.length - 1] += element.substring(element.indexOf('/') + 1);
    } else if (noteWithDurationRegex.test(element)) {
      // Allowed notation with duration
      correctStringArray.push(element.substring(0,1) + element.substring(3,5));
    } else {
      invalid_notes.push(element);
    }
  }
  console.log(correctStringArray.join(' '))
  return [correctStringArray.join(' '), invalid_notes];
}

/**
 * A simple class for a note.
 */
class Note {
    /**
     * The constructor for a note.
     * @param {String} tune The tune of the note (eg. 'C#5')
     * @param {String} duration The duration of the note (eg. '4')
     */
    constructor(tune, duration) {
        this.tune = tune;
        this.duration = duration;
    }
    get_rtttl_string() {
        var rtttl = this.duration + this.tune.toLowerCase();
        return rtttl;
    }
}

/**
 * Split a note and duration into a Note object from a formatted String.
 * @param {String} noteString Formatted string of a single note with a duration (eg 'E#54')
 * @returns {Note} Note object;
 */
function splitIntoNoteObject(noteString) {
    if (noteString.includes('#')) {
        // Sharp note
        let position = noteString.indexOf('#');
        let note = noteString.substring(0, position + 2);
        let duration = noteString.substring(position + 2);
        return new Note(note, duration);
    } else if (noteString.includes('P')) {
        // Pause
        return new Note('p', noteString.substring(1));
    } else if (noteString.length >= 2) {
        // Regular note
        return new Note(noteString.substring(0, 2), noteString.substring(2));
    } else {
        return;
    }
}

/**
 * Go through each note in the String and return as list of notes as Note objects.
 * @param {String} source_Melody A formatted BLHELI_32 string
 * @returns {Array<Note>} Array of Note objects;
 */
function splitAllNotes(source_Melody) {
    const note_string = source_Melody.split(' ');
    return note_string.map(note => splitIntoNoteObject(note)).filter(note => note !== undefined);
}


/**
 * Converts an Arrray of Note objects to an rtttl string.
 * @param {Array<Note>} notes Array of Note objects
 * @returns {String} Rtttl String;
 */
function joinNotesToRtttl(notes) {
    return notes.map(note => note.get_rtttl_string()).join(',');
}


/**
 * Converts an unformatted BLHELI_32 string to rtttl string; Returns the rtttl string and the invalid symbols.
 * @param {String} prefix Prefix for the rtttl string without colon ':'
 * @param {String} unformatted_source_Melody Unformatted string of a melody in any BLHELI_32 notation
 * @returns {[String,Array<String>]} Compiled rtttl string and an array of invalid symbols;
 */
function convertBlheli32StringTotRtttlReturnInvalidSymbols(prefix, unformatted_source_Melody) {
    let right_format_with_warnings = getIntoRightFormat(unformatted_source_Melody);
    let formatted_string = right_format_with_warnings[0];
    let invalid_symbols = right_format_with_warnings[1];
    let notes = splitAllNotes(formatted_string);
    let resultMelody = joinNotesToRtttl(notes);
    // remove the '=' if there shall be an empty string return (no prefix) if there is no melody
    return resultMelody.length >= 0 ? [prefix + ':' + resultMelody, invalid_symbols] : ["", invalid_symbols];
}

/**
 * Converts an unformatted BLHELI_32 string to rtttl string. Builds the prefix from optional parameters or defaults.
 * @param {String} unformattedSourceMelody Unformatted string of a melody in any BLHELI_32 notation
 * @param {String} songName Name of the song for the header. Leave empty for default "test".
 * @param {String} speed Speed for the song. Leave empty for default "210".
 * @param {String} duration Duration for the song. Leave empty for default "8".
 * @param {String} octave Octave for the song. Leave empty for default "5".
 * @returns {[String,Array<String>]}  as array (final rtttl string, an array of invalid symbol-strings)
 */
export default function convertBlheli32ToRtttl(unformattedSourceMelody, songName = 'test', speed = 210, duration = 8, octave = 5) {
    // Set default values for song name, speed, duration, and octave
    songName = songName || 'test';
    speed = isNaN(speed) ? 210 : speed;
    duration = (Math.log2(duration) % 1 === 0) ? duration : 8; // Check if duration is a power of 2
    octave = isNaN(octave) ? 5 : octave;
  
    // Create prefix for RTTTL format
    let prefix = `${songName}:b=${speed},o=${octave},d=${duration}`;
    console.log(prefix);
    // Convert BLHELI_32 string to RTTTL format
    return convertBlheli32StringTotRtttlReturnInvalidSymbols(prefix, unformattedSourceMelody);
  }