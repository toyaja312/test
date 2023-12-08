const fs = require('fs');
const fetch = require('node-fetch'); // Assuming you are running this in a Node.js environment

async function exportIssueData() {
    const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
    const repoName = process.env.GITHUB_REPOSITORY_NAME;
    const token = process.env.GITHUB_TOKEN;

    // Fetch open issues data using the GitHub API
    const openIssuesUrl = `https://api.github.com/repos/{repoOwner}/{repoName}/issues?state=open`;
    const openIssuesResponse = await fetch(openIssuesUrl, { headers: { Authorization: `Bearer ${token}` } });
    const openIssuesData = await openIssuesResponse.json();

    // Fetch closed issues data using the GitHub API
    const closedIssuesUrl = `https://api.github.com/repos/{repoOwner}/{repoName}/issues?state=closed`;
    const closedIssuesResponse = await fetch(closedIssuesUrl, { headers: { Authorization: `Bearer ${token}` } });
    const closedIssuesData = await closedIssuesResponse.json();

    // Combine open and closed issues data
    const allIssuesData = {
        open_issues: openIssuesData,
        closed_issues: closedIssuesData
    };

    // Export data to a JSON file
    fs.writeFileSync('issue_data.json', JSON.stringify(allIssuesData, null, 2));
}

const issueNumber = 1; // Replace with the actual issue or pull request number

const apiUrl = `https://api.github.com/repos/{repoOwner}/{repoName}/issues/{issueNumber}/events`;

fetch(apiUrl)
  .then(response => response.json())
  .then(events => {
    const labelChangeEvents = events.filter(event => event.event === 'labeled' || event.event === 'unlabeled');

    labelChangeEvents.forEach(event => {
      console.log(`Label "${event.label.name}" changed at: ${event.updated_at}`);
    });
  })
  .catch(error => console.error('Error fetching events:', error.message));

// Check if the script is run directly
if (require.main === module) {
    exportIssueData();
}
