<?php
/**
 * Plugin Name: Atari Homebrew Player
 * Description: Play the three original cartridges on the Atari 2600 homebrew article.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

add_filter( 'the_content', static function ( $content ) {
	if ( is_admin() || is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query()
		|| 'atari-2600-homebrew-programming' !== get_post_field( 'post_name' ) ) {
		return $content;
	}

	$player = esc_url( plugins_url( 'play.html', __FILE__ ) );
	return '<details><summary><strong>Play the original Atari cartridges</strong></summary>
		<form method="get" action="' . $player . '" target="atari-homebrew-screen">
			<label>Cartridge <select name="game">
				<option value="super-step-bros">Super Step Bros.</option>
				<option value="skateboard-steve">The Adventures of Grumpy Gramps &amp; Skateboard Steve</option>
				<option value="simon-says">Simon Says</option>
			</select></label>
			<button type="submit">Play game</button>
			<a href="about:blank" target="atari-homebrew-screen">Stop game</a>
		</form>
		<iframe name="atari-homebrew-screen" title="Atari 2600 emulator" allow="autoplay; fullscreen; gamepad"
			allowfullscreen style="width:100%;height:min(680px,calc(76vw + 170px));border:0"
			srcdoc="<p>Choose a cartridge and press Play game.</p>"></iframe>
	</details>' . $content;
} );
