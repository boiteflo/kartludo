class helperString {
    static replaceAll = function(str, searchTxt, replaceTxt) {
        const regex = new RegExp(searchTxt, 'g');
        return str.replace(regex, replaceTxt) ;
    }

    static includesX2(str) {
        return str.toLowerCase().startsWith("x2") || str.toLowerCase().endsWith("x2");
    }
    static includesX3(str) {
        return str.toLowerCase().startsWith("x3") || str.toLowerCase().endsWith("x3");
    }

      static cleanup(str) {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
      }

      static removeX2(str) {
        return this.removeX(str, '2');
      }
      static removeX3(str) {
        return this.removeX(str, '3');
      }

      static removeX(str, key) {
          if(str.toLowerCase().startsWith("x" + key))
              return str.substring(2);
          else if(str.toLowerCase().endsWith("x" + key))
              return str.substring(0, str.length-2);
          else
              return str.substring(0);
      }

      static formatInt(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
      }
      

      static cut(str, cutChars) {
        let indexes = [];
        for (let i = 0; i < cutChars.length; i++) {
          indexes.push(str.indexOf(cutChars.charAt(i)));
        }
        indexes = indexes.filter(x=> x && x >=0);

        let cutIndex = indexes.length < 1 ? str.length : Math.min(...indexes);
        return str.substring(0, cutIndex);
    }
  }
 
  module.exports = helperString;
