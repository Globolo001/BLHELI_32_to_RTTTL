import assert from 'assert';
import convertBlheli32ToRtttl from '../main.js';


const song1 = "B5 4 P8 B5 4 P8 A5 2 P4 D5 8 E5 8 G5 8 D5 8 A5 4 P8 A5 4 P8 G5 4 G5 8 F#5 8 E5 4 D5 8 E5 8 G5 8 E5 8 G5 2 A5 4 F#5 4 F#5 8 E5 8 D5 4 D5 8 P 8 D5 8 P8 A5 4 A5 8 P8 G5 2"
const song2 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
const song3 = "E6 1/4  D6 1/4  F#5 1/2  G#5 1/2    C#6 1/4    B5 1/4    D5 1/2     E5 1/2  B5 1/4  A5 1/4  C#5 1/2 E5 1/2 A5 1/1 "
const song4 = "E64 D64 F#52 G#52 C#64 B54 D52 E52 B54 A54 C#52 E52 A51"
const song5_broken = "D5 8 E5 8 G3 2 F#5 1/ J#6 1/4 B5 14 " // partially passing notes
const song6_broken = "1/ /4 H not a## note" //no passing notes

const song1Expected = ['teest1:b=280,o=2,d=8:4b5 8p 4b5 8p 2a5 4p 8d5 8e5 8g5 8d5 4a5 8p 4a5 8p 4g5 8g5 8f#5 4e5 8d5 8e5 8g5 8e5 2g5 4a5 4f#5 8f#5 8e5 4d5 8d5 8p 8d5 8p 4a5 8a5 8p 2g5',
[]]
const song2Expected = ['teeest2:b=260,o=5,d=8:4c6 4a#5 4a5 4f5 2g5 4g5 4d6 2c6 2a#5 2a5 4a5 4a5 2c6 4a#5 4a5 2g5 4g5 4a#6 4a6 4a#6 4a6 4a#6 2g5 4g5 4a#6 4a6 4a#6 4a6 4a#6',
[]]
const song3Expected = ['test:b=210,o=5,d=8:4e6 4d6 2f#5 2g#5 4c#6 4b5 2d5 2e5 4b5 4a5 2c#5 2e5 1a5',
[]]
const song4Expected = ['teeeeeeest4:b=420,o=5,d=8:4e6 4d6 2f#5 2g#5 4c#6 4b5 2d5 2e5 4b5 4a5 2c#5 2e5 1a5',
[]]
const song5Expected = ['teeeeest5:b=420,o=5,d=8:8d5 8e5 2g3 4f#5 b5',
['1/', 'J#6', '14']]
const song6Expected = ['teeeeest6:b=420,o=5,d=8:',
['1/', '/4', 'H', 'not', 'a##', 'note']]


describe('convertBlheli32ToRtttl', function() {
  it('should convert song1 correctly', function() {
    const actual = convertBlheli32ToRtttl(song1, 'teest1', 280, 8, 2);
    assert.deepEqual(actual, song1Expected);
  });

  it('should convert song2 correctly', function() {
    const actual = convertBlheli32ToRtttl(song2, 'teeest2', 260);
    assert.deepEqual(actual, song2Expected);
  });

  it('should convert song3 correctly', function() {
    const actual = convertBlheli32ToRtttl(song3);
    assert.deepEqual(actual, song3Expected);
  });

  it('should convert song4 correctly', function() {
    const actual = convertBlheli32ToRtttl(song4, 'teeeeeeest4', 420,'A');
    assert.deepEqual(actual, song4Expected);
  });

  it('should convert song5 correctly', function() {
    const actual = convertBlheli32ToRtttl(song5_broken, 'teeeeest5', 420,'A');
    assert.deepEqual(actual, song5Expected);
  });

  it('should convert song6 correctly', function() {
    const actual = convertBlheli32ToRtttl(song6_broken, 'teeeeest6', 420,'A');
    assert.deepEqual(actual, song6Expected);
  });
});
