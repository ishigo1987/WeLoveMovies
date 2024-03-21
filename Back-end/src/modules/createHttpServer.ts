"use strict";
module.exports = ()=>{

   // Here we need to create a https server
   // http will be change to https
   
   const http = require('node:http');

   const server = http.createServer();

   server.headersTimeout = 5000;

   server.maxHeadersCount = 0;

   server.keepAliveTimeout = 120000;

   server.requestTimeout = 10000;

   server.timeout = 0;
   
   return server;
};
