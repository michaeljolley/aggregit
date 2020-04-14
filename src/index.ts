import * as core from '@actions/core'
import {IRepoMetric} from './interfaces/IRepoMetric'

import {Metrics} from './metrics'
import {Firebase} from './firebase'

const run = async (): Promise<void> => {
  try {
    const metrics = new Metrics()
    const repoMetric: IRepoMetric | undefined = await metrics.get()

    if (repoMetric) {
      const db = new Firebase()
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
