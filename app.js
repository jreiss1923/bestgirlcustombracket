const character_list = [];
var random_sample = [];
var temp_bracket = [];
var standings = [];
var size = 64;

// add standings (1, 2, 3-4, etc) at end
// left/right arrow keys to select character
// undo button?
// pick smaller size if list too small for power of 2
// all character/guy dropdown
// add pisslo removal (top n favorites) for big brackets

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

    document.getElementById("run_bracket").disabled = false;

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
        standings.push(random_sample[1]);
    }
    else if (left_or_right == "right") {
        temp_bracket.push(random_sample[1]);
        standings.push(random_sample[0]);
    }

    if (temp_bracket.length == 1 && random_sample.length == 2) {
        display_winner(temp_bracket[0]);
    }

    else if (random_sample.length == 2) {
        size = size/2;
        random_sample = shuffle(temp_bracket).slice(0, size);
        temp_bracket = [];
    }
    
    else {
        random_sample = random_sample.slice(2, random_sample.length);
    }

    run_bracket(1);



}

function display_winner(winner) {
    document.getElementById("left_image_loc").remove();
    document.getElementById("right_image_loc").remove();

    var div = document.getElementById("winner");

    var img = document.createElement("img");
    img.src = winner[1];
    div.appendChild(img);

    display_standings(winner);

}

function display_standings(winner) {
    standings.push(winner);
    standings.reverse();
    var top_8 = standings.slice(0, 8);

    var standings_list = document.getElementById("rank_list");

    for (var i = 0; i < 8; i++) {
        var list_element = document.createElement("li");
        var list_value = document.createTextNode((i + 1) + ". " + top_8[i][0]);
        list_element.appendChild(list_value);
        standings_list.append(list_element);
    }


}

function run_bracket(count) {
    var src = document.getElementById("left_image_loc");
    if (count == 1) {
        src.removeChild(src.lastChild);
    }
    var button = document.createElement("button");
    var para = document.createElement("p");
    para.innerHTML = random_sample[0][0];
    button.onclick = function() { imageChoice("left") };
    var img = document.createElement("img");
    img.src = random_sample[0][1];
    button.appendChild(img);
    button.appendChild(para);
    src.appendChild(button);
    


    var src = document.getElementById("right_image_loc");
    if (count == 1) {
        src.removeChild(src.lastChild);
    }
    var button = document.createElement("button");
    var para = document.createElement("p");
    para.innerHTML = random_sample[1][0];
    button.onclick = function() { imageChoice("right") };
    var img = document.createElement("img");
    img.src = random_sample[1][1];
    button.appendChild(img);
    button.appendChild(para);
    src.appendChild(button);
}

function initBracket() {

    document.getElementById("username_text_box").remove();
    document.getElementById("num_dropdown").remove();
    document.getElementById("run_bracket").remove();

    const no_dupes_list = removeDupes();
    random_sample = shuffle(shuffle(no_dupes_list)).slice(0, size);
    run_bracket(0);

}

function queryData(e) {


    if (e.keyCode == 13) {
        user = document.getElementById("username_text_box").value;
        document.getElementById("username_text_box").value = "";

        document.getElementById("run_bracket").disabled = true;

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

        addUserToList(user);
    }


}

function addUserToList(user) {
    var list_element = document.createElement("p");
    var list_value = document.createTextNode(user);
    list_element.appendChild(list_value);
    document.getElementById("user_list").appendChild(list_element);
}

function selectSize() {
    size = document.getElementById("num_dropdown").value;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



