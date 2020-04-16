// const { Toolkit } = require("actions-toolkit");
// const mockedEnv = require('mocked-env')
// const nock = require('nock')
// nock.disableNetConnect()

import {getParticipation} from '../src/metrics'
jest.mock('../src/metrics')

import * as github from '@actions/github'

describe('Metrics', () => {
  describe('GetParticipation', () => {
    it(`returns undefined on error`, async () => {
      const fakeOctokit = {
        repo: {
          getParticipationStats: () => {
            throw 'bad stuff'
          }
        }
      }

      const result = await getParticipation(fakeOctokit)

      expect(result).toBeUndefined()
    })
  })
})
