const axios = require('axios');

async function fetchGitHubIssuesData(owner, repo, issueNumber) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/timeline`;
  const response = await axios.get(apiUrl);
  return response.data;
}

async function updateGoogleSheet(sheetId, apiKey, data) {
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

  const values = data.map(item => Object.values(item));
  const range = 'A1';  // Update with the desired range

  const response = await axios.put(apiUrl, { values, range });
  return response.data;
}

async function run() {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const issueNumber = process.env.ISSUE_NUMBER;
  const sheetId = process.env.SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  const issuesData = await fetchGitHubIssuesData(owner, repo, issueNumber);
  const updateResult = await updateGoogleSheet(sheetId, apiKey, issuesData);

  console.log('Data imported successfully:', updateResult);
}

run().catch(error => {
  console.error('Error importing data:', error);
  process.exit(1);
});
