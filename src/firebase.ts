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

  constructor(private metricDate: string) {
    this.db = firebase.firestore()
  }

  async save(repoMetric: IRepoMetric): Promise<void> {
    core.info('Saving to Firestore')

    const docRef = this.db.collection('repos').doc(repoMetric.name)

    await docRef.set(
      {
        name: repoMetric.name,
        url: repoMetric.url,
        forks: {[this.metricDate]: repoMetric.forks},
        issues: {[this.metricDate]: repoMetric.issues},
        stars: {[this.metricDate]: repoMetric.stars},
        watchers: {[this.metricDate]: repoMetric.watchers},
        pullRequests: {[this.metricDate]: repoMetric.pullRequests},
        contributors: {[this.metricDate]: repoMetric.contributors},
        totalPullRequests: {[this.metricDate]: repoMetric.totalPullRequests},
        totalIssues: {[this.metricDate]: repoMetric.totalIssues},
        healthPercentage: {[this.metricDate]: repoMetric.healthPercentage},
        commits: {[this.metricDate]: repoMetric.commits},
        // totalViews: {[this.metricDate]: repoMetric.totalViews},
        // uniqueViews: {[this.metricDate]: repoMetric.uniqueViews},

        codeOfConductExists: {
          [this.metricDate]: repoMetric.codeOfConductExists
        },
        contributingExists: {[this.metricDate]: repoMetric.contributingExists},
        issueTemplateExists: {
          [this.metricDate]: repoMetric.issueTemplateExists
        },
        pullRequestTemplateExists: {
          [this.metricDate]: repoMetric.pullRequestTemplateExists
        },
        licenseExists: {[this.metricDate]: repoMetric.licenseExists},
        readMeExists: {[this.metricDate]: repoMetric.readMeExists}
      },
      {merge: true}
    )
    core.info('Saving to Firebase complete')
  }
}