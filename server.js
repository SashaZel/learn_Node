//const http = require("http");
import http from "http";
import url from "url";
import { readFile } from 'node:fs/promises';

async function readMyData () {
    try {
    const filePath = new URL('./my-data.json', import.meta.url);
    const contents = await readFile(filePath, { encoding: 'utf8' });
    const myData = JSON.parse(contents);
    //console.log(contents);
    //console.log("@myData ", myData.a);
    return myData;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}



http
  .createServer(function(request, response) {

    const queryObject = url.parse(request.url, true).query;
    //console.log("@request_query", queryObject);
    //console.log("request received");

    async function sendResponse () {
        const readedData = await readMyData();
        if (!readedData || !queryObject.name) return;
        response.end(readedData[queryObject.name], "utf-8");
    }
    
    sendResponse();
    
  })
  .listen(3000);
console.log("server started");