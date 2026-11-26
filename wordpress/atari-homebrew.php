<?php
/**
 * Plugin Name: Atari Homebrew Player
 * Description: Play the original and revamped cartridges on the Atari 2600 homebrew article.
 * Version: 2.1.0
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', static function () {
	if ( is_single( 'atari-2600-homebrew-programming' ) ) {
		wp_enqueue_style( 'atari-homebrew', plugins_url( 'arcade.css', __FILE__ ), array(), '2.0.0' );
	}
} );

add_filter( 'the_content', static function ( $content ) {
	if ( is_admin() || is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query()
		|| 'atari-2600-homebrew-programming' !== get_post_field( 'post_name' ) ) {
		return $content;
	}

	$player = esc_url( plugins_url( 'play.html', __FILE__ ) );
	return '<details open class="atari-arcade">
		<summary><span>Homebrew arcade</span>Play the Atari cartridges</summary>
		<form method="get" action="' . $player . '" target="atari-homebrew-screen">
			<input type="hidden" name="v" value="2.1.0">
			<label>Cartridge <select name="game">
				<optgroup label="College originals">
					<option value="super-step-bros">Super Step Bros.</option>
					<option value="skateboard-steve">The Adventures of Grumpy Gramps &amp; Skateboard Steve</option>
					<option value="simon-says">Simon Says</option>
				</optgroup>
				<optgroup label="Revamped editions">
					<option value="super-step-bros-revamped">Super Step Bros.: Switchback Rescue (Revamped)</option>
					<option value="skateboard-steve-revamped">Skateboard Steve: Gramps&#39; Backyard (Revamped)</option>
					<option value="simon-says-revamped">Simon Says: Echo (Revamped)</option>
				</optgroup>
			</select></label>
			<button type="submit">Play game</button>
			<a href="about:blank" target="atari-homebrew-screen">Stop game</a>
		</form>
		<noscript>Enable JavaScript to play these cartridges.</noscript>
		<iframe name="atari-homebrew-screen" title="Atari 2600 emulator" allow="autoplay; fullscreen; gamepad"
			allowfullscreen></iframe>
	</details>' . $content;
} );
