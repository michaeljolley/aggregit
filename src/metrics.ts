import * as core from '@actions/core'
import * as github from '@actions/github'
import {IRepoMetric} from './interfaces'
import * as githubApi from './github-api'

const githubToken: string = core.getInput('githubToken')
const octokit: github.GitHub = new github.GitHub(githubToken)

export class Metrics {
  constructor(private metricDate: Date) {}

  async get(): Promise<IRepoMetric | undefined> {
    core.info('Retrieving repo metrics')

    const repo = await githubApi.getRepo(octokit, github.context)
    const totals = await githubApi.getRepoTotals(octokit, github.context)
    // const participation = await githubApi.getParticipation(
    //   octokit,
    //   github.context,
    //   this.metricDate
    // )
    // const traffic = await githubApi.getTraffic(octokit, github.context)

    // Unless we've successfully gathered all metrics, don't
    // record metrics
    if (repo && totals) {
      //  && participation && traffic
      const prCount =
        totals.repository.closedPRs.totalCount +
        totals.repository.mergedPRs.totalCount +
        totals.repository.openPRs.totalCount
      const issueCount =
        totals.repository.openIssues.totalCount +
        totals.repository.closedIssues.totalCount

      // const todaysViews =
      //   traffic.views.length > 0
      //     ? traffic.views[traffic.views.length - 1]
      //     : {
      //         count: 0,
      //         uniques: 0
      //       }

      const repoMetric: IRepoMetric = {
        name: github.context.repo.repo,
        url: repo.html_url,

        issues: repo.open_issues_count,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        // totalViews: todaysViews.count,
        // uniqueViews: todaysViews.uniques,
        pullRequests: totals.repository.openPRs.totalCount,
        contributors: totals.repository.contributors.totalCount,
        // commits: participation,

        totalPullRequests: prCount,
        totalIssues: issueCount
      }

      core.info('Retrieving repo metrics complete')

      return repoMetric
    } else {
      return undefined
    }
  }
}
