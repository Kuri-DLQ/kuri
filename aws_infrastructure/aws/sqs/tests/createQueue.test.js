const { run, params } = require("./createQueue_test");
const { sqsClient } = require("../../clients/sqsClient.js");

jest.mock("../../clients/sqsClient.js");

describe("@aws-sdk/client-ses mock", () => {
  it("should successfully mock SES client", async () => {
    sqsClient.send.mockResolvedValue({ isMock: true });
    const response = await run(params);
    expect(response.isMock).toEqual(true);
  });
});
