import * as core from '@actions/core'
import {IRepoMetric} from './interfaces/IRepoMetric'

import {Metrics} from './metrics'
import {Firebase} from './firebase'

const metrics = new Metrics()
const db = new Firebase()

const run = async (): Promise<void> => {
  try {
    const repoMetric: IRepoMetric | undefined = await metrics.get()

    if (repoMetric) {
      await db.save(repoMetric)
    } else {
      core.error('Unable to gather all metrics')
      core.ExitCode.Failure
    }
  } catch (err) {
    console.error(err)
  }
}

run()
