//import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  console.dir(github.context.payload)
}

run()
