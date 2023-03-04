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
        })
        request.on('data', function(chunk){
            addJoke(data);
        })
        response.writeHead(200);
        response.end();
    }else if(request.url.startsWith("/api/like")){
        const params = url.parse(request.url, true).query;
        if(params.id === undefined){
            response.writeHead(400);
            response.end(); 
        }
        if(isNaN(params.id)){
            response.writeHead(400);
            response.end();
        }
        const pathToData = path.join(__dirname, "data");
        const numberOfJokes = fs.readdirSync(pathToData).length;
        if(params.id < 0 || params.id >= numberOfJokes){
            response.writeHead(400);
            response.end();
        }
        let pathToFile = path.join(pathToData, `${params.id}.json`);
        let joke = JSON.parse(fs.readFileSync(pathToFile, "utf-8"));
        joke.likes++;
        fs.writeFileSync(pathToFile, JSON.stringify(joke));
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
    let pathToFile = path.join(pathToData, `${fs.readdirSync(pathToData).length}.json`);
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
}