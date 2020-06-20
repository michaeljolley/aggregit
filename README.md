# aggregit

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

This action gathers metrics about the repository and loads them to a Firebase database that you specify.

> Repo metrics will be saved into a collection named `repos`.

## Inputs

### `githubToken`

**Required** GitHub secret token. Should provide `${{ secrets.GITHUB_TOKEN }}`

### `project_id`

**Required** Firebase project id provided in your Firebase Admin SDK private key JSON file.

### `private_key`

**Required** Firebase private key provided in your Firebase Admin SDK private key JSON file.

### `client_email`

**Required** Firebase client email provided in your Firebase Admin SDK private key JSON file.

### `firebaseDbUrl`

**Required** Url of your Firebase database.

## Example usage

```yaml
uses: michaeljolley/aggregit@v1
with:
  githubToken: ${{ secrets.GITHUB_TOKEN }}
  project_id: ${{ secrets.project_id }}
  private_key: ${{ secrets.private_key }}
  client_email: ${{ secrets.client_email }}
  firebaseDbUrl: ${{ secrets.firebaseDbUrl }}
```

## Sample data

The following schema represents the data that will be saved for each repo document in the Firebase database.

```JS
{
    name: 'repoName',
    url: 'https://github.com/owner/repoName',
    contributors:  {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    issues: {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    forks: {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    pullRequests: {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    stars:  {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    watchers:  {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    totalIssues:  {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    totalPullRequests: {
        '2020-04-14': 4,
        '2020-04-15': 3
    },
    healthPercentage: {
        '2020-04-14': 64,
        '2020-04-15': 83
    },
    commits: {
        '2020-04-14': 4,
        '2020-04-15': 6
    },
    codeOfConductExists: {
        '2020-04-14': false,
        '2020-04-15': true
    },
    contributingExists: {
        '2020-04-14': true,
        '2020-04-15': true
    },
    issueTemplateExists: {
        '2020-04-14': false,
        '2020-04-15': false
    },
    pullRequestTemplateExists: {
        '2020-04-14': false,
        '2020-04-15': true
    },
    licenseExists: {
        '2020-04-14': true,
        '2020-04-15': true
    },
    readMeExists: {
        '2020-04-14': true,
        '2020-04-15': true
    }
}
```
