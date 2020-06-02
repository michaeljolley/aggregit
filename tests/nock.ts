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
      name: 'test-repo',
      fork: false
    })
}
export const nockRepoGoodFork = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo')
    .reply(200, {
      id: 1111111,
      name: 'test-repo',
      fork: true
    })
}
export const nockCommunityBad = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo/community/profile')
    .reply(500)
}
export const nockCommunityGood = (): void => {
  nock
    .default('https://api.github.com')
    .get('/repos/michaeljolley/test-repo/community/profile')
    .reply(200, {
      health_percentage: 83,
      description:
        'This action gathers metrics about the repository and loads them to a Firebase database that you specify.',
      documentation: null,
      files: {
        code_of_conduct: {
          key: 'other',
          name: 'Other',
          html_url:
            'https://github.com/michaeljolley/test-repo/blob/master/CODE_OF_CONDUCT.md',
          url:
            'https://api.github.com/repos/michaeljolley/test-repo/community/code_of_conduct'
        },
        contributing: {
          url:
            'https://api.github.com/repos/michaeljolley/test-repo/contents/CONTRIBUTING.md',
          html_url:
            'https://github.com/michaeljolley/test-repo/blob/master/CONTRIBUTING.md'
        },
        issue_template: null,
        pull_request_template: null,
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz',
          html_url:
            'https://github.com/michaeljolley/test-repo/blob/master/LICENSE'
        },
        readme: {
          url:
            'https://api.github.com/repos/michaeljolley/test-repo/contents/README.md',
          html_url:
            'https://github.com/michaeljolley/test-repo/blob/master/README.md'
        }
      },
      updated_at: '2020-04-21T03:23:33Z'
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
