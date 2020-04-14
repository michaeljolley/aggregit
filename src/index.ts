import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  const githubToken: string = process.env.GITHUB_TOKEN || ''

  const octokit: github.GitHub = new github.GitHub(githubToken)

  const {data: repo} = await octokit.repos.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  })

  console.dir(repo)
}

run()
