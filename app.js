function reqListener() {
    console.log(this.responseText);
}

function thingymajiggy(user) {

    console.log(user);

    const body = {
        query:"query ($name:String) {MediaListCollection(userName:$name, type:ANIME) {lists {name entries {media {title {romaji, english} characters {edges {role}, nodes {name{full}, gender, favourites, image{large}}}}}}}}",
        variables: {
            name:user
        }
    }
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", reqListener);
    xhr.open("POST", "https://graphql.anilist.co");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

}



