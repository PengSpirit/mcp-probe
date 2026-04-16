import { watch, type FSWatcher } from "node:fs";
import { resolve } from "node:path";
import { inspectServer } from "./client.js";
import type { InspectOptions } from "./types.js";
import { parseTarget, createTransport, type ParseTargetOptions } from "./transport.js";

export interface WatchOptions {
  target: string;
  parseOpts: ParseTargetOptions;
  inspectOpts: InspectOptions;
  watchPath: string;
  debounceMs?: number;
}

export function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  };
}

export async function watchServer(options: WatchOptions): Promise<void> {
  const debounceMs = options.debounceMs ?? 500;
  let running = false;

  async function runInspection(): Promise<void> {
    if (running) return;
    running = true;

    process.stdout.write("\x1Bc");
    console.log(`[mcp-probe watch] Running inspection... (${new Date().toLocaleTimeString()})\n`);

    try {
      const spec = parseTarget(options.target, options.parseOpts);
      const transport = createTransport(spec);
      await inspectServer(transport, options.inspectOpts);
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    }

    console.log(`\n[mcp-probe watch] Watching ${options.watchPath} for changes... (Ctrl+C to stop)`);
    running = false;
  }

  await runInspection();

  const debouncedRun = debounce(() => {
    runInspection();
  }, debounceMs);

  const watchPath = resolve(options.watchPath);
  const watcher: FSWatcher = watch(watchPath, { recursive: true }, () => {
    debouncedRun();
  });

  const cleanup = () => {
    watcher.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await new Promise(() => {});
}
