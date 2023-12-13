function importGitHubIssuesData() {
  // Replace these with your own values
  var owner = 'OWNER';
  var repo = 'REPO';
  var issueNumber = 'ISSUE_NUMBER';

  // Fetch issue data
  var issueApiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber;
  var issueResponse = UrlFetchApp.fetch(issueApiUrl);
  var issueData = JSON.parse(issueResponse.getContentText());

  // Fetch timeline data
  var timelineApiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/timeline';
  var timelineResponse = UrlFetchApp.fetch(timelineApiUrl);
  var timelineData = JSON.parse(timelineResponse.getContentText());

  // Create a new Google Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('GitHub Issues Data');

  // Write issue headers
  var issueHeaders = Object.keys(issueData);
  sheet.getRange(1, 1, 1, issueHeaders.length).setValues([issueHeaders]);

  // Write issue data
  var issueValues = [issueHeaders.map(function (header) {
    return issueData[header];
  })];
  sheet.getRange(2, 1, 1, issueHeaders.length).setValues(issueValues);

  // Write timeline headers
  var timelineHeaders = Object.keys(timelineData[0]);
  sheet.getRange(4, 1, 1, timelineHeaders.length).setValues([timelineHeaders]);

  // Write timeline data
  var timelineValues = timelineData.map(function (item) {
    return timelineHeaders.map(function (header) {
      return item[header];
    });
  });
  sheet.getRange(5, 1, timelineValues.length, timelineHeaders.length).setValues(timelineValues);

  Logger.log('Data imported successfully.');
}
