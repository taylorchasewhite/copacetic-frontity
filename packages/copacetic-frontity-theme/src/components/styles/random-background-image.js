import arctic from "../../assets/arctic.svg";
import beach from "../../assets/beach.svg";
import canyon from "../../assets/canyon.svg";
import desert from "../../assets/desert.svg";
import dottedFlowers from "../../assets/dotted-flowers.svg";
import farm from "../../assets/farm.svg";
import floralField from "../../assets/floral-field.svg";
import floralHawaiian from "../../assets/floral-hawaiian.svg";
import fruit from "../../assets/fruit.svg";
import happyHearts from "../../assets/happy-hearts.svg";
import hiker from "../../assets/hiker.svg";
import mountains from "../../assets/mountains.svg";
import neighborhood from "../../assets/neighborhood.svg";
import patternDimensions from "../../assets/pattern-dimensions.svg";
import patternFacets from "../../assets/pattern-facets.svg";
import patternFloral from "../../assets/pattern-floral.svg";
import patternShortlines from "../../assets/pattern-shortlines.svg";
import patternWiggles from "../../assets/pattern-wiggles.svg";
import rockies from "../../assets/rockies.svg";
import seaFloor from "../../assets/seafloor.svg";
import skylineChicago from "../../assets/skyline-chicago.svg";
import skylineHouston from "../../assets/skyline-houston.svg";
import skylineMadison from "../../assets/skyline-madison.svg";
import skylineMinneapolis from "../../assets/skyline-minneapolis.svg";
import skylineNewYork from "../../assets/skyline-newyork.svg";
import skylinePhiladelphia from "../../assets/skyline-philadelphia.svg";
import skylineStLouis from "../../assets/skyline-saint-louis.svg";
import spaceCosmos from "../../assets/space-cosmos.svg";
import spacePlanets from "../../assets/space-planets.svg";
import starsChalk from "../../assets/stars-chalk.svg";
import sunflowers from "../../assets/sunflowers.svg";
import valleyShores from "../../assets/valley-shores.svg";
import waterColorPaper from "../../assets/watercolor-paper.svg";


export function getRandomBackgroundImage() {
	let images = [
		arctic, beach, canyon, desert, dottedFlowers, farm, floralField, floralHawaiian, fruit,
		happyHearts, hiker, mountains, neighborhood, patternDimensions, patternFacets, patternFloral,
		patternShortlines, patternWiggles, rockies, seaFloor, skylineChicago, skylineHouston, skylineMadison,
		skylineMinneapolis, skylineNewYork, skylinePhiladelphia, skylineStLouis, spaceCosmos, spacePlanets,
		starsChalk, sunflowers, valleyShores, waterColorPaper
	];

	let maxCount = images.length;
	let randomIndex = Math.round(Math.random() * maxCount);
	return `${images[randomIndex]}`;
}