class ServiceTemplate {
    static createFromCsv(template, values) {
        let result = {
            value: template,
            texts: [], images: []
        };
        const textNumbers = template.split('\n').filter(x => x.startsWith("text")).length;
        const images = values.slice(textNumbers);
        result.backgroundStyle = images[0];
        template.split('\n').forEach(line => this.handleCommand(result, line, images));
        result.images = result.images.map(x => x.style);
        const texts = values;
        result.texts.forEach((x, i) => x.text = texts[i]);
        return result;
    }

    static create(template, images) {
        let result = {
            value: template,
            texts: [], images: []
        };
        template.split('\n').forEach(line => this.handleCommand(result, line, images));
        result.backgroundStyle = { 'background-image': "url('" + images[0] + "')" };
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
        const image = result.images.length + 1 >= images.length ? "" : images[result.images.length + 1];
        let style = { 'background-image': "url('" + image + "')", ...this.getLineStyle(line) };
        let img = { line, style };
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

    static parseCSV(csvContent, csvImages) {
        const rows = [];
        let currentLine = '';
        let insideQuotes = false;
        if (!csvContent)
            return null;

        for (let i = 0; i < csvContent.length; i++) {
            const char = csvContent[i];
            const nextChar = csvContent[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') { // Vérifier si le guillemet est un guillemet d'échappement ("")
                    currentLine += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === '\n' && !insideQuotes) {
                rows.push(currentLine.split('\t'));
                currentLine = '';
            } else {
                currentLine += char;
            }
        }

        if (currentLine) {
            rows.push(currentLine.split('\t'));
        }

        return this.addTemplates(rows, csvImages);
    }

    static addTemplates(lines, csvImages) {
        var currentTemplate = '';

        return lines.map(x => {
            if (x[0] == "template")
                currentTemplate = x[2];
            else
                return { template: currentTemplate, values: x.map(y=> this.getValueOrImage(y, csvImages)) };
        }).filter(x => x);
    }

    static getValueOrImage(value, csvImages) {
        if (!value) return '';
        const key = value.substring(1);
        if (!value.startsWith('@'))
            return value;
        const item = csvImages.find(x => x.key == key);
        return item ? item.value : value;
    }
}


export default ServiceTemplate;
