import json
import requests
import os
import sys
import random

url = 'https://graphql.anilist.co'

def character_list_one_user(user):

    query = '''
    query ($name:String) {
        MediaListCollection(userName:$name, type:ANIME) {
            lists {name entries {media {title {romaji, english} characters {nodes {name{full}, gender, favourites}}}}}
         }
    }'''

    variables = {
        'name': user
    }

    character_list = []

    response = requests.post(url, json={'query': query, 'variables': variables}).json()
    for media_list_collection in response['data']['MediaListCollection']['lists']:
        if media_list_collection['name'] != "Planning":
            for entries in media_list_collection['entries']:
                title_english = entries['media']['title']['english']
                title_romaji = entries['media']['title']['romaji']
                for character in entries['media']['characters']['nodes']:
                    if character['gender'] == "Female" and character['favourites'] > 100:
                        if title_english:
                            character_list.append([character['name']['full'], "(" + title_english + ")"])
                        else:
                            character_list.append([character['name']['full'], "(" + title_romaji + ")"])

    return character_list


def character_list_multiple_users(list_of_users):

    full_char_list = []
    for user in list_of_users:
        full_char_list.append(character_list_one_user(user))

    flat_char_list = [item for sublist in full_char_list for item in sublist]
    existing_chars = []
    no_dupes_list = []
    for char_show_tuple in flat_char_list:
        if char_show_tuple[0] not in existing_chars:
            no_dupes_list.append(char_show_tuple[0] + " " + char_show_tuple[1])
            existing_chars.append(char_show_tuple[0])

    return no_dupes_list


def run_bracket(bracket_list, size):
    if size == 1:
        return bracket_list[0]
    else:
        new_bracket_list = []
        while len(new_bracket_list) < size/2:
            choice = input("Choose 1\n" + bracket_list[0] + "    " + bracket_list[1] + "\n")
            if choice == "l":
                new_bracket_list.append(bracket_list[0])
                bracket_list = bracket_list[2:]
            elif choice == "r":
                new_bracket_list.append(bracket_list[1])
                bracket_list = bracket_list[2:]
        return run_bracket(new_bracket_list, size/2)


friends = ['Patrui']
print("Your winner is", run_bracket(random.sample(character_list_multiple_users(friends), 32), 32))







