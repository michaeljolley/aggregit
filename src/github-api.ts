import {GitHub} from '@actions/github'
import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'
import {IGraphQLResponse} from './interfaces'

import * as axios from 'axios'

// export const getParticipation = async (
//   octokit: GitHub,
//   context: Context,
//   metricDate: Date
// ): Promise<number | undefined> => {
//   try {
//     const commitStats = (
//       await octokit.repos.getCommitActivityStats({
//         owner: context.repo.owner,
//         repo: context.repo.repo
//       })
//     ).data

//     const currentWeekStats = commitStats[commitStats.length - 1]
//     const daysCommits = currentWeekStats.days[metricDate.getDay()]

//     return daysCommits
//   } catch (err) {
//     core.setFailed(`getParticipation: ${err}`)
//     return undefined
//   }
// }

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

export const getTraffic = async (): // octokit: GitHub,
// context: Context
Promise<any | undefined> => {
  try {
    const pat = core.getInput('gh_pat')
    const x = await axios.default.get('', {
      headers: {
        authorization: `token ${pat}`
      }
    })

    // await octokit.repos.getViews({
    //   owner: context.repo.owner,
    //   repo: context.repo.repo
    // })

    core.info(JSON.stringify(x))
    return x
  } catch (err) {
    core.error(`Error getting traffic: ${err}`)
    return undefined
  }
}
