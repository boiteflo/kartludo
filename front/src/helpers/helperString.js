class helperString {
    static includesX2(str) {
        return str.toLowerCase().startsWith("x2") || str.toLowerCase().endsWith("x2");
      }

      static cleanup(str) {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
      }

      static removeX2(str) {
          if(str.toLowerCase().startsWith("x2"))
              return str.substring(2);
          else if(str.toLowerCase().endsWith("x2"))
              return str.substring(0, str.length-2);
          else
              return str.substring(0);
      }
  }
 
  module.exports = helperString;
