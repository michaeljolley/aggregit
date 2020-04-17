import * as nock from 'nock'
import * as mockedEnv from 'mocked-env'
nock.disableNetConnect()

import {mergeCommitSha, metricDate} from './index'
import * as nockSeeds from './nock'

import {Metrics} from '../src/metrics'

describe('Metrics', () => {
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

  describe('get', () => {
    it(`Returns undefined on unsuccessful repo retrieval`, async () => {
      nockSeeds.nockRepoBad()
      nockSeeds.nockParticipationGood()
      nockSeeds.nockRepoTotalsGood()

      const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))

      const result = await metrics.get()

      expect(result).toBeUndefined()
    })
    it(`Returns undefined on unsuccessful participation retrieval`, async () => {
      nockSeeds.nockRepoGood()
      nockSeeds.nockParticipationBad()
      nockSeeds.nockRepoTotalsGood()

      const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))

      const result = await metrics.get()

      expect(result).toBeUndefined()
    })
    it(`Returns undefined on unsuccessful repo totals retrieval`, async () => {
      nockSeeds.nockRepoGood()
      nockSeeds.nockParticipationGood()
      nockSeeds.nockRepoTotalsBad()

      const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))

      const result = await metrics.get()

      expect(result).toBeUndefined()
    })
    it(`Returns valid metrics`, async () => {
      nockSeeds.nockRepoGood()
      nockSeeds.nockParticipationGood()
      nockSeeds.nockRepoTotalsGood()

      const metrics = new Metrics(new Date(`${metricDate}T00:00:00Z`))

      const result = await metrics.get()

      expect(result).not.toBeUndefined()
      if (result) {
        expect(result.totalPullRequests).toEqual(12)
        expect(result.totalIssues).toEqual(3)
      }
    })
  })
})
