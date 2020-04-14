import {IRepoMetric} from './interfaces/IRepoMetric'

import {Metrics} from './metrics'
//import * as db from 'firebase'

const metrics = new Metrics()

const run = async (): Promise<void> => {
  try {
    const repoMetric: IRepoMetric = await metrics.get()
    //  await db.save(repoMetric)
  } catch (err) {
    console.error(err)
  }
}

run()
