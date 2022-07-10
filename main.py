### Alpha

### This program takes a BLHELI_32 music string and converts it to RTTTL for Blue Jay ESC ###

# To execute this program, run python online or another way. You can install python3 and run the following command: 
# "python3 /PATH_TO/main.py" ((Probably similar to: (MAC) "pyhton3 ~/Desktop/main.py" or (WINDOWS) "pyhton3 %UserProfile%\Desktop\main.py"))
# You will be greeted with a commandline menu to convert your BLHELI_32 music string to RTTTL.

#### Just some code #########################################################################################################################

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

#For BLHELI_32 notation, with spaces between notes and duration ("A#5 8 P8 A#5 8"), apply this function to get formatted ("A#58 P8 A#58")
def get_into_right_format(string):
    working_string = string.split(" ")
    #go through each note. if it has only one character, append to the previous note
    for i in range(len(working_string)):
        if(i==len(working_string)):
            break
        if len(working_string[i]) == 1:
            working_string[i-1] += working_string[i]
            working_string.pop(i)
        if(i==len(working_string)):
            break
    return " ".join(working_string)

################################# COMMANDLINE UI ##############################################
#make a command-line interface
#get the input
print("\n\n##### WELCOME TO THE BLHELI_32 to BLUE JAY MUSIC CONVERTER #####\n\n")

while True:
    name = input("Enter your melody name (default is \"test\"):")
    if name == "":
        name = "test"
    #enter speed or leave blank for default
    speed = input("Enter your speed (default is 210): ")
    #if speed is not a number an integer, set it to 210
    if speed == "" or not speed.isdigit():
        speed = 210
    else:
        speed = int(speed)
    header = name + ":b=" + str(speed) + ",o=3,d=4"
    print("Header is \"" + header + "\"")
    print("Melody fomatting is: \"A#5 8 P8 A#5 8\" OR \"A#58 P8 A#58\" OR mixed")
    melodies = []
    for i in range(4):
        input_melody = input("Enter your melody for ESC{}: (type \"exit\" to exit)".format(i+1))
        if input_melody == "exit":
            break
        #convert the input to rttl and save to list
        melodies.append(convert_unformatted_string_to_rttl(insert_number(header,i+1),input_melody))
        print("\nESC{}:\n{}\n".format(i+1, melodies[i]))
    
    #print all the melodies
    print("\n\n##### ALL MELODIES #####\n")
    for melody in melodies:
        print(melody)

    #ask if user wants to continue
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
    





