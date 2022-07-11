// Alpha in JavaScript

// This program takes a BLHELI_32 music string and converts it to RTTTL for BlueJay ESC

/** 
 * API: Call 'convert_unformatted_string_to_rttl' with a prefix and an unformatted BL_HELI_32 string;
 * Prefix systax: '${name}:d=8,o=5,b=${speed_int}:'
 * Or call convert_unformatted_string_to_rttl_stock_prefx with an unformatted BL_HELI_32 string;
 */

// ############################# Just some code #############################

const accepted_notation_regex = new RegExp('^[CDEFGABP]#?[0-9]{0,4}$|^[0-9][/\\/][0-9]{1,2}$|^[0-9]$');
const replacesymbols_regex = new RegExp("\"|\'", 'g');
const remove_regex = new RegExp("\s|\t|\n", 'g');
const stock_rtttl_prefix = 'test:d=8,o=5,b=210';

//For BLHELI_32 notation with wrong formatting. It converts to 'G// 34'  wihout spaces between duration && tune (like 'G// 3 4' || 'G// 3 1/4)';
/**
 * Converts most BLHELI_32 notation to the correct format used by the script. Also removes spaces and tabs.
 * @param {String} input_string Any BLHELI_32 notation
 * @returns {String} Formatted BLHELI_32 notation
 */
function get_into_right_format(input_string) {
    input_string = input_string.replaceAll(replacesymbols_regex, '');
    working_array = input_string.split(' ');
    
    // Filter for only valid symbols
    better_array = working_array.filter(function(element) {
        if(remove_regex.test(element) || element == '') {
            return false;
        }else if (accepted_notation_regex.test(element)) {
            return true;
        } else {
            console.log('ERROR: Invalid note: ' + element);
            return false;
        }
    });

    // Bring into correct notation: eg 'E#5 1/4" -> E#54
    correct_string_array = [];
    correct_string_array.push(better_array[0]); //Always add the first element
    better_array.shift(); //Remove the first element

    better_array.forEach(function(element) {
        if (!isNaN(element)) {
            // If it is a duration in format 'X' (eg 4): add it to the last note
            correct_string_array[correct_string_array.length - 1] += element;
        } else if (element.includes('/')) {
            // If the duration is in format '1/X' (eg 1/4): add it to the last note
            correct_string_array[correct_string_array.length - 1] += element.substring(element.indexOf('/') + 1);
        } else {
            correct_string_array.push(element);
        }
    });
    return correct_string_array.join(' ');
}

/**
 * A simple class for a note.
 */
