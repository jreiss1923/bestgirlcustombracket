const character_list = [];
var random_sample = [];
var temp_bracket = [];
var size = 64;

// make form for power of 2
// enter to submit name form
// show list of users
// show round number
// shuffle bracket
// win screen
// fix winner screen exit
// play sound
// add standings (1, 2, 3-4, etc) at end

function loadData() {

    const response = JSON.parse(this.responseText);
    for (let i = 0; i < response.data.MediaListCollection.lists.length; i++) {
        if (response.data.MediaListCollection.lists[i].name == "Completed" || response.data.MediaListCollection.lists[i].name == "Watching") {
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
    console.log("googa");
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
        size = size/2;
        random_sample = temp_bracket.sort(() => 0.5 - Math.random()).slice(0, size);
        temp_bracket = [];
    }
    
    else {
        random_sample = random_sample.slice(2, random_sample.length);
    }

    run_bracket(1);



}

function run_bracket(count) {
    var src = document.getElementById("left_image_loc");
    if (count == 1) {
        src.removeChild(src.lastChild);
        src.removeChild(src.lastChild);
    }
    var button = document.createElement("button");
    button.innerText = random_sample[0][0];
    button.onclick = function() { imageChoice("left") };
    var img = document.createElement("img");
    img.src = random_sample[0][1];
    src.appendChild(button);
    src.appendChild(img);
    


    var src = document.getElementById("right_image_loc");
    if (count == 1) {
        src.removeChild(src.lastChild);
        src.removeChild(src.lastChild);
    }
    var button = document.createElement("button");
    button.innerText = random_sample[1][0];
    button.onclick = function() { imageChoice("right") };
    var img = document.createElement("img");
    img.src = random_sample[1][1];
    src.appendChild(button);
    src.appendChild(img);
}

function initBracket(size) {

    const no_dupes_list = removeDupes();
    random_sample = no_dupes_list.sort(() => 0.5 - Math.random()).slice(0, size);
    console.log(random_sample);
    run_bracket(0);

}

function queryData(user) {

    document.getElementById("username_text_box").value = "";

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

function selectSize(text_box_size) {
    size=text_box_size;
}



