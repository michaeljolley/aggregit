export interface IRepoMetric {
  name: string
  url: string

  issues: number
  forks: number
  stars: number
  watchers: number
  pullRequests: number
  contributors: number
  // commits: number

  totalViews: number
  uniqueViews: number

  totalPullRequests: number
  totalIssues: number
}
