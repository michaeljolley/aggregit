export interface IRepoMetric {
  name: string
  url: string

  issues: number
  forks: number
  stars: number
  watchers: number
  views: number
  pullRequests: number
  contributors: number
  commits: number

  totalPullRequests: number
  totalIssues: number
}