class Note {
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
 * Split a note and duration into a Note object from a formatted String
 * @param {String} note_string Formatted string of a single note with a duration (eg 'E#54')
 * @returns {Note} Note object;
 */
function split_into_note_object(note_string) {
    if (note_string.includes('#')) {
        // Sharp note
        position = note_string.indexOf('#');
        note = note_string.substring(0, position+2);
        duration = note_string.substring(position+2);
        return new Note(note, duration);
    } else if (note_string.includes('P')) {
        // Pause
        return new Note('p', note_string.substring(1));
    } else if (note_string.length >= 2) {
        // Regular note
        return new Note(note_string.substring(0,2), note_string.substring(2));
    } else {
        return;
    }

}
/**
 * Go through each note in the String and return as list of notes as Note objects;
 * @param {String} source_Melody
 * @returns {Array<Note>} Array of Note objects;
 */
function split_all_notes(source_Melody) {
    note_string = source_Melody.split(' ');
    notes = [];
    note_string.forEach(function(note) {
        note = split_into_note_object(note)
        if (note != undefined) {
            notes.push(note);
        }
    });
    return notes;
    
}

/**
 * Converts an Arrray of Note objects to an rtttl string;
 * @param {Array<Note>} notes 
 * @returns {String} Rtttl String;
 */
function compile_notes_to_rtttl(notes) {
    result_list =  notes.map(function(note) {
        return note.get_rtttl_string();
    });
    return result_list.join(',');
}

/**
 * Converts a unformatted BLHELI_32 string to rtttl string;
 * @param {String} prefix Prefix for the rtttl string without colon ':'
 * @param {String} unformatted_source_Melody Unformatted string of a melody in any BLHELI_32 notation
 * @returns {String} Compiled rtttl string;
 */
function convert_unformatted_string_to_rttl(prefix,unformatted_source_Melody) {
    notes = split_all_notes(get_into_right_format(unformatted_source_Melody));
    return prefix + ':' + compile_notes_to_rtttl(notes);
}

/**
 * Converts a unformatted BLHELI_32 string with the stock prefix to rtttl string;
 * @param {String} nformatted_source_Melody Unformatted string of a melody in any BLHELI_32 notation
 * @returns {String} Compiled rtttl string;
 */
function convert_unformatted_string_to_rttl_stock_prefx(unformatted_source_Melody) {
    convert_unformatted_string_to_rttl(stock_rtttl_prefix, unformatted_source_Melody);
}

/**
 * Inserts a number before the colon in a rtttl string for counting the ESCs
 * @param {String} prefix Prefix for the rtttl string without colon ':'
 * @param {String} number_to_insert Number to insert before colon 
 * @returns {String} rtttl string with number inserted;
 */
function insert_number(prefix, number_to_insert) {
    return prefix.substring(0, prefix.indexOf(':')) + number_to_insert + prefix.substring(prefix.indexOf(':'));
}



// ############################# Testing Ground #############################

/* song1 = "B5 4 P8 B5 4 P8 A5 2 P4 D5 8 E5 8 G5 8 D5 8 A5 4 P8 A5 4 P8 G5 4 G5 8 F#5 8 E5 4 D5 8 E5 8 G5 8 E5 8 G5 2 A5 4 F#5 4 F#5 8 E5 8 D5 4 D5 8 P 8 D5 8 P8 A5 4 A5 8 P8 G5 2"
song2 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
song3 = "E6 1/4  D6 1/4  F#5 1/2  G#5 1/2    C#6 1/4    B5 1/4    D5 1/2     E5 1/2  B5 1/4  A5 1/4  C#5 1/2 E5 1/2 A5 1/1 "
song4 = "E64 D64 F#52 G#52 C#64 B54 D52 E52 B54 A54 C#52 E52 A51"
song5_broken = "D5 8 E5 8 G3 2 F#5 1/ J#6 1/4 B5 14 "

console.log(convert_unformatted_string_to_rttl("testing1", song1))
console.log(convert_unformatted_string_to_rttl("testing2", song2))
console.log(convert_unformatted_string_to_rttl("testing3", song3))
console.log(convert_unformatted_string_to_rttl("testing4", song4))
console.log(convert_unformatted_string_to_rttl("testing5", song5_broken)) */


// ############################# COMMANDLINE UI #############################

song_name_prompt = 'Enter your melody name (default/blank is \"test\"):';
speed_prompt = 'Enter your speed (default/blank is 210): ';
output_melody_formatting = 'Melody fomatting is: \n\"A#58 P8 G516\" OR\n\"A#5 8 P4 G5 16\" OR\n\"A#5 1/8 P 1/8 G5 1/16\" OR mixed\nAdditional Spaces are removed';

while (true) {
    var song_name = prompt(song_name_prompt);
    if (song_name == null) {
        break;
    }
    if (song_name == '') {
        song_name = 'test';
    }
    speed = prompt(speed_prompt);
    if (speed == null) {
        break;
    }
    if (speed == '' || isNaN(speed)) {
        speed = "210";
    }
    header = song_name + ':b=' + speed + ',o=3,d=4';
    console.log('Header is \"' + header + '\"');
    console.log(output_melody_formatting);
    
    // repeat four times
        
    melodies = [];
    for (i = 0; i < 4; i++) {
        input_melody = prompt(`Enter your melody for ESC${i+1}: (type \"exit\" to exit)`);
        if (input_melody == 'exit' || input_melody == null) {
            break;
        }
        melodies.push(convert_unformatted_string_to_rttl(insert_number(header,i+1),input_melody));
        console.log(`\nESC${i+1}: ${melodies[i]}\n`);
    }

    console.log('\n\n#########  ALL MELODIES #########\n');
   
    // print all melodies in the array in following lines
    for (i = 0; i < melodies.length; i++) {
        console.log(melodies[i]);
    }
    
    cont = prompt('\nDo you want to continue? (y/n)');
    if (cont == 'n' || cont == null) {
        break;
    } else if (cont == 'y') {
        continue;
    } else {
        console.log('Invalid input');
        break;
    }
    console.log('\n\n');
}