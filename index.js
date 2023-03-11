const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const server =  http.createServer(function(request, response){
    if(request.url === "/api/jokes" && request.method === "GET"){
        let allJokes = getAllJokes(request, response);
        response.writeHead(200, {"Content-type" : "text/json"});
        response.end(JSON.stringify(allJokes));
    }else if(request.url === "/api/jokes" && request.method === "POST"){
        let data = '';
        request.on('data', function(chunk){
            data += chunk;
        });
        request.on('data', function(chunk){
            addJoke(data);
        });
        response.writeHead(200);
        response.end();
    }else if(request.url.startsWith("/api/like")){
        const params = url.parse(request.url, true).query;
        if(addLikesOrDislikes(params, true)){
        response.writeHead(200);
        response.end();
        }else{
        response.writeHead(400);
        response.end();
        }
    }
    else if(request.url.startsWith("/api/dislike")){
        const params = url.parse(request.url, true).query;
        if(addLikesOrDislikes(params, false)){
        response.writeHead(200);
        response.end();
        }else{
        response.writeHead(400);
        response.end();
        }
}
})

server.listen(666);

function getAllJokes(request, response){
    let arraOfjokes = [];
    let pathFile = path.join(__dirname, "data");
    let data = fs.readdirSync(pathFile);
    for(let i = 0; i < data.length; i++){
        let pathToFile = path.join(pathFile, `${i}.json`);
        let jokeSring = fs.readFileSync(pathToFile, "utf-8");
        let joke = JSON.parse(jokeSring);
        arraOfjokes.push(joke);
    }
    return arraOfjokes;
}
function addJoke(jokeSring){
    let joke = JSON.parse(jokeSring);
    joke.likes = 0;
    joke.dislikes = 0;
    let pathToData = path.join(__dirname, "data");
    let pathToFile = path.join(pathToData, `${fs.readdirSync(pathToData).length}.json`);
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
}

function addLikesOrDislikes(params, check){
    if(isNaN(params.id)){
        return false;
    }
    
    const pathToData = path.join(__dirname, "data");
    const numberOfJokes = fs.readdirSync(pathToData).length;
    if(params.id < 0 || params.id >= numberOfJokes){
        return false;
    }
    let pathToFile = path.join(pathToData, `${params.id}.json`);
    let joke = JSON.parse(fs.readFileSync(pathToFile, "utf-8"));
    if(check){
        joke.likes++;
    }else{
        joke.dislikes++;
    }
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
        return true;
}