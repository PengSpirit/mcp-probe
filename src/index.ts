#!/usr/bin/env node

import { Command } from "commander";
import { inspectServer } from "./client.js";

const program = new Command();

program
  .name("mcp-doctor")
  .description("One command to diagnose your MCP server")
  .version("0.1.0");

program
  .command("test")
  .description("Connect to an MCP server and run a full inspection")
  .argument(
    "<command>",
    'The MCP server start command (e.g. "npx -y @modelcontextprotocol/server-everything")'
  )
  .option("--json", "Output results as JSON", false)
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .action(async (command: string, opts: { json: boolean; timeout: string }) => {
    try {
      const result = await inspectServer(command, {
        json: opts.json,
        timeout: parseInt(opts.timeout, 10),
      });

      // Exit with non-zero if any checks failed
      const { score } = result;
      const allPassed =
        score.toolsCallable === score.toolsTotal &&
        score.resourcesReadable === score.resourcesTotal &&
        score.promptsGettable === score.promptsTotal &&
        score.schemaErrors === 0;

      if (!allPassed) {
        process.exit(1);
      }
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  });

program.parse();
