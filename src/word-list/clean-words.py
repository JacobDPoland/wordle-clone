

import csv
import string
alphabet = list(string.ascii_lowercase)

with open('spanish-word-list.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';', quotechar='|')
    word_table = [list(row) for row in reader]

    word_table = word_table[5:]  # trim off the top 4 row to get rid of headers
    
    # print(word_table)

    words = []
    # get rid of unnecessary rows
    for row in word_table:
        word = row[1]

        # get rid of words that don't have 5 letters
        if len(word) != 5:  
            continue
        
        # get rid of words that can't be expressed in ascii for now
        weird = False
        for letter in word:
            if (letter not in alphabet):
                weird = True
                break   # break out of letter loop
        if weird:
            continue  # don't add weird words

        words.append(word)

    print(words)
    print(len(words))
        