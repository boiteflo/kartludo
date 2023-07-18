const {google} = require('googleapis');

class helperGoogleApi {
  
static async authSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}

  static async getSheetMultipleContent(sheets, spreadsheetId, ranges) {
    let result = {};

    for(let i= 0; i< ranges.length; i++){
      const range = ranges[i];
      let  sheetName = range.split('!')[0];
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
      result[sheetName] = res.data.values;
    }

    return result;
  }
  
  
  static async updateSheet(sheets, spreadsheetId, range, value) {
    let params= {
      spreadsheetId: spreadsheetId,
      valueInputOption: "USER_ENTERED",
      range: range,
      resource: {
        values: [[value]],
      }
    };
    let response= await sheets.spreadsheets.values.update(params);
    //console.log(response);
    return response;
  }
  
}

module.exports = helperGoogleApi;
