import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();
    const uptimeSeconds = process.uptime();

    return NextResponse.json({
      ok: true,
      timestamp: Date.now(),
      process: {
        pid: process.pid,
        version: process.version,
        uptimeSeconds,
        memory: {
          rss: mem.rss, // Resident Set Size
          heapTotal: mem.heapTotal,
          heapUsed: mem.heapUsed,
          external: mem.external,
          arrayBuffers: (mem as any).arrayBuffers ?? null,
        },
        cpu: {
          userMicros: cpu.user,
          systemMicros: cpu.system,
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}


