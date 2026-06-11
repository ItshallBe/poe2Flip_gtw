import { INestApplication } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

type BizStats = {
  total: number;
  completed: number;
  aborted: number;
  errors: number;
  slow: number;
  durationMsTotal: number;
  durationMsMax: number;
  requestBytesTotal: number;
};

type DiagnosticsState = {
  inflight: number;
  total: number;
  completed: number;
  aborted: number;
  errors: number;
  slow: number;
  requestBytesTotal: number;
  startedAt: number;
};

const MB = 1024 * 1024;

function readBooleanEnv(name: string, defaultValue: boolean) {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }

  return !['0', 'false', 'off', 'no'].includes(value.toLowerCase());
}

function readNumberEnv(name: string, defaultValue: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : defaultValue;
}

function getHeader(req: Request, name: string) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function toMb(value: number) {
  return Math.round(value / MB);
}

function parseContentLength(req: Request) {
  const value = Number(getHeader(req, 'content-length'));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function createStats(): BizStats {
  return {
    total: 0,
    completed: 0,
    aborted: 0,
    errors: 0,
    slow: 0,
    durationMsTotal: 0,
    durationMsMax: 0,
    requestBytesTotal: 0,
  };
}

function normalizeBizMethod(req: Request) {
  return getHeader(req, 'bizmethod') || 'unknown';
}

function normalizeRequestUrl(req: Request) {
  const requestUrl = getHeader(req, 'requesturl');
  if (!requestUrl) {
    return undefined;
  }

  try {
    const parsed = new URL(requestUrl);
    return {
      host: parsed.host,
      path: parsed.pathname.slice(0, 120),
      length: requestUrl.length,
    };
  } catch {
    return {
      host: 'invalid-or-relative',
      path: requestUrl.slice(0, 120),
      length: requestUrl.length,
    };
  }
}

export function installProductionDiagnostics(app: INestApplication) {
  if (!readBooleanEnv('DIAG_LOGS', true)) {
    return;
  }

  const intervalMs = readNumberEnv('DIAG_LOG_INTERVAL_MS', 30000);
  const slowRequestMs = readNumberEnv('DIAG_SLOW_REQUEST_MS', 10000);
  const startedAt = Date.now();
  const state: DiagnosticsState = {
    inflight: 0,
    total: 0,
    completed: 0,
    aborted: 0,
    errors: 0,
    slow: 0,
    requestBytesTotal: 0,
    startedAt,
  };
  const intervalStats = new Map<string, BizStats>();
  const inflightByBiz = new Map<string, number>();
  let lastCpuUsage = process.cpuUsage();
  let lastIntervalAt = Date.now();

  function getBizStats(bizMethod: string) {
    let stats = intervalStats.get(bizMethod);
    if (!stats) {
      stats = createStats();
      intervalStats.set(bizMethod, stats);
    }

    return stats;
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const bizMethod = normalizeBizMethod(req);
    const requestBytes = parseContentLength(req);
    const startStats = getBizStats(bizMethod);
    let finalized = false;

    state.inflight++;
    state.total++;
    state.requestBytesTotal += requestBytes;
    startStats.total++;
    startStats.requestBytesTotal += requestBytes;
    inflightByBiz.set(bizMethod, (inflightByBiz.get(bizMethod) || 0) + 1);

    const finalize = (aborted: boolean) => {
      if (finalized) {
        return;
      }
      finalized = true;

      const durationMs = Date.now() - start;
      const isError = res.statusCode >= 500;
      const isSlow = durationMs >= slowRequestMs;

      state.inflight = Math.max(0, state.inflight - 1);
      const nextInflight = Math.max(0, (inflightByBiz.get(bizMethod) || 1) - 1);
      if (nextInflight > 0) {
        inflightByBiz.set(bizMethod, nextInflight);
      } else {
        inflightByBiz.delete(bizMethod);
      }

      const finishStats = getBizStats(bizMethod);

      if (aborted) {
        state.aborted++;
        finishStats.aborted++;
      } else {
        state.completed++;
        finishStats.completed++;
      }

      if (isError) {
        state.errors++;
        finishStats.errors++;
      }

      if (isSlow) {
        state.slow++;
        finishStats.slow++;
      }

      finishStats.durationMsTotal += durationMs;
      finishStats.durationMsMax = Math.max(
        finishStats.durationMsMax,
        durationMs,
      );

      if (aborted || isError || isSlow) {
        console.log(
          '[diag.request]',
          JSON.stringify({
            method: req.method,
            url: req.originalUrl || req.url,
            bizMethod,
            requestUrl: normalizeRequestUrl(req),
            statusCode: res.statusCode,
            durationMs,
            aborted,
            requestBytes,
            inflight: state.inflight,
          }),
        );
      }
    };

    res.on('finish', () => finalize(false));
    res.on('close', () => finalize(!res.writableEnded));
    next();
  });

  const timer = setInterval(() => {
    const now = Date.now();
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage(lastCpuUsage);
    const elapsedMs = Math.max(1, now - lastIntervalAt);
    const cpuPercent =
      ((cpuUsage.user + cpuUsage.system) / 1000 / elapsedMs) * 100;
    const intervalDriftMs = Math.max(0, elapsedMs - intervalMs);
    for (const [bizMethod] of inflightByBiz) {
      getBizStats(bizMethod);
    }

    const byBizMethod = Array.from(intervalStats.entries())
      .map(([bizMethod, stats]) => ({
        bizMethod,
        inflight: inflightByBiz.get(bizMethod) || 0,
        total: stats.total,
        completed: stats.completed,
        aborted: stats.aborted,
        errors: stats.errors,
        slow: stats.slow,
        avgDurationMs:
          stats.completed + stats.aborted > 0
            ? Math.round(
                stats.durationMsTotal / (stats.completed + stats.aborted),
              )
            : 0,
        maxDurationMs: stats.durationMsMax,
        requestMb: toMb(stats.requestBytesTotal),
      }))
      .sort((a, b) => b.inflight - a.inflight || b.total - a.total)
      .slice(0, 10);

    console.log(
      '[diag.summary]',
      JSON.stringify({
        pid: process.pid,
        uptimeSec: Math.round((now - state.startedAt) / 1000),
        intervalSec: Math.round(elapsedMs / 1000),
        cpuPercent: Math.round(cpuPercent),
        intervalDriftMs,
        memoryMb: {
          rss: toMb(memory.rss),
          heapUsed: toMb(memory.heapUsed),
          heapTotal: toMb(memory.heapTotal),
          external: toMb(memory.external),
          arrayBuffers: toMb(memory.arrayBuffers),
        },
        requests: {
          inflight: state.inflight,
          total: state.total,
          completed: state.completed,
          aborted: state.aborted,
          errors: state.errors,
          slow: state.slow,
          requestMb: toMb(state.requestBytesTotal),
        },
        byBizMethod,
      }),
    );

    intervalStats.clear();
    lastCpuUsage = process.cpuUsage();
    lastIntervalAt = now;
  }, intervalMs);

  timer.unref();
}
