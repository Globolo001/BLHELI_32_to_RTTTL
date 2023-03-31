import convertBlheli32ToRtttl from "../RTTTL_MODULE/src/main.js";
import readline from "readline";

// ############################# COMMANDLINE UI #############################

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const song_name_prompt = 'Enter your melody name (default/blank is \"test\"):';
const speed_prompt = 'Enter your speed (default/blank is 210): ';
const output_melody_formatting = 'Melody fomatting is: \n\"A#58 P8 G516\" OR\n\"A#5 8 P4 G5 16\" OR\n\"A#5 1/8 P 1/8 G5 1/16\" OR mixed\nAdditional Spaces are removed';

console.log('Welcome to the BLHELI_32 to RTTTL converter!');

rl.on('line', (input) => {
    console.log(`Received: ${input}`);
});

let promptAlreadyDeclined = false;
function console_prompt(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (input) => {
            if (input) {
                resolve(input);
            } else {
                resolve('');
            }
        });
    });
}


async function run() {
    while (true) {
        console.log('----------------------------------------');
        let song_name = await console_prompt(song_name_prompt);
        if (song_name == null) {
            console.log('Song name is null. Exiting...');
            break;
        }
        if (song_name.length < 1) {
            song_name = 'test';
        }
        let speed = await console_prompt(speed_prompt);
        if (speed == null) {
            console.log('Speed is null. Exiting...');
            break;
        }
        if (speed.length < 1 || isNaN(speed)) {
            speed = "210";
        }
        const header = song_name + ':b=' + speed + ',o=3,d=4';
        console.log('Header is \"' + header + '\"');
        console.log(output_melody_formatting);

        // repeat four times for four ESCs

        const melodies = [];
        for (let i = 0; i < 4; i++) {
            const input_melody = await console_prompt(`Enter your melody for ESC${i + 1}: (type \"exit\" to exit)`);
            if (input_melody == 'exit' || input_melody == null) {
                break;
            }
            const melody_and_warning = convertBlheli32ToRtttl(input_melody, song_name, speed);
            melodies.push(melody_and_warning[0]);
            console.log(`Invalid symbols: ${melody_and_warning[1].join(', ')}`);
            console.log(`\nESC${i + 1}: ${melodies[i]}\n`);
        }

        console.log('\n\n#########  ALL MELODIES #########\n');

        // print all melodies in the array in following lines
        for (let i = 0; i < melodies.length; i++) {
            console.log(melodies[i]);
        }

        const cont = await console_prompt('\nDo you want to continue? (y/n)');
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
    rl.close();
}

run();