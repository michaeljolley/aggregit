import * as core from '@actions/core'
import * as github from '@actions/github'
import * as githubApi from './github-api'
import {IRepoMetric} from './interfaces'

export class Metrics {
  constructor(private metricDate: Date) {}

  async get(
    octokit: github.GitHub,
    repoMetric: IRepoMetric
  ): Promise<IRepoMetric | undefined> {
    core.info('Retrieving metrics')

    try {
      const totals = await githubApi.getRepoTotals(octokit, github.context)
      if (totals === undefined) return undefined
      core.info('  - Retrieved totals')

      const community = await githubApi.getCommunity(octokit, github.context)
      if (community === undefined) return undefined
      core.info('  - Retrieved community data')

      const participation = await githubApi.getParticipation(
        octokit,
        github.context,
        this.metricDate
      )
      if (participation === undefined) return undefined
      core.info('  - Retrieved commits')

      const traffic = await githubApi.getTraffic(octokit, github.context)
      if (traffic === undefined) return undefined
      core.info('  - Retrieved traffic')

      const prCount =
        totals.repository.closedPRs.totalCount +
        totals.repository.mergedPRs.totalCount +
        totals.repository.openPRs.totalCount
      const issueCount =
        totals.repository.openIssues.totalCount +
        totals.repository.closedIssues.totalCount

      repoMetric.pullRequests = totals.repository.openPRs.totalCount
      repoMetric.contributors = totals.repository.contributors.totalCount
      repoMetric.healthPercentage = community.health_percentage
      repoMetric.totalPullRequests = prCount
      repoMetric.totalIssues = issueCount
      repoMetric.commits = participation
      repoMetric.totalViews = traffic.count
      repoMetric.uniqueViews = traffic.uniques
      repoMetric.codeOfConductExists = community.files.code_of_conduct
        ? true
        : false
      repoMetric.contributingExists = community.files.contributing
        ? true
        : false
      repoMetric.issueTemplateExists = community.files.issue_template
        ? true
        : false
      repoMetric.pullRequestTemplateExists = community.files
        .pull_request_template
        ? true
        : false
      repoMetric.licenseExists = community.files.license ? true : false
      repoMetric.readMeExists = community.files.readme ? true : false

      core.info('Retrieving metrics complete')
    } catch (err) {
      core.setFailed(err)
      return undefined
    }

    return repoMetric
  }
}
