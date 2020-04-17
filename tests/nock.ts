import * as nock from 'nock'
nock.disableNetConnect()

export const nockParticipationBad = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo/stats/commit_activity')
    .reply(500)
}
export const nockParticipationGood = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo/stats/commit_activity')
    .reply(200, [
      {
        total: 0,
        week: 1555804800,
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        total: 0,
        week: 1556409600,
        days: [8, 9, 10, 11, 12, 13, 14]
      }
    ])
}
export const nockRepoBad = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo')
    .reply(500)
}
export const nockRepoGood = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo')
    .reply(200, {
      id: 1111111,
      name: 'test-repo'
    })
}
export const nockRepoTotalsBad = (): void => {
  nock
    .default('https://api.github.com')
    .post('/graphql')
    .reply(500)
}

export const nockRepoTotalsGood = (): void => {
  nock
    .default('https://api.github.com')
    .post('/graphql')
    .reply(200, {
      data: {
        repository: {
          openIssues: {
            totalCount: 1
          },
          closedIssues: {
            totalCount: 2
          },
          openPRs: {
            totalCount: 3
          },
          closedPRs: {
            totalCount: 4
          },
          mergedPRs: {
            totalCount: 5
          },
          contributors: {
            totalCount: 6
          }
        }
      }
    })
}
