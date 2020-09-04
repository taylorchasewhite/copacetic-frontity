const settings = {
  "name": "copacetic-frontity",
  "state": {
    "frontity": {
      "url": "https://test.frontity.org",
      "title": "Test Frontity Blog",
      "description": "WordPress installation for Frontity development"
    }
  },
"packages": [
	{
		name: "copacetic-frontity-theme",
		state: {
			theme: {
				// The logo can be a text or an image url
				logo: "TaylorChaseWhite",
				// show background pattern
				showBackgroundPattern: true,
				// show social links
				showSocialLinks: true,
				// the top-level navigation labels and links
				"menu": [
					[
					  "Home",
					  "/"
					],
					[
					  "Nature",
					  "/category/nature/"
					],
					[
					  "Travel",
					  "/category/travel/"
					],
					[
					  "Japan",
					  "/tag/japan/"
					],
					[
					  "About Us",
					  "/about-us/"
					]
				],
				// the social links
				socialLinks: [
					["facebook", "https://www.facebook.com/taylorchasewhite/"],
					["twitter", "https://twitter.com/taychasewhite/"],
					["linkedin", "https://www.linkedin.com/in/taylorchasewhite/"],
					["instagram", "https://www.instagram.com/taylorchasewhite/"]
				],
				// color shades to use in the blog
				colors: {
					primary: {
						"50": "#e9f5f2",
						"100": "#d4dcd9",
						"200": "#bbc3be",
						"300": "#a1aba5",
						"400": "#87938b",
						"500": "#6d7972",
						"600": "#555f58",
						"700": "#000000",
						"800": "#000000",
						"900": "#000000"
					},
					accent: {
						"50": "#e6f3fe",
						"100": "#80c2f9",
						"200": "#7bcfff",
						"300": "#49bbff",
						"400": "#1aa8ff",
						"500": "#008ee6",
						"600": "#006fb4",
						"700": "#004f82",
						"800": "#002f51",
						"900": "#001121"
					}
				}
			}
		}
	},
    {
      "name": "@frontity/wp-source",
      "state": {
        "source": {
          "api": "https://test.frontity.org/wp-json"
        }
      }
    },
    "@frontity/tiny-router",
    "@frontity/html2react"
  ]
};

export default settings;
