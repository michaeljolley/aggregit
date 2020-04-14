import * as core from '@actions/core'
import * as github from '@actions/github'
import * as firebase from 'firebase-admin'
import {IRepoMetric} from './interfaces'

const firebaseDbName = core.getInput('firebaseDbName')
const private_key = core.getInput('private_key').replace('\\\\', '\\')

const serviceAccount: firebase.ServiceAccount = {
  projectId: core.getInput('project_id'),
  privateKey: private_key,
  clientEmail: core.getInput('client_email')
  // type: core.getInput('type'),
  //project_id: core.getInput('project_id'),
  // private_key_id: core.getInput('private_key_id'),
  //private_key: private_key,
  //client_email: core.getInput('client_email')
  // client_id: core.getInput('client_id'),
  // auth_uri: core.getInput('auth_uri'),
  // token_uri: core.getInput('token_uri'),
  // auth_provider_x509_cert_url: core.getInput('auth_provider_x509_cert_url'),
  // client_x509_cert_url: core.getInput('client_x509_cert_url')
}

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

export class Firebase {
  private db = firebase.database()

  async save(repoMetric: IRepoMetric) {
    let reposRef = this.db.ref(`${firebaseDbName}/repos`)

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
