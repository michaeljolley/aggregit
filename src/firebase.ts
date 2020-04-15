import * as core from '@actions/core'
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
  private db: FirebaseFirestore.Firestore

  constructor() {
    this.db = firebase.firestore()
  }

  async save(repoMetric: IRepoMetric): Promise<void> {
    const docRef = this.db.collection('repos').doc(repoMetric.name)

    const metricDate = new Date().toISOString().slice(0, 10)

    await docRef.set({
      name: repoMetric.name,
      url: repoMetric.url,
      forks: {[metricDate]: repoMetric.forks},
      issues: {[metricDate]: repoMetric.issues},
      stars: {[metricDate]: repoMetric.stars},
      watchers: {[metricDate]: repoMetric.watchers},
      pullRequests: {[metricDate]: repoMetric.pullRequests},
      contributors: {[metricDate]: repoMetric.contributors},
      commits: {[metricDate]: repoMetric.commits},
      // totalViews: {[metricDate]: repoMetric.totalViews},
      // uniqueViews: {[metricDate]: repoMetric.uniqueViews},
      totalPullRequests: {[metricDate]: repoMetric.totalPullRequests},
      totalIssues: {[metricDate]: repoMetric.totalIssues}
    })
  }
}
