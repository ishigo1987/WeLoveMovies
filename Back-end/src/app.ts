"use strict";

let nodeProcess: { [key: string]: any };

nodeProcess = require("node:process");

const PORT:string = nodeProcess?.env?.PORT;

// const server = require("./modules/createHttpServer.ts")();

// const httpServer = require("./modules/httpServer.ts");


/* before the server initialization we load the page index.html */

// const loadHtmlPages = require("./modules/loadHtmlPages.ts");

// loadHtmlPages().then((response)=>{

//      global.indexHtml = response[0]; // index.html

//      global.homeHtml = response[1]; // home.html

//      global.notFoundHTML = response[2]; // not-found html

//      server.on("request", httpServer);

//      return server.listen(PORT);  

// });

// server.on('timeout', (msg)=>{
//    // console.log("Timeout check the message argument dumb ass")
// });


