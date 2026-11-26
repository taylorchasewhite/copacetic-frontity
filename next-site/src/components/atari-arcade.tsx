import "../../public/atari/arcade.css";

export function AtariArcade() {
  return (
    <details open className="atari-arcade">
      <summary><span>Homebrew arcade</span>Play the Atari cartridges</summary>
      <form action="/atari/play.html" method="get" target="atari-homebrew-screen">
        <label>
          Cartridge
          <select name="game">
            <optgroup label="College originals">
              <option value="super-step-bros">Super Step Bros.</option>
              <option value="skateboard-steve">The Adventures of Grumpy Gramps &amp; Skateboard Steve</option>
              <option value="simon-says">Simon Says</option>
            </optgroup>
            <optgroup label="Revamped editions">
              <option value="super-step-bros-revamped">Super Step Bros.: Switchback Rescue (Revamped)</option>
              <option value="skateboard-steve-revamped">Skateboard Steve: Flowerpot Alley (Revamped)</option>
              <option value="simon-says-revamped">Simon Says: Echo (Revamped)</option>
            </optgroup>
          </select>
        </label>
        <button type="submit">Play game</button>
        <a href="about:blank" target="atari-homebrew-screen">Stop game</a>
      </form>
      <noscript>Enable JavaScript to play these cartridges.</noscript>
      <iframe
        name="atari-homebrew-screen"
        title="Atari 2600 emulator"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
      />
    </details>
  );
}
