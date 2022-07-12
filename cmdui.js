import * as main from 'main.js';


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

    // repeat four times for four ESCs

    melodies = [];
    for (i = 0; i < 4; i++) {
        input_melody = prompt(`Enter your melody for ESC${i + 1}: (type \"exit\" to exit)`);
        if (input_melody == 'exit' || input_melody == null) {
            break;
        }
        melody_and_warning = main.convertBlheli32ToRtttlPrefixbuilderInvalidSymbolReturn(insert_number(header, i + 1), input_melody);
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