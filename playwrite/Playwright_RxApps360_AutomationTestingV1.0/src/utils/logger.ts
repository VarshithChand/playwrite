// ─────────────────────────────────────────────────────────────────────────────
// Logger – a tiny, dependency-free structured logger.
//
// Enterprise frameworks log every significant action so that when a test fails
// in CI (where you can't watch the browser) the console output tells the story:
//   [INFO ] 12:01:03 | type ✓ "email field"
//   [ERROR] 12:01:18 | click → element not found "[data-test=login]"
//
// Set LOG_LEVEL=debug|info|warn|error in your .env to control verbosity.
// ─────────────────────────────────────────────────────────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

// Read the threshold from the environment (default: info)
const currentLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[currentLevel];
}

function timestamp(): string {
  // HH:MM:SS — enough for correlating with the test timeline
  return new Date().toISOString().substring(11, 19);
}

function format(level: LogLevel, message: string): string {
  return `[${level.toUpperCase().padEnd(5)}] ${timestamp()} | ${message}`;
}

export const logger = {
  debug: (msg: string) => shouldLog("debug") && console.debug(format("debug", msg)),
  info:  (msg: string) => shouldLog("info")  && console.log(format("info", msg)),
  warn:  (msg: string) => shouldLog("warn")  && console.warn(format("warn", msg)),
  error: (msg: string) => shouldLog("error") && console.error(format("error", msg)),
};
