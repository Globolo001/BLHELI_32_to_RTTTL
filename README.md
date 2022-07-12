# BLHELI_32_to_RTTTL
### This program takes a BLHELI_32 music string and converts it to RTTTL for BlueJay ESC firmware

## JavaScript Module

### Usage

#### Input
Call the function:\
 `convertBlheli32ToRtttlPrefixbuilderInvalidSymbolReturn(BLHELI_32_string, song_name?,speed?, duration?, octave?)`
 
 `?`: Optional parameter. The default are `song_name = 'test',speed = 210, duration = 8, octave = 5`.\
Parameter-numbers can be string or int. In case it does not match critera, they will be set to default.

#### Output
The function returns an array (length 2) with the RTTTL string and the unknown-symbols-string-array.\
`[String,Array<String>]]`

Example:\
`['test:b=300,o=5,d=8:4b5,8p,4b5,8p,2a5', ['B6', 'M', '1/', 'U3']]`

The final RTTTL string can be accessed easily: `function_result[0]`

#### Details
It does the filtering for unknown symbols with a regex and should always produce an RTTTL readable output without the unwanted symbols.

It might be useful to display the invalid symbols from `result[1]` for the user to improve the users BLHELI_32 string and (maybe) adjust the regex if a new syntax is found.
It removes all spaces, quotation-marks and new lines.
 
## For Python

### Execution:
If you don't know how to execute a python script I reccomend using an online-tool to execute the simple script.
Just google "Python Interpreter Online" (like https://www.programiz.com/python-programming/online-compiler/)

Copy the contents of the file **main.py** into the online-editor and press run (or similar).

Once the script starts a commandline interface opens which I hope it is self-explainatory.
I am happy to receive feedback.

### Input:
I hope I got all syntax of BLHELI_32 music covered (if not, contact me on BlueJay Discord). Just copy-paste your music (without "quotations") into the prompt when asked.
The formatting is explained in the UI.

## Useful Links:
BlueJay Github: https://github.com/mathiasvr/bluejay
ESC-Flasher for BlueJay and music: https://esc-configurator.com

#### Note

I know this isn't the prettiest code. Feel free to improve ;)

### Have fun using your BLHELI_32 songs again :)
