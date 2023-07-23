class helperJs {
    static saveFile(name, content) {
        const link = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = name;
        link.click();
        URL.revokeObjectURL(link.href);
    }
  }
 
  module.exports = helperJs;
