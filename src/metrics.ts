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
    const community = await githubApi.getCommunity(octokit, github.context)
    // const participation = await githubApi.getParticipation(
    //   octokit,
    //   github.context,
    //   this.metricDate
    // )
    // const traffic = await githubApi.getTraffic(octokit, github.context)

    // Unless we've successfully gathered all metrics, don't
    // record metrics
    if (repo && totals && community) {
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
        pullRequests: totals.repository.openPRs.totalCount,
        contributors: totals.repository.contributors.totalCount,
        healthPercentage: community.health_percentage,
        totalPullRequests: prCount,
        totalIssues: issueCount,
        // commits: participation,
        // totalViews: todaysViews.count,
        // uniqueViews: todaysViews.uniques,

        codeOfConductExists: community.files.code_of_conduct ? true : false,
        contributingExists: community.files.contributing ? true : false,
        issueTemplateExists: community.files.issue_template ? true : false,
        pullRequestTemplateExists: community.files.pull_request_template
          ? true
          : false,
        licenseExists: community.files.license ? true : false,
        readMeExists: community.files.readme ? true : false
      }

      core.info('Retrieving repo metrics complete')

      return repoMetric
    } else {
      return undefined
    }
  }
}
