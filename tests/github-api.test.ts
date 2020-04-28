import * as github from '@actions/github'
import * as nock from 'nock'
import * as mockedEnv from 'mocked-env'

import {mergeCommitSha} from './index'
import * as nockSeeds from './nock'

import {getCommunity, getRepo, getRepoTotals} from '../src/github-api'

describe('GitHub API', () => {
  let restore: any

  beforeEach(() => {
    restore = mockedEnv.default({
      GITHUB_WORKFLOW: 'Aggregit',
      GITHUB_ACTION: 'Aggregit Action',
      GITHUB_ACTOR: 'michaeljolley',
      GITHUB_WORKSPACE: '/tmp',
      GITHUB_SHA: mergeCommitSha,
      GITHUB_REPOSITORY: 'michaeljolley/test-repo',
      GITHUB_EVENT_NAME: '',
      GITHUB_EVENT_PATH: ''
    })
  })

  afterEach(() => {
    restore()
    nock.cleanAll()
  })

  // describe('getParticipation', () => {
  //   it(`Returns undefined on error`, async () => {
  //     nockSeeds.nockParticipationBad()

  //     const fakeOctokit = new github.GitHub('')

  //     const result = await getParticipation(
  //       fakeOctokit,
  //       github.context,
  //       new Date(metricDate)
  //     )

  //     expect(result).toBeUndefined()
  //   })
  //   it(`Returns correct value based on day of week`, async () => {
  //     nockSeeds.nockParticipationGood()

  //     const fakeOctokit = new github.GitHub('')

  //     const result = await getParticipation(
  //       fakeOctokit,
  //       github.context,
  //       new Date(`${metricDate}T00:00:00Z`)
  //     )

  //     expect(result).toEqual(10)
  //   })
  // })
  describe('getRepo', () => {
    it(`Returns undefined on error`, async () => {
      nockSeeds.nockRepoBad()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepo(fakeOctokit, github.context)

      expect(result).toBeUndefined()
    })
    it(`Returns repo on success`, async () => {
      nockSeeds.nockRepoGood()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepo(fakeOctokit, github.context)

      expect(result).not.toBeUndefined()
      if (result) {
        expect(result.name).toBe(github.context.repo.repo)
      }
    })
  })
  describe('getRepoTotals', () => {
    it(`Returns undefined on error`, async () => {
      nockSeeds.nockRepoTotalsBad()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepoTotals(fakeOctokit, github.context)

      expect(result).toBeUndefined()
    })
    it(`Returns repo stats on success`, async () => {
      nockSeeds.nockRepoTotalsGood()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepoTotals(fakeOctokit, github.context)

      expect(result).not.toBeUndefined()
      if (result) {
        expect(result.repository.mergedPRs.totalCount).toEqual(5)
      }
    })
  })

  describe('getCommunity', () => {
    it(`Returns undefined on error`, async () => {
      nockSeeds.nockCommunityBad()

      const fakeOctokit = new github.GitHub('')

      const result = await getCommunity(fakeOctokit, github.context)

      expect(result).toBeUndefined()
    })
    it(`Returns community on success`, async () => {
      nockSeeds.nockCommunityGood()

      const fakeOctokit = new github.GitHub('')

      const result = await getCommunity(fakeOctokit, github.context)
      expect(result).not.toBeUndefined()
      if (result) {
        expect(result.files.code_of_conduct).not.toBeUndefined()
        expect(result.files.pull_request_template).toBeNull()
      }
    })
  })
  describe('getRepoTotals', () => {
    it(`Returns undefined on error`, async () => {
      nockSeeds.nockRepoTotalsBad()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepoTotals(fakeOctokit, github.context)

      expect(result).toBeUndefined()
    })
    it(`Returns repo stats on success`, async () => {
      nockSeeds.nockRepoTotalsGood()

      const fakeOctokit = new github.GitHub('')

      const result = await getRepoTotals(fakeOctokit, github.context)

      expect(result).not.toBeUndefined()
      if (result) {
        expect(result.repository.mergedPRs.totalCount).toEqual(5)
      }
    })
  })
})
