import json
import requests
import os
import sys
import random
from PIL import Image
from io import BytesIO


url = 'https://graphql.anilist.co'


def character_list_one_user(user):

    query = '''
    query ($name:String) {
        MediaListCollection(userName:$name, type:ANIME) {
            lists {name entries {media {title {romaji, english} characters {edges {role}, nodes {name{full}, gender, favourites, image{large}}}}}}
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
                for i in range(len(entries['media']['characters']['nodes'])):
                    character = entries['media']['characters']['nodes'][i]
                    character_edge = entries['media']['characters']['edges'][i]
                    role = character_edge['role']
                    print(role)
                    gender = character['gender']
                    favourites = character['favourites']
                    if gender == "Female" and favourites > 100 and role != "BACKGROUND":
                        if title_english:
                            character_list.append([character['name']['full'], "(" + title_english + ")", character['image']['large']])
                        else:
                            character_list.append([character['name']['full'], "(" + title_romaji + ")", character['image']['large']])

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
            no_dupes_list.append([char_show_tuple[0] + " " + char_show_tuple[1], char_show_tuple[2]])
            existing_chars.append(char_show_tuple[0])

    return no_dupes_list

def run_bracket(bracket_list, size):
    if size == 1:
        return bracket_list[0][0]
    else:
        new_bracket_list = []
        while len(new_bracket_list) < size/2:
            left = Image.open(requests.get(bracket_list[0][1], stream=True).raw)
            right = Image.open(requests.get(bracket_list[1][1], stream=True).raw)

            left.show()
            right.show()
            choice = input("Choose 1\n" + bracket_list[0][0] + "    " + bracket_list[1][0] + "\n")
            left.close()
            right.close()
            if choice == "l":
                new_bracket_list.append(bracket_list[0])
                bracket_list = bracket_list[2:]
            elif choice == "r":
                new_bracket_list.append(bracket_list[1])
                bracket_list = bracket_list[2:]
        return run_bracket(new_bracket_list, size/2)


friends = ['Patrui', 'josrei1923', 'nalabird123']
print("Your winner is", run_bracket(random.sample(character_list_multiple_users(friends), 64), 64))







