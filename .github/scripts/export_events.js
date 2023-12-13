function fetchGitHubIssueData(owner, repo, issueNumber) {
  var apiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber;
  var response = UrlFetchApp.fetch(apiUrl);
  return JSON.parse(response.getContentText());
}

function fetchGitHubIssueTimeline(owner, repo, issueNumber) {
  var apiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/timeline';
  var response = UrlFetchApp.fetch(apiUrl);
  return JSON.parse(response.getContentText());
}

function updateGoogleSheet(sheetId, apiKey, issueData, issueTimeline) {
  // Assuming 'title' is available in issueData and 'event' is available in issueTimeline
  var values = [[issueData.title, issueTimeline.event]];
  var range = 'Sheet1!A1:B1';  // Update with the desired range

  var apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/' + range + '?key=' + apiKey;

  var params = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify({ values: values }),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(apiUrl, params);
  return JSON.parse(response.getContentText());
}

function run() {
  var owner = process.env.OWNER;  // You need to set up Environment Variables in Google Apps Script
  var repo = process.env.REPO;
  var issueNumber = process.env.ISSUE_NUMBER;
  var sheetId = process.env.SHEET_ID;
  var apiKey = process.env.GOOGLE_API_KEY;

  var issueData = fetchGitHubIssueData(owner, repo, issueNumber);
  var issueTimeline = fetchGitHubIssueTimeline(owner, repo, issueNumber);

  var updateResult = updateGoogleSheet(sheetId, apiKey, issueData, issueTimeline);

  Logger.log('Data imported successfully:', updateResult);
}
