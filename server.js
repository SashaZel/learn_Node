//const http = require("http");
import http from "http";
import url from "url";
import fs from 'node:fs'
import { readFile } from 'node:fs/promises';

async function readMyData () {
    try {
    //const filePath = new URL('./my-data.json', import.meta.url);
    const filePath = new URL('./db.json', import.meta.url);
    const contents = await readFile(filePath, { encoding: 'utf8' });
    const allLettersRaw = JSON.parse(contents);
    console.log('call readMyData() ', allLettersRaw[1]);

    const foldersList = [];
    for (let i = 0; i < allLettersRaw.length; i++ ) {
      const folderName = allLettersRaw[i].folder;
      //console.log(folderName);
      if (foldersList.includes(folderName)) continue;
      foldersList.push(allLettersRaw[i].folder);
    }

    // const avatarData = allLettersRaw[0].to[0].avatar.split(',')[1];
    // //console.log(" allLettersRaw ", avatarData);
    // const buffer = Buffer.from(avatarData, "base64");
    // fs.writeFileSync("new-path.png", buffer);

    // const picData = allLettersRaw[0].doc.img.split(',')[1];
    // //console.log(" allLettersRaw ", avatarData);
    // const bufferPic = Buffer.from(picData, "base64");
    // fs.writeFileSync("img/new-pic.jpg", bufferPic);
    
    return { letters:allLettersRaw, folders: foldersList };
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

const appData = new Promise ((response, reject) => {
  response(readMyData());
})



http
  .createServer(function(request, response) {

    const queryObject = url.parse(request.url, true).query;
    //console.log("@request_query", queryObject);
    //console.log("request received");

    async function sendResponse () {
        const readedData = await appData;
        if (!readedData) return;
        //response.end(readedData[queryObject.name], "utf-8");
        response.end(readedData.folders[0], "utf-8");
    }
    
    sendResponse();
    
  })
  .listen(3000);
console.log("server started");