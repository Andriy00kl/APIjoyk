const fs = require('fs');
const path = require('path');
const http = require('http');

const server =  http.createServer(function(request, response){
    if(request.url === "/api/jokes" && request.method === "GET"){
        let allJokes = getAllJokes(request, response);
        response.writeHead(200, {"Content-type" : "text/json"});
        response.end(JSON.stringify(allJokes));
    }else if(request.url === "/api/jokes" && request.method === "POST"){
        let data = '';
        request.on('data', function(chunk){
            data += chunk;
        })
        request.on('data', function(chunk){
            addJoke(data);
        })
        response.writeHead(200);
        response.end();
    }
})

server.listen(666);

function getAllJokes(request, response){
    let arraOfjokes = [];
    let pathFile = path.join(__dirname, "data");
    let data = fs.readdirSync(pathFile);
    for(let i = 0; i < data.length; i++){
        let pathToFile = path.join(pathFile, `${i}.json`)
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
    let pathToFile = path.join(pathToData, `${fs.readdirSync(pathToData).length}.json`)
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
}