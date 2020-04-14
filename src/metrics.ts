import * as core from '@actions/core'
import * as github from '@actions/github'
import {IRepoMetric} from './interfaces/IRepoMetric'
import {ReposGetResponse} from '@octokit/rest'

export class Metrics {
  private githubToken: string
  private octokit: github.GitHub

  constructor() {
    this.githubToken = core.getInput('githubToken')
    this.octokit = new github.GitHub(this.githubToken)
  }

  async get(): Promise<IRepoMetric> {
    core.info('Retrieving repo metrics')

    const repo = await this.getRepo()

    //const totals = await this.getRepoTotals()

    const repoMetric: IRepoMetric = {
      name: github.context.repo.repo,
      url: repo.html_url,

      issues: repo.open_issues_count,
      forks: repo.forks_count,
      stars: repo.stargazers_count,
      watchers: repo.watchers_count,
      views: 0,
      pullRequests: 0,
      contributors: 0,
      commits: 0,

      totalPullRequests: 0,
      totalIssues: 0
    }

    core.info(JSON.stringify(repoMetric))
    core.info('Retrieving repo metrics complete')

    return repoMetric
  }

  private async getRepo(): Promise<ReposGetResponse> {
    return (
      await this.octokit.repos.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
      })
    ).data
  }

  private async getRepoTotals(): Promise<undefined> {
    const totals = await this.octokit.graphql(this.repoTotalsQuery)
    if (totals) {
      core.info(JSON.stringify(totals))
    }
    return undefined
    // return totals ? totals.data : null
  }

  private repoTotalsQuery = `
  query {
    repository(owner: "${github.context.repo.owner}", name:"${github.context.repo.repo}") {
      totalIssues: issues() {
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
    }
  }`
}
