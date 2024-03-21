"use strict";

module.exports = (userData)=>{

 return new Promise((resolve)=>{

     // On va vérifier que les données qui transitent sont bien des string, ou au pire des booléens

     // Et qu'ils ne contiennent pas de caractéres spéciaux capable d'occasionner une nosql injection

     // Pour ce faire premiérement on vérifie que c'est bien un objet de la forme
     
     // { requestName: string, data: object } que l'on recoit

     if(typeof(userData) === "object" && userData.constructor === Object){

         // Deuxiémement on vérifie que c'est bien un objet contenant juste les 2 clés requestName et data
         const isContain2Keys = Object.keys(userData).every((value)=>{

             return value === "requestName" || value === "data";
         });
         
         if(isContain2Keys === true && Object.keys(userData).length === 2){

         // Troisiémement on verifie que la clé requestName contient bien un string et la clé data un objet
           if(typeof(Object.values(userData)[0]) === "string" && typeof(Object.values(userData)[1]) === "object" && Object.values(userData)[1].constructor === Object){

              // Quatriémement on verifie la presence de caractéres spéciaux pour empecher une nosql injection ou une xss
               let valuesDataObject = Object.values(userData)[1];

                   valuesDataObject = Object.values(valuesDataObject);

               // valuesDataObject  est un tableau contenant les valeurs des différentes clés de l'objet data de({ requestName: string, data: object })

               const isSpecialCharacter = valuesDataObject.some((value)=>{

                   // On insére la méthode toString() parcequ'il peut arriver que ce soit un booléen qu'on envoit comme valeur coté front-end
                   // old criterias we can return to that if something wrong
                   // value.toString().includes('$') || value.toString().includes('{') || value.toString().includes('}') || value.toString().includes('&&') || value.toString().includes('||') || value.toString().includes('%') || value.toString().includes('`') || value.toString().includes('<') || value.toString().includes('>');
                   return value.toString().includes('$') || value.toString().includes('&&') || value.toString().includes('||');

               });

               if(isSpecialCharacter === true){

                   // L'utilisateur a envoyé un caractére spécial pouvant causer une nosql injection ou une xss on bloque la requête
                   
                   return resolve({ Message:"caractère special interdit"});

               }else{

                   return resolve({Message:"Tout est ok"});
               }
            }else{

               return resolve({Message:"Erreur lors du traitement de votre requête, veuillez réessayer."});
           }
       }else{

           return resolve({Message:"Erreur lors du traitement de votre requête, veuillez réessayer."});
       }
     }else{

        return resolve({Message:"Erreur lors du traitement de votre requête, veuillez réessayer."});
     }
 });
};
