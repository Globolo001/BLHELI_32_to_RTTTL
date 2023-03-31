# BLHELI_32 to RTTTL Converter
This is a simple JavaScript program that converts BLHELI_32 notation into RTTTL notation. It also removes spaces, tabs, and invalid symbols. The code consists of a few regular expressions and several functions that handle different parts of the conversion process.

## How to Use
To use the program, you will need to have a BLHELI_32 string. Simply call the 
```javascript
`convertBlheli32ToRtttl(unformattedSourceMelody, songName = 'test', speed = 210, duration = 8, octave = 5)
```
function with the prefix and the unformatted BLHELI_32 string as arguments. The function will return the RTTTL string and an array of any invalid symbols that were found.

## Example Usage
```javascript
let unformatted_source_Melody = 'C6 2/8 G#2 1/2 C#5 8/8 P2 INVALID1 djs !/';
let rtttl_string = convertBlheli32ToRtttl(unformatted_source_Melody, 'teest1', 420, 8, 5);
console.log(rtttl_string);
This will output the following:
```

```javascript
// Result
rtttl_string = ["teest1:b=420,o=5,d=8:8c6,2g#2,8c#5,2p", ["INVALID1", "djs", "!/"]];

// To access only the RTTTL string, use the following:
rtttl_string[0];
```

## Limitations
Even though the script always produces a working output it does not handle every possible case. The following are some limitations of the script:

1) It does not handle cases where the fraction is not 1/x (eg 2/3 8/8). They will be interpreted as 1/X (eg 2/3 will be interpreted as 1/3, and 8/8 will be interpreted as 1/8).
3) Incorrect syntax may not be always handled correctly. For example  `C#4 4 4`will be interpreted as `44C#4`instead of invalidating the second 4.
2) There may be some valid BLHELI_32 syntax that is not handled by the script. If you find any, please let me know.

## Code Explanation

### Regular Expressions
There are four regular expressions used in this program:

noteRegex: matches any valid note, including sharps and octaves
durationWholeRegex: matches any whole-duration number, such as 1, 2, 4, 8, etc.
durationFractionRegex: matches any fraction-duration in the format of 1/X, where X is any whole-duration number
noteWithDurationRegex: matches any note that includes a duration in the format of A1/4, where A is any note and 1/4 is any valid duration
Functions
There are four functions used in this program:

getIntoRightFormat(): converts BLHELI_32 notation into a format that can be used by the program, and removes spaces, tabs, and invalid symbols
splitIntoNoteObject(): takes a formatted note string and returns a Note object with a tune and duration property
splitAllNotes(): takes a formatted BLHELI_32 string and returns an array of Note objects
joinNotesToRtttl(): takes an array of Note objects and returns an RTTTL string
Classes
There is one class used in this program:

Note: a simple class for a note, which has a tune and duration property, and a get_rtttl_string() method that returns an RTTTL string for the note.