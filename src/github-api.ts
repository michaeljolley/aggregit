import * as core from '@actions/core'
import {GitHub} from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {IGraphQLResponse} from './interfaces'

import * as axios from 'axios'

export const getParticipation = async (
  octokit: GitHub,
  context: Context,
  metricDate: Date
): Promise<number | undefined> => {
  try {
    let commitStats = (
      await octokit.repos.getCommitActivityStats({
        owner: context.repo.owner,
        repo: context.repo.repo
      })
    ).data

    // Sometimes this API fails on the first attempt. Try one more time.
    if (commitStats.length === 0) {
      commitStats = (
        await octokit.repos.getCommitActivityStats({
          owner: context.repo.owner,
          repo: context.repo.repo
        })
      ).data
    }

    if (commitStats.length === 0) {
      return undefined
    }

    const currentWeekStats = commitStats[commitStats.length - 1]
    const daysCommits = currentWeekStats.days[metricDate.getDay()]

    return daysCommits
  } catch (err) {
    core.setFailed(`getParticipation: ${err}`)
    return undefined
  }
}

export const getRepo = async (
  octokit: GitHub,
  context: Context
): Promise<any | undefined> => {
  try {
    return (
      await octokit.repos.get({
        owner: context.repo.owner,
        repo: context.repo.repo
      }) 
    ).data
  } catch (err) {
    core.setFailed(`getRepo: ${err}`)
    return undefined
  }
}

export const getRepoTotals = async (
  octokit: GitHub,
  context: Context
): Promise<IGraphQLResponse | undefined> => {
  try {
    const repoTotalsQuery = `
    query {
      repository(owner: "${context.repo.owner}", name:"${context.repo.repo}") {
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

    const totals = await octokit.graphql(repoTotalsQuery)
    return (totals as IGraphQLResponse) || undefined
  } catch (err) {
    core.setFailed(`getRepoTotals: ${err}`)
    return undefined
  }
}

export const getTraffic = async (
  octokit: GitHub,
  context: Context
): // context: Context
Promise<any | undefined> => {
  try {
    const traffic = (
      await octokit.repos.getViews({
        owner: context.repo.owner,
        repo: context.repo.repo
      })
    ).data

    core.info(JSON.stringify(traffic))

    const todaysViews =
      traffic.views.length > 0
        ? traffic.views[traffic.views.length - 1]
        : {
            count: 0,
            uniques: 0
          }

    return {count: todaysViews.count, uniques: todaysViews.uniques}
  } catch (err) {
    core.error(
      '  - Unable to get traffic. githubToken must have push access to repo.'
    )
    return {count: 0, unique: 0}
  }
}

export const getCommunity = async (
  octokit: GitHub,
  context: Context
): Promise<any | undefined> => {
  try {
    return (
      await octokit.repos.retrieveCommunityProfileMetrics({
        owner: context.repo.owner,
        repo: context.repo.repo,
        request: {
          headers: {
            accept: 'application/vnd.github.black-panther-preview+json'
          }
        }
      })
    ).data
  } catch (err) {
    core.error(`Error getting community: ${err}`)
    return undefined
  }
}
