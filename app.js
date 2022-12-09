const character_list = []
var random_sample = []
var temp_bracket = []

function loadData() {

    const response = JSON.parse(this.responseText);
    for (let i = 0; i < response.data.MediaListCollection.lists.length; i++) {
        if (response.data.MediaListCollection.lists[i].name != "Planning") {
            for (let j = 0; j < response.data.MediaListCollection.lists[i].entries.length; j++) {
                const title_english = response.data.MediaListCollection.lists[i].entries[j].media.title.english;
                const title_romaji = response.data.MediaListCollection.lists[i].entries[j].media.title.romaji;
                for (let k = 0; k < response.data.MediaListCollection.lists[i].entries[j].media.characters.nodes.length; k++) {
                    const character = response.data.MediaListCollection.lists[i].entries[j].media.characters.nodes[k]
                    const character_edge = response.data.MediaListCollection.lists[i].entries[j].media.characters.edges[k]
                    
                    const role = character_edge.role;
                    const gender = character.gender;
                    const favourites = character.favourites;

                    if (gender == "Female" && favourites > 100 && role != "BACKGROUND") {
                        if (title_english) {
                            character_list.push([character.name.full, "(" + title_english + ")", character.image.large]);
                        }
                        else {
                            character_list.push([character.name.full, "(" + title_romaji + ")", character.image.large]);
                        }
                    }
                }
            }
        }
    }

}

function removeDupes() {

    const existing_chars = [];
    const no_dupes_list = [];

    for (let i = 0; i < character_list.length; i++) {
        if (!existing_chars.includes(character_list[i][0])) {
            no_dupes_list.push([character_list[i][0] + " " + character_list[i][1], character_list[i][2]]);
            existing_chars.push(character_list[i][0]);
        }
    }

    return no_dupes_list;

}

function imageChoice(left_or_right) {
    if (left_or_right == "left") {
        temp_bracket.push(random_sample[0]);
    }
    else if (left_or_right == "right") {
        temp_bracket.push(random_sample[1]);
    }

    if (temp_bracket.length == 1 && random_sample.length == 2) {
        console.log("winner");
        return 0;
    }

    if (random_sample.length == 2) {
        random_sample = temp_bracket;
        temp_bracket = [];
    }
    
    else {
        random_sample = random_sample.slice(2, random_sample.length);
    }

    run_bracket();



}

function run_bracket() {
    var src = document.getElementById("left_image_loc");
    src.removeChild(src.lastChild);
    var img = document.createElement("img");
    img.src = random_sample[0][1];
    src.appendChild(img);


    var src = document.getElementById("right_image_loc");
    src.removeChild(src.lastChild);
    var img = document.createElement("img");
    img.src = random_sample[1][1];
    src.appendChild(img);
}

function initBracket(size) {

    const no_dupes_list = removeDupes();
    random_sample = no_dupes_list.sort(() => 0.5 - Math.random()).slice(0, size);
    console.log(random_sample);
    run_bracket();

}

function queryData(user) {

    console.log(user);

    const body = {
        query:"query ($name:String) {MediaListCollection(userName:$name, type:ANIME) {lists {name entries {media {title {romaji, english} characters {edges {role}, nodes {name{full}, gender, favourites, image{large}}}}}}}}",
        variables: {
            name:user
        }
    }
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", loadData);
    xhr.open("POST", "https://graphql.anilist.co");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

}



