// Alpha in JavaScript

/** 
 * This program takes a BLHELI_32 music string and converts it to RTTTL for BlueJay ESC.
 * 
 * API: Call 'convert_unformatted_string_to_rttl_with_prefixbuilder_return_invalid_symbols' with the optional parameter and an unformatted BL_HELI_32 string;
 * It returns the rtttl string and the invalid-symbols-strings-array (eg [32DJ, 1/]) as an array;
 * 
 * For using a custom prefix (not reccommended):
 * Call 'convert_unformatted_string_to_rttl_return_invalid_symbols' with the unformatted BL_HELI_32 string;
 * 'convert_unformatted_string_to_rttl' only returns the rtttl string without the invalid-symbols-strings;
 * 
 * Prefix systax: '${name}:d=8,o=5,b=${speed_int}'; (No colon ':').
 * To not use a prefix, call 'convert_unformatted_string_to_rttl_stock_prefix' with an unformatted BL_HELI_32 string and no prefix;
 */


// Change if you want a commandline interface (using JavaScript's prompt() function as input)
const command_line_ui_active = false;

// ############################# Just some code #############################

const accepted_notation_regex = new RegExp('^[CDEFGABP]#?[0-9]{0,4}$|^[0-9][/\\/][0-9]{1,2}$|^[0-9]$');
const replacesymbols_regex = new RegExp("\"|\'\`|\n", 'g');
const remove_regex = new RegExp("\s|\t|\n", 'g');
const stock_rtttl_prefix = 'test:d=8,o=5,b=210:';

/**
 * Converts most BLHELI_32 notation to the correct format used by the script. Also removes spaces and tabs.
 * @param {String} input_string Any BLHELI_32 notation
 * @returns {String} Formatted BLHELI_32 notation
 */
