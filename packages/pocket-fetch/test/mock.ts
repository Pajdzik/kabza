import * as fs from "fs/promises";
import path from "path";
import { MockAgent, setGlobalDispatcher } from "undici";
import { beforeAll, describe, SuiteFactory } from "vitest";

export const createMockAgent = () => {
  const mockAgent = new MockAgent();

  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);

  return mockAgent;
};

export const mockReply = async (fileName: string): Promise<Buffer> => {
  return fs.readFile(path.join(__dirname, "responses", fileName));
};

const describeWithMockedHttpAgent = <T extends {}>(
  name: string,
  factory?: SuiteFactory<T>
) => {
  describe(name, () => {
    beforeAll(() => {});

    factory("  ");
  });
};
