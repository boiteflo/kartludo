

class helperJsonFile {
 
    static exists= (file) => {
      const fs = require('fs');
      const result = fs.existsSync(`./${file}`);
      return result;
    };
  
    static save= (file, content) => {
      return this.savePath(`./${file}`, content);
    }
  
    static savePath= (file, content) => {
      return new Promise((resolve, reject) => {
        let fs = require('fs');
        fs.writeFile(file, content, err => {
          if (err) {
              console.log('Error writing file : ' + file, err)
              reject('Error writing file : ' + err);
          } else {
              console.log('Successfully wrote file : ' + file)
              resolve('Successfully wrote file : ' + file);
          }
        })
      });
    };
     
    static read= (file) => {
      return this.readPath(`./${file}`);
    };
    
    static readPath= (filepath) => {
      return new Promise((resolve, reject) => {      
        let fs = require('fs');
        fs.readFile(filepath, "utf8", (err, jsonString) => {
          if (err) {
            console.log("Error reading file from disk:", err);
            reject("Error reading file from disk:" + err);
            return;
          }
          try {
            console.log("Successfully read file : " + filepath);
            resolve(jsonString);
          } catch (err) {
            console.log("Error parsing JSON string:", err);
            reject("Error parsing JSON string:" + err);
          }
        });
      });
    };
  }
   
    module.exports = helperJsonFile;
   
  