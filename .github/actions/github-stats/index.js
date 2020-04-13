const fetch = require("node-fetch");
const moment = require("moment");

let query = JSON.stringify({
  query: `
      query {
        repository(owner: "microsoft", name:"vscode") {
          openIssues: issues(states:OPEN) {
            totalCount
          }
          closedIssues: issues(states:CLOSED) {
            totalCount
          }
          openPRs: pullRequests(states:OPEN) {
            totalCount
          }
          closedPRs: pullRequests(states:CLOSED) {
            totalCount
          }
          mergedPRs: pullRequests(states:MERGED) {
            totalCount
          }
          stargazers {
            totalCount
          }
        }
      }`,
});
