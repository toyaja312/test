const axios = require('axios');

async function fetchGitHubIssueData(owner, repo, issueNumber) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
  const response = await axios.get(apiUrl);
  return response.data;
}

async function fetchGitHubIssueTimeline(owner, repo, issueNumber) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/timeline`;
  const response = await axios.get(apiUrl);
  return response.data;
}

async function updateGoogleSheet(sheetId, apiKey, issueData, issueTimeline) {
  // Assuming 'title' is available in issueData and 'event' is available in issueTimeline
  const values = [[issueData.title, issueTimeline.event]]; 
  const range = 'A1:B1';  // Update with the desired range

  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

  const response = await axios.put(apiUrl, { values, range });
  return response.data;
}

async function run() {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const issueNumber = process.env.ISSUE_NUMBER;
  const sheetId = process.env.SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  const issueData = await fetchGitHubIssueData(owner, repo, issueNumber);
  const issueTimeline = await fetchGitHubIssueTimeline(owner, repo, issueNumber);

  const updateResult = await updateGoogleSheet(sheetId, apiKey, issueData, issueTimeline);

  console.log('Data imported successfully:', updateResult);
}

run().catch(error => {
  console.error('Error importing data:', error);
  process.exit(1);
});
