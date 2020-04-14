import * as core from '@actions/core'
import * as github from '@actions/github'
import {IGraphQLResponse, IRepoMetric} from './interfaces'
import {
  ReposGetParticipationStatsResponse,
  ReposGetResponse,
  ReposGetViewsResponse
} from '@octokit/rest'

export class Metrics {
  private githubToken: string
  private octokit: github.GitHub

  constructor() {
    this.githubToken = core.getInput('githubToken')
    this.octokit = new github.GitHub(this.githubToken)
  }

  async get(): Promise<IRepoMetric | undefined> {
    core.info('Retrieving repo metrics')

    const repo = await this.getRepo()

    const totals = await this.getRepoTotals()
    const participation = await this.getParticipation()
    //const traffic = await this.getTraffic()

    core.info(JSON.stringify(repo))
    core.info(JSON.stringify(totals))
    core.info(JSON.stringify(participation))

    // Unless we've successfully gathered all metrics, don't
    // record metrics
    if (repo && totals && participation) {
      // && traffic) {
      const prCount =
        totals.repository.closedPRs.totalCount +
        totals.repository.mergedPRs.totalCount +
        totals.repository.openPRs.totalCount
      const issueCount =
        totals.repository.openIssues.totalCount +
        totals.repository.closedIssues.totalCount

      const todaysViews = {
        count: 0,
        uniques: 0
      }
      // traffic.views.length > 0
      //   ? traffic.views[traffic.views.length - 1]
      //   : {
      //       count: 0,
      //       uniques: 0
      //     }

      const repoMetric: IRepoMetric = {
        name: github.context.repo.repo,
        url: repo.html_url,

        issues: repo.open_issues_count,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        totalViews: todaysViews.count,
        uniqueViews: todaysViews.uniques,
        pullRequests: totals.repository.openPRs.totalCount,
        contributors: totals.repository.contributors.totalCount,
        commits: participation?.all.reduce((p, c) => p + c),

        totalPullRequests: prCount,
        totalIssues: issueCount
      }

      core.info(JSON.stringify(repoMetric))
      core.info('Retrieving repo metrics complete')

      return repoMetric
    } else {
      return undefined
    }
  }

  private async getRepo(): Promise<ReposGetResponse | undefined> {
    try {
      return (
        await this.octokit.repos.get({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        })
      ).data
    } catch (err) {
      core.error(`Error getting repo: ${err}`)
      return undefined
    }
  }

  private async getRepoTotals(): Promise<IGraphQLResponse | undefined> {
    try {
      const totals = await this.octokit.graphql(this.repoTotalsQuery)
      return totals ? totals.data : undefined
    } catch (err) {
      core.error(`Error getting repo totals: ${err}`)
      return undefined
    }
  }

  private repoTotalsQuery = `
  query {
    repository(owner: "${github.context.repo.owner}", name:"${github.context.repo.repo}") {
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
      contributors: collaborators(affiliation:ALL) {
        totalCount
      }
    }
  }`

  private async getParticipation(): Promise<
    ReposGetParticipationStatsResponse | undefined
  > {
    try {
      return (
        await this.octokit.repos.getParticipationStats({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        })
      ).data
    } catch (err) {
      core.error(`Error getting participation: ${err}`)
      return undefined
    }
  }

  private async getTraffic(): Promise<ReposGetViewsResponse | undefined> {
    return undefined
    // try {
    //   return (
    //     await this.octokit.repos.getViews({
    //       owner: github.context.repo.owner,
    //       repo: github.context.repo.repo
    //     })
    //   ).data
    // } catch (err) {
    //   core.error(`Error getting traffic: ${err}`)
    //   return undefined
    // }
  }
}
