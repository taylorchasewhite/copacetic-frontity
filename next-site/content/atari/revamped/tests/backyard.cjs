// Run against the self-hosted Javatari player, not the article containing it.
const assert = require("node:assert/strict");
const { chromium } = require("playwright-core");

async function main() {
  const browser = await chromium.launch({ channel: "msedge" });
  try {
    const page = await browser.newPage();
    await page.goto(process.argv[2] || "http://localhost:8000/atari/play.html?game=skateboard-steve-revamped");
    await page.waitForFunction(() => globalThis.Javatari?.room?.console?.powerIsOn);
    const result = await page.evaluate(() => {
      const room = Javatari.room;
      room.mainVideoClock.pause();
      const machine = room.console;
      const stick = machine.getConsoleControlsSocket();
      const key = (id, on) => stick.controlStateChanged(id, on);
      const frame = () => machine.videoClockPulseApplyPulldowns(1);
      key(54, true); frame(); key(54, false); frame();

      const clears = [], lengths = [], delays = new Map(), lead = new Set(), bass = new Set();
      let previous, held, activeFrames = 0;
      for (let i = 0; i < 6000 && lengths.length < 6; i++) {
        const { r, t } = machine.saveState();
        const m = Uint8Array.from(atob(r.b), ch => ch.charCodeAt(0));
        // RIOT offsets for potY, cooldown, yard, yardDodges, cheer and rideTime.
        const [pot, cooldown, yard, progress, cheer, time] = [6, 8, 110, 111, 118, 119].map(k => m[k]);
        if (pot === 255 && previous && previous.pot !== 255) {
          const tier = time >> 3;
          if (!delays.has(tier)) delays.set(tier, []);
          delays.get(tier).push(cooldown);
        }
        if (cheer) {
          if (!held) {
            clears.push([yard, progress, m[13]]);
            held = [m[0], m[1], m[2], m[3], m[4], time, yard];
          }
          if (held.join() !== [m[0], m[1], m[2], m[3], m[4], time, yard].join() || pot !== 255)
            throw Error("Gameplay advanced during the trick");
          if (t.AUDV0) lead.add(t.AUDF0);
          if (t.AUDV1) bass.add(t.AUDF1);
          activeFrames++;
        } else if (held) {
          if (yard !== (held[6] + 1) % 3 || progress || t.AUDV0 || t.AUDV1)
            throw Error("Incomplete yard transition");
          lengths.push(activeFrames);
          activeFrames = 0;
          held = null;
        }
        const dodge = pot !== 255 && Math.abs(m[3] - m[5]) < 40;
        key(14, dodge && m[5] < 76);
        key(13, dodge && m[5] >= 76);
        previous = { pot };
        frame();
      }
      return { clears, lengths, bands: [...delays.values()].map(a => [Math.min(...a), Math.max(...a)]),
        melodyNotes: lead.size, bassNotes: bass.size };
    });
    assert.deepEqual(result.clears, Array.from({ length: 6 }, (_, i) => [i % 3, 6, 6 * (i + 1)]));
    assert.deepEqual(result.lengths, Array(6).fill(128));
    assert.equal(result.bands.length, 6);
    for (let i = 1; i < result.bands.length; i++) {
      assert.ok(result.bands[i][1] < result.bands[i - 1][1], "Throws must get more frequent");
    }
    assert.ok(result.melodyNotes >= 6 && result.bassNotes >= 3, "Both voices should play a phrase");
    console.log("Verified six yard clears, paced throws and two-voice victory breaks.");
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
