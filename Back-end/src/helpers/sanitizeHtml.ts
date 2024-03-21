"use stict";

 /** 
   * This helper take an array of object entries and return an array of the same object but with his values sanitize
   * @param {arrayOfEntries} array
   * @return {Promise} 
*/

module.exports = (arrayOfEntries)=>{

    const sanitizeHTML = require("sanitize-html");

    return new Promise((resolve, reject)=>{

        function sanitizeOneEntry(oneEntry){

            return new Promise((resolve)=>{  

                 const endEntry = sanitizeHTML(oneEntry[1], {

                        allowedTags: [],
                        allowedAttributes: {},
                        disallowedTagsMode: "escape"
                 });

                 return resolve([oneEntry[0], endEntry]);

            });
        }

        Promise.all(arrayOfEntries.map(sanitizeOneEntry)).then((result)=>{
            
             return resolve(result);
            
        })

    })


}