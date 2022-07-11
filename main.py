### Alpha

### This program takes a BLHELI_32 music string and converts it to RTTTL for BlueJay ESC ###

# To execute this program, run python online or another way. You can install python3 and run the following command: 
# "python3 /PATH_TO/main.py" ((Probably similar to: (MAC) "pyhton3 ~/Desktop/main.py" or (WINDOWS) "pyhton3 %UserProfile%\Desktop\main.py"))
# You will be greeted with a commandline menu to convert your BLHELI_32 music string to RTTTL.

#### Just some code #########################################################################################################################

import re

accepted_notation_regex = '^[CDEFGABP]#?\d{0,4}$|^\d[\/]\d{1,2}$|^\d$'

#For BLHELI_32 notation with wrong formatting. It converts to 'G#34'  wihout spaces between duration and tune (like 'G#3 4' or 'G#3 1/4)'
def get_into_right_format(string):
    working_string = string.split(" ")

    #do basic preperation of the string
    working_string = [x for x in working_string if x != ""]
    working_string = [x for x in working_string if x != "\t"]
    working_string = [x for x in working_string if x != "\n"]

    working_string = [x.replace("\"","") for x in working_string]

    #go through each note
    for i in range(len(working_string)):
        if(i>=len(working_string)):
            break
        if len(working_string[i]) == 1 and working_string[i].isdigit():
            #if it is a duration as a single digit, append to the previous note if it exists
            if len(working_string)>1:
                working_string[i-1] += working_string[i]
                working_string.pop(i)
            else:
                print("ERROR: Should not start with a number: " + working_string[i])
                working_string.pop(i)
        elif "/" in working_string[i] and len(working_string[i]) >= 3 and working_string[i][2].isdigit():
            #if it is a duration in the form of "1/x", append to the previous note
            beat = working_string[i].split("/")
            working_string[i-1] += beat[1]
            working_string.pop(i)
        #match regex of note and duration
        elif not re.match(accepted_notation_regex, working_string[i]):
            print("ERROR Unknown Symbol: '" + working_string[i] + "'")
            working_string.pop(i)
    return " ".join(working_string)

#split each note into note and duration
def split_into_note_and_duration(input):
    #if it contains #, it is a sharp note. get the position of the #
    if "#" in input:
        position = input.index("#")
        #get the note and the duration
        note = str.lower(input[:position+2])
        duration = input[position+2:]
        return note, duration
    elif "P" in input:
        # get the note and the duration
        return "p", input[1:]     
    elif len(input) >= 1:
        #split after the second position
        note = input[:2]
        duration = input[2:]
        return str.lower(input[:-1]), input[-1]
    else:
        return "", ""

#do that for each note and return as list of notes as tuples
def split_all_notes(source_Melody):
    input = source_Melody.split(" ")
    notes = []
    for note in input:
        #add the note to the list
        notes.append(split_into_note_and_duration(note))
    return notes

#compile the notes into rttl
def convert_split_to_rttl(notes):
    rttl_notes = ""
    for note, duration in notes:
        #convert the note to rttl
        rttl_notes+=duration
        rttl_notes+=note
        rttl_notes+=(",")
    rttl_notes = rttl_notes[:-1]
    return rttl_notes

#do the conversion from a formatted string to rttl
def convert_formatted_string_to_rttl(prefix,source_Melody):
    notes = split_all_notes(source_Melody)
    result = prefix + ":" + convert_split_to_rttl(notes)
    return result

#do the full conversion from unformatted string to rttl
def convert_unformatted_string_to_rttl(prefix,source_Melody):
    return convert_formatted_string_to_rttl(prefix, get_into_right_format(source_Melody))

#insert number before colon in string for the prefix in rtttl
def insert_number(string, number):
    return string[:string.index(":")] + str(number) + string[string.index(":"):]


################################# Testing Ground ##############################################

# song1 = "D5 8 E5 8 G5 8 D5 8 B5 4 P8 B5 4 P8 A5 2 P4 D5 8 E5 8 G5 8 D5 8 A5 4 P8 A5 4 P8 G5 4 G5 8 F#5 8 E5 4 D5 8 E5 8 G5 8 E5 8 G5 2 A5 4 F#5 4 F#5 8 E5 8 D5 4 D5 8 P 8 D5 8 P8 A5 4 A5 8 P8 G5 2"
# song2 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
# song3 = "E6 1/4  D6 1/4  F#5 1/2  G#5 1/2    C#6 1/4    B5 1/4    D5 1/2     E5 1/2  B5 1/4  A5 1/4  C#5 1/2 E5 1/2 A5 1/1"
# song4_broken = "D5 8 E5 8 G3 2 F#5 1/ J#6 1/4 B5 14"

# print (convert_unformatted_string_to_rttl("testing1", song1))
# print (convert_unformatted_string_to_rttl("testing2", song2))
# print (convert_unformatted_string_to_rttl("testing3", song3))
# print (convert_unformatted_string_to_rttl("testing4", song4_broken))


################################# COMMANDLINE UI ##############################################
print("\n\n##### WELCOME TO THE BLHELI_32 to BlueJay MUSIC CONVERTER #####\n\n")

name_prompt = "Enter your melody name (default/blank is \"test\"):"
speed_prompt = "Enter your speed (default/blank is 210): "
output_melody_formatting = "Melody fomatting is: \n\"A#58 P8 G516\" OR\n\"A#5 8 P4 G5 16\" OR\n\"A#5 1/8 P 1/8 G5 1/16\" OR mixed\nAdditional Spaces are removed"
input_prompt = "Enter your melody for ESC{}: (type \"exit\" to exit)"

while True:
    name = input(name_prompt)
    if name == "":
        name = "test"
    #enter speed or leave blank for default
    speed = input(speed_prompt)
    if speed == "" or not speed.isdigit():
        speed = 210
    else:
        speed = int(speed)
    header = name + ":b=" + str(speed) + ",o=3,d=4"
    print("Header is \"" + header + "\"")
    print(output_melody_formatting)
    melodies = []
    for i in range(4):
        input_melody = input(input_prompt.format(i+1))
        if input_melody == "exit":
            break
        melodies.append(convert_unformatted_string_to_rttl(insert_number(header,i+1),input_melody))
        print("\nESC{}:\n{}\n".format(i+1, melodies[i]))
    
    print("\n\n##### ALL MELODIES #####\n")
    for melody in melodies:
        print(melody)

    cont = input("\nDo you want to continue? (y/n)")
    if cont == "n":
        break
    elif cont == "y":
        continue
    else:
        print("Invalid input")
        break
    print("\n\n")
###############################################################################################
    





