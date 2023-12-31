function importGitHubIssuesData() {
  // Replace these with your own values
  var owner = 'Dartle-Sports';
  var repo = 'slt-academy-web';

  // Fetch all issues (both open and closed)
  var issuesApiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues?state=all';
  var issuesResponse = UrlFetchApp.fetch(issuesApiUrl);
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
    var timelineResponse = UrlFetchApp.fetch(timelineApiUrl);
    var timelineData = JSON.parse(timelineResponse.getContentText());

    // Iterate through each event in the timeline data
    for (var j = 0; j < timelineData.length; j++) {
      var timelineEvent = timelineData[j];

      // Extract specific fields from timeline event and add the issue number
      var timelineEventValues = [
        issueNumber,
        timelineEvent.event,
        timelineEvent.commit_id,
        (timelineEvent.label && timelineEvent.label.name) || '', // assuming label is an object with a 'name' property
        timelineEvent.created_at
      ];

      // Write timeline event data
      sheet.getRange(rowIndex, 1, 1, timelineEventValues.length).setValues([timelineEventValues]);

      rowIndex++; // Move to the next row
    }
  }

  Logger.log('Data imported successfully.');
}
