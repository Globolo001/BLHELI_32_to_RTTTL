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

const acceptedNotationRegex = new RegExp('^[CDEFGABP]#?[0-9]{0,4}$|^[0-9][/\\/][0-9]{1,2}$|^[0-9]$');
const replacesymbolsRegex = new RegExp("\"|\'\`|\n", 'g');
const removeRegex = new RegExp("\s|\t|\n", 'g');

/**
 * Converts most BLHELI_32 notation to the correct format used by the script. Also removes spaces and tabs.
 * @param {String} inputString Any BLHELI_32 notation
 * @returns {String} Formatted BLHELI_32 notation
 */
function getIntoRightFormat(inputString) {
    inputString = inputString.replaceAll(replacesymbolsRegex, '');
    let workingArray = inputString.split(' ');

    let invalid_notes = [];

    // Filter for only valid symbols
    let betterArray = workingArray.filter(function (element) {
        if (removeRegex.test(element) || element == '') {
            return false;
        } else if (acceptedNotationRegex.test(element)) {
            return true;
        } else {
            invalid_notes.push(element);
            return false;
        }
    });

    // Bring into correct notation: eg 'E#5 1/4' -> 'E#54'
    let correctStringArray = [];
    correctStringArray.push(betterArray[0]); //Always add the first element
    betterArray.shift(); //Remove the first element

    betterArray.forEach(function (element) {
        if (!isNaN(element)) {
            // If it is a duration in format 'X' (eg 4): add it to the last note
            correctStringArray[correctStringArray.length - 1] += element;
        } else if (element.includes('/')) {
            // If the duration is in format '1/X' (eg 1/4): add it to the last note
            correctStringArray[correctStringArray.length - 1] += element.substring(element.indexOf('/') + 1);
        } else {
            correctStringArray.push(element);
        }
    });
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
    let note_string = source_Melody.split(' ');
    let notes = [];
    note_string.forEach(function (note) {
        note = splitIntoNoteObject(note)
        if (note != undefined) {
            notes.push(note);
        }
    });
    return notes;
}

/**
 * Converts an Arrray of Note objects to an rtttl string.
 * @param {Array<Note>} notes Array of Note objects
 * @returns {String} Rtttl String;
 */
function joinNotesToRtttl(notes) {
    let result_list = notes.map(function (note) {
        return note.get_rtttl_string();
    });
    return result_list.join(',');
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
function convertBlheli32ToRtttl(unformattedSourceMelody, songName = 'test',speed = 210, duration = 8, octave = 5)  {
    songName = songName.length > 0 ? songName : 'test';
    speed = isNaN(speed) ? 210 : speed;
    if (isNaN(duration)) {
        duration = 8;
    }else {
        let n = parseInt(duration);
        duration = (n && (n & (n - 1)) === 0) ? duration : 8;
    }
    octave = isNaN(octave) ? 5 : octave;

    let prefix = `${songName}:b=${speed},o=${octave},d=${duration}`;
    return convertBlheli32StringTotRtttlReturnInvalidSymbols(prefix, unformattedSourceMelody);
}
// ############################# Node.js #############################

export default convertBlheli32ToRtttl;

// ############################# Testing Ground #############################
var testingActive = false;
if(testingActive) {
    const song1 = "B5 4 P8 B5 4 P8 A5 2 P4 D5 8 E5 8 G5 8 D5 8 A5 4 P8 A5 4 P8 G5 4 G5 8 F#5 8 E5 4 D5 8 E5 8 G5 8 E5 8 G5 2 A5 4 F#5 4 F#5 8 E5 8 D5 4 D5 8 P 8 D5 8 P8 A5 4 A5 8 P8 G5 2"
    const song2 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
    const song3 = "E6 1/4  D6 1/4  F#5 1/2  G#5 1/2    C#6 1/4    B5 1/4    D5 1/2     E5 1/2  B5 1/4  A5 1/4  C#5 1/2 E5 1/2 A5 1/1 "
    const song4 = "E64 D64 F#52 G#52 C#64 B54 D52 E52 B54 A54 C#52 E52 A51"
    const song5_broken = "D5 8 E5 8 G3 2 F#5 1/ J#6 1/4 B5 14 " // partially passing notes
    const song6_broken = "1/ /4 H not a## note" //no passing notes

    console.log(convertBlheli32ToRtttl(song1, 'teest1', 280, 6, 2)[0]);
    console.log(convertBlheli32ToRtttl(song2, 'teeest2', 260)[0]);
    console.log(convertBlheli32ToRtttl(song3)[0]);
    console.log(convertBlheli32ToRtttl(song4, 'teeeeeeest4', 420,'A')[0]);
    console.log(convertBlheli32ToRtttl(song5_broken, 'teeeeest5', 210,8,'C')[0]);
    console.log(convertBlheli32ToRtttl(song6_broken, 'teeeeest6'));
}