function get_into_right_format(input_string) {
    input_string = input_string.replaceAll(replacesymbols_regex, '');
    working_array = input_string.split(' ');

    invalid_notes = [];

    // Filter for only valid symbols
    better_array = working_array.filter(function (element) {
        if (remove_regex.test(element) || element == '') {
            return false;
        } else if (accepted_notation_regex.test(element)) {
            return true;
        } else {
            invalid_notes.push(element);
            return false;
        }
    });

    // Bring into correct notation: eg 'E#5 1/4' -> 'E#54'
    correct_string_array = [];
    correct_string_array.push(better_array[0]); //Always add the first element
    better_array.shift(); //Remove the first element

    better_array.forEach(function (element) {
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
    return [correct_string_array.join(' '), invalid_notes];
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
 * @param {String} note_string Formatted string of a single note with a duration (eg 'E#54')
 * @returns {Note} Note object;
 */
function split_into_note_object(note_string) {
    if (note_string.includes('#')) {
        // Sharp note
        position = note_string.indexOf('#');
        note = note_string.substring(0, position + 2);
        duration = note_string.substring(position + 2);
        return new Note(note, duration);
    } else if (note_string.includes('P')) {
        // Pause
        return new Note('p', note_string.substring(1));
    } else if (note_string.length >= 2) {
        // Regular note
        return new Note(note_string.substring(0, 2), note_string.substring(2));
    } else {
        return;
    }

}
/**
 * Go through each note in the String and return as list of notes as Note objects.
 * @param {String} source_Melody A formatted BLHELI_32 string
 * @returns {Array<Note>} Array of Note objects;
 */
function split_all_notes(source_Melody) {
    note_string = source_Melody.split(' ');
    notes = [];
    note_string.forEach(function (note) {
        note = split_into_note_object(note)
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
function join_notes_to_rtttl(notes) {
    result_list = notes.map(function (note) {
        return note.get_rtttl_string();
    });
    return result_list.join(',');
}

/**
 * Converts an unformatted BLHELI_32 string to rtttl string; Returns the rtttl string and the invalid symbols.
 * @param {String} prefix Prefix for the rtttl string without colon ':'
 * @param {String} unformatted_source_Melody Unformatted string of a melody in any BLHELI_32 notation
 * @returns {Array<String,Array<String>} Compiled rtttl string and an array of invalid symbols;
 */
function convert_blheli32_string_to_rttl_return_invalid_symbols(prefix, unformatted_source_Melody) {
    right_format_with_warnings = get_into_right_format(unformatted_source_Melody);
    formatted_string = right_format_with_warnings[0];
    invalid_symbols = right_format_with_warnings[1];
    notes = split_all_notes(formatted_string);
    return [prefix + ':' + join_notes_to_rtttl(notes), invalid_symbols];
}

/**
 *  * Converts an unformatted BLHELI_32 string to rtttl string. Builds the prefix from optional parameters or defaults.
 * @param {String} unformatted_source_Melody Unformatted string of a melody in any BLHELI_32 notation
 * @param {String} song_name Name of the song for the header. Leave empty for default "test".
 * @param {String} speed Speed for the song. Leave empty for default "210".
 * @param {String} duration Duration for the song. Leave empty for default "8".
 * @param {String} octave Octave for the song. Leave empty for default "5".
 * @returns {Array<String,Array<String>}  as array (final rtttl string, an array of invalid symbol-strings)
 */
function convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(unformatted_source_Melody, song_name = 'test',speed = 210, duration = 8, octave = 5)  {
    song_name = song_name.length > 0 ? song_name : 'test';
    speed = isNaN(speed) ? 210 : speed;
    
    // Is not a number or not a power of 2
    if (isNaN(duration)) {
        duration = 8;
    }else {
        // Check if it is a power of 2
        n = parseInt(duration);
        duration = (n && (n & (n - 1)) === 0) ? duration : 8;
    }
    octave = isNaN(octave) ? 5 : octave;

    prefix = `${song_name}:b=${speed},o=${octave},d=${duration}`;
    return convert_blheli32_string_to_rttl_return_invalid_symbols(prefix, unformatted_source_Melody);
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


// ############################# Node.js #############################

module.exports.convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols = convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols;

// ############################# Testing Ground #############################

/* song1 = "B5 4 P8 B5 4 P8 A5 2 P4 D5 8 E5 8 G5 8 D5 8 A5 4 P8 A5 4 P8 G5 4 G5 8 F#5 8 E5 4 D5 8 E5 8 G5 8 E5 8 G5 2 A5 4 F#5 4 F#5 8 E5 8 D5 4 D5 8 P 8 D5 8 P8 A5 4 A5 8 P8 G5 2"
song2 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
song3 = "E6 1/4  D6 1/4  F#5 1/2  G#5 1/2    C#6 1/4    B5 1/4    D5 1/2     E5 1/2  B5 1/4  A5 1/4  C#5 1/2 E5 1/2 A5 1/1 "
song4 = "E64 D64 F#52 G#52 C#64 B54 D52 E52 B54 A54 C#52 E52 A51"
song5_broken = "D5 8 E5 8 G3 2 F#5 1/ J#6 1/4 B5 14 "

console.log(convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(song1, 'teest1', 280, 6, 2)[0]);
console.log(convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(song2, 'teeest2', 260)[0]);
console.log(convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(song3)[0]);
console.log(convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(song4, 'teeeeeeest4', 420,'A')[0]);
console.log(convert_blheli32_to_rttl_prefixbuilder_return_invalid_symbols(song5_broken, 'teeeeest5', 210,8,'C')[0]); */


// ############################# COMMANDLINE UI #############################

if (command_line_ui_active) {
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

        // repeat four times for four ESCs

        melodies = [];
        for (i = 0; i < 4; i++) {
            input_melody = prompt(`Enter your melody for ESC${i + 1}: (type \"exit\" to exit)`);
            if (input_melody == 'exit' || input_melody == null) {
                break;
            }
            melody_and_warning = convert_blheli32_string_to_rttl_return_invalid_symbols(insert_number(header, i + 1), input_melody);
            melodies.push(melody_and_warning[0]);
            console.log(`Invalid symbols: ${melody_and_warning[1].join(', ')}`);
            console.log(`\nESC${i + 1}: ${melodies[i]}\n`);
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
            console.log('\n\n');
            continue;
        } else {
            console.log('Invalid input');
            break;
        }
    }
}