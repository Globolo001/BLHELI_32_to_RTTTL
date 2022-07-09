#Alpha

#This program takes a BLHELI_32 music string and converts it to rttl for Blue Jay
#to execute this program, run the following command:
#python3 /PATH_TO/main.py

#split each note into note and duration
def split_into_note_and_duration(input,previous_note):
    
    #if it contains #, it is a sharp note. get the position of the #
    
    if "#" in input:
        #get the position of the #
        position = input.index("#")
        #get the note and the duration
        note = str.lower(input[:position+2])
        duration = input[position+2:]
        return note, duration
    elif "P" in input:
        #split at position of P
        # get the note and the duration
        return "p", input[1:]     
    elif len(input) >= 1:
        #split after the second position
        note = input[:2]
        duration = input[2:]
        return str.lower(input[:-1]), input[-1]
    else:
        return "", ""

#do that for each note and return as list of notes
def split_all_notes(source_Melody):
    input = source_Melody.split(" ")
    #make a list of notes
    notes = []
    for note in input:
        #add the note to the list
        #use the last note as the previous note. if notes is empty, use empty string
        notes.append(split_into_note_and_duration(note, "" if len(notes) == 0 else notes[-1][0]))
    return notes

def convert_split_to_rttl(notes):
    #make a list of rttl notes
    rttl_notes = ""
    for note, duration in notes:
        #convert the note to rttl
        #print(note, duration)
        rttl_notes+=duration
        rttl_notes+=note
        rttl_notes+=(",")
    #remove the last comma
    rttl_notes = rttl_notes[:-1]
    return rttl_notes

def convert_string_to_rttl(prefix,source_Melody):
    notes = split_all_notes(source_Melody)
    result = prefix + ":" + convert_split_to_rttl(notes)
    return result

#insert number before colon in string
def insert_number(string, number):
    return string[:string.index(":")] + str(number) + string[string.index(":"):]

#For BLHELI_32 notation, with spaces between notes and duration ("A#5 8 P8 A#5 8"), apply this fucnction to get ("A#58 P8 A#5 8")
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


################### HARDCODED OVERTAKEN BY TERMINAL UI - STILL USEFUL FOR TROUBLESHOOTING ##########################################################################
#write your BLHELI_32 melody here.

#Sample of the wrong format
testMusicWrongFormat = "A#5 8 P8 A#5 8 A5 8 P8 A5 8 A#5 1 P32 A5 8 P8 A#5 8 P8 A#5 8 A5 8 P8 A5 8 A#5 1 P32 A5 8 P8 A#5 8 A5 8 P8 A#5 8 P8 A5 8 P8 C6 8 P8 C6 8 A#5 4 A5 4 F5 4 A#5 8 P8 A#5 8 A5 8 P8 A5 8 A#5 1"
testMusicCorrectFormat = get_into_right_format(testMusicWrongFormat) #Now in correct format

##INPUT######An actual song. Insert your own melody here ##############################################
esc1 = "C64 A#54 A54 F54 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#64 A64 A#64 A64 A#64 G52 G54 A#64 A64 A#64 A64 A#64"
esc2 = "G41 D#44 D#48 D#58 D#44 D#54 D#44 D#48 D#58 D#44 D#54 F44 F48 F58 F44 F54 F44 F48 F58 F44 F54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54"
esc3 = "D68 C68 A#54 A54 F58 G58 G52 G54 D64 C62 A#52 A52 A54 A54 C62 A#54 A54 G52 G54 A#54 A54 A#54 A54 A#54 G52 G54 A#54 A54 A#54 A54 A#54"
esc4 = "G44 G44 G44 G44 D#44 D#48 D#58 D#44 D#54 D#44 D#48 D#58 D#44 D#54 F44 F48 F58 F44 F54 F44 F48 F58 F44 F54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54 G44 G48 G58 G44 G54"

#Your melody will be adjusted
esc1 = get_into_right_format(esc1)
esc2 = get_into_right_format(esc2)
esc3 = get_into_right_format(esc3)
esc4 = get_into_right_format(esc4)

##INPUT######Put BlueJay prefix here. Numbers will be inserted. Adjust bpm here. ##############################################
prefix = "coffin:b=250,o=3,d=4"

#print("ESC1")
convert_string_to_rttl(insert_number(prefix,1), esc1)
#print("ESC2")
convert_string_to_rttl(insert_number(prefix,2),esc2)
#print("ESC3")
convert_string_to_rttl(insert_number(prefix,3),esc3)
#print("ESC4")
convert_string_to_rttl(insert_number(prefix,4),esc4)


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
    prefix = name + ":b=" + str(speed) + ",o=3,d=4"
    print("Header is \"" + prefix + "\"")
    print("Melody fomatting is: \"A#5 8 P8 A#5 8\" OR \"A#58 P8 A#58\" OR mixed")
    #convert the input to rttl
    melodies = []
    for i in range(4):
        #save the input in an array
        input_melody = input("Enter your melody for ESC{}: (type \"exit\" to exit)".format(i+1))

        #type exit to exit
        if input_melody == "exit":
            break
        
        melodies.append(convert_string_to_rttl(insert_number(prefix,i+1),get_into_right_format(input_melody)))
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
    





