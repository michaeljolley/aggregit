// import mockedEnv from 'mocked-env'
// import nock from 'nock'
// nock.disableNetConnect()

// const merge_commit_sha = '253187c4c33beddeb518eb331e4efaf41b2f4feb'

// describe('Aggregit', () => {
//   let action, tools, restore, restoreTest
//   Toolkit.run = jest.fn(actionFn => {
//     action = actionFn
//   })
//   require('.')

//   beforeEach(() => {
//     restore = mockedEnv({
//       GITHUB_WORKFLOW: 'Hold Your Horses',
//       GITHUB_ACTION: 'Hold Your Horses Action',
//       GITHUB_ACTOR: 'mheap',
//       GITHUB_WORKSPACE: '/tmp',
//       GITHUB_SHA: merge_commit_sha,
//       GITHUB_REPOSITORY: 'mheap/test-repo-hyh-stream',
//       GITHUB_EVENT_NAME: '',
//       GITHUB_EVENT_PATH: ''
//     })

//     tools = new Toolkit()
//     tools.context.loadPerTestEnv = function() {
//       this.payload = process.env.GITHUB_EVENT_PATH
//         ? require(process.env.GITHUB_EVENT_PATH)
//         : {}
//       this.event = process.env.GITHUB_EVENT_NAME
//     }

//     tools.exit.success = jest.fn()
//     tools.exit.failure = jest.fn()

//     tools.log.info = jest.fn()
//     tools.log.error = jest.fn()
//     tools.log.pending = jest.fn()
//     tools.log.complete = jest.fn()
//   })

//   afterEach(() => {
//     restore()
//     restoreTest()
//     nock.cleanAll()
//   })

//   describe(`On schedule`, () => {
//     describe(`Setting the duration`, () => {
//       it("has a default duration", async () => {
//         restoreTest = scheduleTrigger(tools);
//         mockAllSuccessRequests();
//         await action(tools);
//         expect(tools.log.info).toHaveBeenCalledWith(
//           "Running with duration of PT10M"
//         );
//         expect(tools.exit.success).toHaveBeenCalledWith("Action finished");
//       });

//       it("accepts a user specified duration", async () => {
//         restoreTest = scheduleTrigger(tools, "PT3M");
//         mockAllSuccessRequests();
//         await action(tools);
//         expect(tools.log.info).toHaveBeenCalledWith(
//           "Running with duration of PT3M"
//         );
//         expect(tools.exit.success).toHaveBeenCalledWith("Action finished");
//       });

//       // Duration isn't parseable
//       it("fails when the duration isn't parseable", async () => {
//         restoreTest = scheduleTrigger(tools, "invalid_duration");
//         mockAllSuccessRequests();
//         await action(tools);
//         expect(tools.exit.failure).toHaveBeenCalledWith(
//           "Invalid duration provided: invalid_duration"
//         );
//       });
//     });
// })

// function testEnv(tools, params) {
//   const r = mockedEnv(params)
//   tools.context.loadPerTestEnv()
//   return r
// }

// function scheduleTrigger(tools, duration) {
//   const opts = {
//     GITHUB_EVENT_NAME: 'schedule',
//     GITHUB_EVENT_PATH: `${__dirname}/tests/fixtures/schedule.json`
//   }

//   if (duration) {
//     opts['INPUT_DURATION'] = duration
//   }

//   return testEnv(tools, opts)
// }
