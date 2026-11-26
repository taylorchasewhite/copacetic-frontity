export function AtariArcade() {
  return (
    <details className="mb-8 rounded-md border border-primary-200 p-4">
      <summary className="cursor-pointer font-heading text-2xl font-bold">Play the original Atari cartridges</summary>
      <p className="my-2">Choose a game to play right here. No download required.</p>
      <form action="/atari/play.html" method="get" target="atari-homebrew-screen" className="mb-3 flex flex-wrap items-center gap-2">
        <label className="max-w-full">
          Cartridge{" "}
          <select name="game" className="max-w-full rounded border border-primary-300 p-1">
            <option value="super-step-bros">Super Step Bros.</option>
            <option value="skateboard-steve">The Adventures of Grumpy Gramps &amp; Skateboard Steve</option>
            <option value="simon-says">Simon Says</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-primary-800 px-3 py-2 font-semibold text-white">Play game</button>
        <a href="about:blank" target="atari-homebrew-screen" className="underline">Stop game</a>
      </form>
      <iframe
        name="atari-homebrew-screen"
        title="Atari 2600 emulator"
        srcDoc="<p>Choose a cartridge and press Play game.</p>"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        className="h-[min(680px,calc(76vw+170px))] w-full rounded"
      />
    </details>
  );
}
