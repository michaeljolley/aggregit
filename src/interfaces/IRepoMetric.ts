export interface IRepoMetric {
  name: string
  url: string

  issues?: number
  forks?: number
  stars?: number
  watchers?: number
  pullRequests?: number
  contributors?: number
  totalPullRequests?: number
  totalIssues?: number
  healthPercentage?: number
  commits?: number
  // totalViews?: number
  // uniqueViews?: number

  codeOfConductExists?: boolean
  contributingExists?: boolean
  issueTemplateExists?: boolean
  pullRequestTemplateExists?: boolean
  licenseExists?: boolean
  readMeExists?: boolean
}
