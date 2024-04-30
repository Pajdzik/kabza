import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { Agent, MockAgent, setGlobalDispatcher } from "undici";
import { retrievePocketData } from "../../src/methods/get.js";
import { createMockAgent, mockReply } from "../mock.js";

// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());

describe("retrievePocketData", () => {
  let mockAgent: MockAgent;

  beforeAll(() => {
    mockAgent = createMockAgent();
  });

  afterAll(() => {
    mockAgent.deactivate();
  });

  it("deserializes response properly", async () => {
    const mockPool = mockAgent.get("https://getpocket.com");
    mockPool
      .intercept({
        path: "/v3/get",
        method: "POST",
      })
      .reply(200, await mockReply("get.all.json"));

    const response = await retrievePocketData({
      consumerKey: "1234-abcd1234abcd1234abcd1234",
      accessToken: "12345678-0000-0000-0000-000000000000",
    });

    expect(response.error).to.be.null;
    expect(response.status).to.equal(1);
  });
});
