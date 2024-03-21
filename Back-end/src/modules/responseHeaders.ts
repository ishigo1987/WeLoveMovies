"use strict";

module.exports = (res)=>{

    res.setHeader('Access-Control-Allow-Origin', 'https://www.magellan-transit.net'); // replace by real domain name

    res.setHeader('Access-Control-Allow-Methods', 'POST');

    res.setHeader("Access-Control-Allow-Credentials", 'true'); // But will be put to false for production

    // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, Accept"); 

    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src *; style-src fonts.googleapis.com 'self'; img-src * blob:"); // I need to check that

    res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains; preload'); // look this article https://www.tunetheweb.com/blog/dangerous-web-security-features/

    res.setHeader('X-XSS-Protection','1;mode=block');

    res.setHeader('X-Frame-Options','SAMEORIGIN');

    res.setHeader('X-Content-Type-Options','nosniff');

    res.setHeader('Connection', 'keep-alive');

    // All this headers came from this wonderful articles https://www.smashingmagazine.com/2017/04/secure-web-app-http-headers/
    
    // I need to check this https://www.w3.org/TR/2017/CR-referrer-policy-20170126/

    // req.setEncoding("utf-8");

    return true;
 
}