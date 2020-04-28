export interface IGraphQLResponse {
  repository: IGraphQLRepository
}

interface IGraphQLRepository {
  openIssues: IGraphQLCounter
  closedIssues: IGraphQLCounter
  openPRs: IGraphQLCounter
  closedPRs: IGraphQLCounter
  mergedPRs: IGraphQLCounter
  contributors: IGraphQLCounter
  healthPercentage: IGraphQLCounter

  codeOfConductExists: IGraphQLBoolean
  contributingExists: IGraphQLBoolean
  issueTemplateExists: IGraphQLBoolean
  pullRequestTemplateExists: IGraphQLBoolean
  licenseExists: IGraphQLBoolean
  readMeExists: IGraphQLBoolean
}

interface IGraphQLCounter {
  totalCount: number
}

interface IGraphQLBoolean {
  exists: boolean
}
