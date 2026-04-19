import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { printResult } from "./printer.js";
import type { InspectResult } from "./types.js";

function makeResult(overrides: Partial<InspectResult> = {}): InspectResult {
  return {
    tools: [],
    resources: [],
    prompts: [],
    toolResults: [],
    resourceResults: [],
    promptResults: [],
    schemaIssues: [],
    complianceIssues: [],
    score: {
      toolsCallable: 0,
      toolsTotal: 0,
      resourcesReadable: 0,
      resourcesTotal: 0,
      promptsGettable: 0,
      promptsTotal: 0,
      schemaWarnings: 0,
      schemaErrors: 0,
      complianceErrors: 0,
      complianceWarnings: 0,
    },
    durationMs: 100,
    ...overrides,
  };
}

describe("printResult --verbose handling", () => {
  let logs: string[] = [];
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logs = [];
    logSpy = vi
      .spyOn(console, "log")
      .mockImplementation((...args: unknown[]) => {
        logs.push(args.map((a) => String(a)).join(" "));
      });
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  const passingResult = (): InspectResult =>
    makeResult({
      tools: [
        {
          name: "echo",
          description: "Echoes back the input",
          inputSchema: { type: "object" as const },
        },
      ],
      toolResults: [
        {
          tool: "echo",
          success: true,
          durationMs: 1,
          argsUsed: { message: "hello" },
        },
      ],
      prompts: [
        {
          name: "greet",
          description: "A greeting prompt",
          arguments: [{ name: "name", required: true }],
        },
      ],
      promptResults: [
        {
          name: "greet",
          success: true,
          messageCount: 1,
          durationMs: 1,
          argsUsed: { name: "test" },
        },
      ],
      score: {
        toolsCallable: 1,
        toolsTotal: 1,
        resourcesReadable: 0,
        resourcesTotal: 0,
        promptsGettable: 1,
        promptsTotal: 1,
        schemaWarnings: 0,
        schemaErrors: 0,
        complianceErrors: 0,
        complianceWarnings: 0,
      },
    });

  it("by default does NOT print args sent for PASS rows", () => {
    printResult(passingResult());
    const joined = logs.join("\n");
    expect(joined).not.toContain("args sent");
  });

  it("with verbose:true prints args sent for PASS tool rows", () => {
    printResult(passingResult(), { verbose: true });
    const joined = logs.join("\n");
    expect(joined).toContain("args sent");
    expect(joined).toContain('"message":"hello"');
  });

  it("with verbose:true prints args sent for PASS prompt rows", () => {
    printResult(passingResult(), { verbose: true });
    const joined = logs.join("\n");
    expect(joined).toContain('"name":"test"');
  });

  it("still prints args sent for FAIL tool rows even when verbose is off", () => {
    const failing = makeResult({
      tools: [
        {
          name: "broken",
          description: "Always fails",
          inputSchema: { type: "object" as const },
        },
      ],
      toolResults: [
        {
          tool: "broken",
          success: false,
          error: "kaboom",
          durationMs: 1,
          argsUsed: { foo: "bar" },
        },
      ],
      score: {
        toolsCallable: 0,
        toolsTotal: 1,
        resourcesReadable: 0,
        resourcesTotal: 0,
        promptsGettable: 0,
        promptsTotal: 0,
        schemaWarnings: 0,
        schemaErrors: 0,
        complianceErrors: 0,
        complianceWarnings: 0,
      },
    });
    printResult(failing);
    const joined = logs.join("\n");
    expect(joined).toContain("kaboom");
    expect(joined).toContain('"foo":"bar"');
  });

  it("does not print 'args sent' for PASS rows that have no args", () => {
    const noArgs = makeResult({
      tools: [
        {
          name: "ping",
          description: "no-arg tool",
          inputSchema: { type: "object" as const },
        },
      ],
      toolResults: [
        {
          tool: "ping",
          success: true,
          durationMs: 1,
          argsUsed: {},
        },
      ],
      score: {
        toolsCallable: 1,
        toolsTotal: 1,
        resourcesReadable: 0,
        resourcesTotal: 0,
        promptsGettable: 0,
        promptsTotal: 0,
        schemaWarnings: 0,
        schemaErrors: 0,
        complianceErrors: 0,
        complianceWarnings: 0,
      },
    });
    printResult(noArgs, { verbose: true });
    const joined = logs.join("\n");
    expect(joined).not.toContain("args sent");
  });
});
