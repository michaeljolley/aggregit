import * as core from '@actions/core'
import * as github from '@actions/github'
//import {ActionGuard} from 'action-guard'

// import {IRepoMetric} from './interfaces/IRepoMetric'
// import {Metrics} from './metrics'
// import {Firebase} from './firebase'

// const calcDate = new Date()
// calcDate.setDate(calcDate.getDate() - 1)
// export const metricDate = calcDate.toISOString().slice(0, 10)

const run = async (): Promise<void> => {
  try {
    // ActionGuard will throw an exception if the event that
    // triggered the action was not 'schedule'
   // ActionGuard('schedule')

    console.dir(github.context)

    // const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))
    // const repoMetric: IRepoMetric | undefined = await metrics.get()

    // if (repoMetric) {
    //   const db = new Firebase(metricDate)
    //   await db.save(repoMetric)
    // } else {
    //   core.error('Unable to gather all metrics')
    //   core.ExitCode.Failure
    // }
  } catch (err) {
    core.error(err)
  }
}

run()
