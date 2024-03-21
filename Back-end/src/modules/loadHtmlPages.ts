const loadFile = require("../helpers/loadFile.js");

module.exports = ()=>{

      return new Promise((resolve)=>{

          const filesPaths = ["administration/index.html", "administration/pages/home.html", "administration/pages/not-found.html"]; 

          Promise.all(filesPaths.map(loadFile)).then((result)=>{
            
               return resolve(result);

          }).catch((error)=>{

              return process.exit(1);
          })
      });          

};