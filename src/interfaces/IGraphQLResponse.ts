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
}

interface IGraphQLCounter {
  totalCount: number
}
