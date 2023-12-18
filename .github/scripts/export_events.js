function importGitHubIssuesData() {
  // Replace these with your own values
  var owner = 'Dartle-Sports';
  var repo = 'slt-academy-web';
  var accessToken = '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'; // Replace with your GitHub access token

  // Fetch all issues (both open and closed)
  var issuesApiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues?state=all';
  var issuesResponse = UrlFetchApp.fetch(issuesApiUrl, {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
  var issuesData = JSON.parse(issuesResponse.getContentText());

  // Get the active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Clear the contents of the existing sheet
  sheet.clearContents();

  // Write headers for issue and timeline data
  var issueHeaders = ['Issue Number'];
  var timelineHeaders = ['Event', 'Commit ID', 'Label', 'Created At'];
  sheet.getRange(1, 1, 1, issueHeaders.length + timelineHeaders.length).setValues([issueHeaders.concat(timelineHeaders)]);

  var rowIndex = 2; // Start from the second row to leave space for headers

  // Iterate through each issue
  for (var i = 0; i < issuesData.length; i++) {
    var issue = issuesData[i];
    var issueNumber = issue.number;

    // Fetch timeline data for the current issue
    var timelineApiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/timeline';
    var timelineResponse = UrlFetchApp.fetch(timelineApiUrl, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    var timelineData = JSON.parse(timelineResponse.getContentText());

    // Iterate through each event in the timeline data
    for (var j = 0; j < timelineData.length; j++) {
      var timelineEvent = timelineD
