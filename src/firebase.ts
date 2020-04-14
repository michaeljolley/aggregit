import * as core from '@actions/core'
import * as github from '@actions/github'
import * as firebase from 'firebase-admin'
import {IRepoMetric} from './interfaces'

const serviceAccount: firebase.ServiceAccount = {
  projectId: core.getInput('project_id'),
  privateKey: core.getInput('private_key'),
  clientEmail: core.getInput('client_email')
}

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: core.getInput('firebaseDbUrl')
})

export class Firebase {
  private db = firebase.database()

  async save(repoMetric: IRepoMetric) {
    let reposRef = this.db.ref(`repos`)

    let metricDate = new Date().toISOString().slice(0, 10)

    reposRef.set({
      [repoMetric.name]: {
        forks: [{[metricDate]: repoMetric.forks}],
        issues: [{[metricDate]: repoMetric.issues}],
        stars: [{[metricDate]: repoMetric.stars}],
        watchers: [{[metricDate]: repoMetric.watchers}],
        pullRequests: [{[metricDate]: repoMetric.pullRequests}],
        contributors: [{[metricDate]: repoMetric.contributors}],
        commits: [{[metricDate]: repoMetric.commits}],
        totalViews: [{[metricDate]: repoMetric.totalViews}],
        uniqueViews: [{[metricDate]: repoMetric.uniqueViews}],
        totalPullRequests: [{[metricDate]: repoMetric.totalPullRequests}],
        totalIssues: [{[metricDate]: repoMetric.totalIssues}]
      }
    })
  }
}
