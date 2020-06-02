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
    core.info('Retrieving repo metrics')

    try {
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
      if (totals && community) {
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
        repoMetric.pullRequests = totals.repository.openPRs.totalCount
        repoMetric.contributors = totals.repository.contributors.totalCount
        repoMetric.healthPercentage = community.health_percentage
        repoMetric.totalPullRequests = prCount
        repoMetric.totalIssues = issueCount
        // commits: participation
        // totalViews: todaysViews.count
        // uniqueViews: todaysViews.uniques
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

        core.info('Retrieving repo metrics complete')
      }
    } catch (err) {
      core.setFailed(err)
    }

    return repoMetric
  }
}
