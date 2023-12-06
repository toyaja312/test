import os
import requests
import json

def export_issue_data():
    repo_owner = os.getenv("GITHUB_REPOSITORY_OWNER")
    repo_name = os.getenv("GITHUB_REPOSITORY_NAME")
    token = os.getenv("GITHUB_TOKEN")

    # Fetch open issues data using the GitHub API
    open_issues_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues?state=open"
    open_issues_response = requests.get(open_issues_url, headers={"Authorization": f"Bearer {token}"})
    open_issues_data = open_issues_response.json()

    # Fetch closed issues data using the GitHub API
    closed_issues_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues?state=closed"
    closed_issues_response = requests.get(closed_issues_url, headers={"Authorization": f"Bearer {token}"})
    closed_issues_data = closed_issues_response.json()

    # Combine open and closed issues data
    all_issues_data = {
        "open_issues": open_issues_data,
        "closed_issues": closed_issues_data
    }

    # Export data to a JSON file
    with open("issue_data.json", "w") as json_file:
        json.dump(all_issues_data, json_file)

if __name__ == "__main__":
    export_issue_data()
