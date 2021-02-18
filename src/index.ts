import * as core from '@actions/core'
import * as github from '@actions/github'
import * as githubApi from './github-api'
import {IRepoMetric} from './interfaces'
import {Metrics} from './metrics'
import {Firebase} from './firebase'

const guard = require('action-guard')

const githubToken: string = core.getInput('githubToken')
const octokit: github.GitHub = new github.GitHub(githubToken)

const calcDate = new Date()
calcDate.setDate(calcDate.getDate() - 1)
export const metricDate = calcDate.toISOString().slice(0, 10)

const run = async (): Promise<void> => {
  try {
    // ActionGuard will throw an exception if the event that
    // triggered the action was not 'schedule'
    guard('schedule')

    const repo = await githubApi.getRepo(octokit, github.context)
    // If this is a fork, exit.
    if (repo.fork) {
      return
    }
    core.info('Repo is not a fork. Continuing.')

    const repoMetric: IRepoMetric = {
      name: github.context.repo.repo,
      url: repo.html_url,
      issues: repo.open_issues_count,
      forks: repo.forks_count,
      stars: repo.stargazers_count,
      watchers: repo.watchers_count
    }

    const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))
    const metric = await metrics.get(octokit, repoMetric)
    if (metric !== undefined) {
      const db = new Firebase(metricDate)
      await db.save(repoMetric)
    }
  } catch (err) {
    core.error(err)
  }
}

run()
