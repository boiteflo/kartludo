class ServiceTemplate {
    static create(template, values, images) {
        let result = { 
            value: template, 
            texts: [], images: [], 
            values: values.split(';') 
        };
        template.split('\n').forEach(line => this.handleCommand(result, line, images));
        result.backgroundStyle = {background: "url('" + images[0] + "')"};
        return result;
    }

    static handleCommand(result, line, images) {
        const lineLower = line.toLowerCase().trim();

        if (lineLower.startsWith("template")) result.name = lineLower.replace("template ", "");
        if (lineLower.startsWith("text")) this.addText(result, line.replace("text ", ""));
        if (lineLower.startsWith("image")) this.addImage(result, line.replace("image ", ""), images);
    }

    static addText(result, line) {
        //text font:'bold 30px' top:190px text-align:center text-transform:uppercase
        let style = this.getLineStyle(line);
        let text = { line, style };
        result.texts.push(text);
    }

    static addImage(result, line, images) {
        //image top:2px left:2px right:2px
        let style = this.getLineStyle(line);
        const image = result.images.length +1 >= images.length ? "" : images[result.images.length+1];
        let img = { line, style, image};
        result.images.push(img);
    }

    static getLineStyle(line) {
        const result = {};
        let key = "";
        let value = "";
        let isKey = true;
        let isInsideApostrophe = false;

        for (let i = 0; i < line.length; i++) {
            let addThisChar = true;

            if (line[i] == "'") {
                addThisChar = false;
                isInsideApostrophe = !isInsideApostrophe;
            }
            else if (line[i] == ' ') {
                if (!isInsideApostrophe) {
                    addThisChar = false;
                    result[key] = value;
                    key = '';
                    value = '';
                    isKey = true;
                }
            }
            else if (line[i] == ':') {
                addThisChar = false;
                isKey = false;
            }

            if (addThisChar) {
                if (isKey) key += line[i];
                else value += line[i];
            }
        }
        
        if (key)
             result[key] = value;

        return result;
    }
}


export default ServiceTemplate;
