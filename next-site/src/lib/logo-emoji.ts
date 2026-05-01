// Curated emoji set for the site logo. Mix of science, computing, nature,
// space, sports, and friendly faces — no food, no weapons, no negativity.

export const LOGO_EMOJI: readonly string[] = [
  // Science & lab
  "🧪", "🔬", "🧬", "⚗️", "🧫", "🔭", "🧲", "⚛️", "🩺", "💡",
  // Computing & engineering
  "💻", "🖥️", "⌨️", "🖱️", "🧠", "🤖", "🛰️", "📡", "🔌", "💾",
  "📀", "🧮", "📐", "📏", "🛠️", "⚙️", "🔧", "🔩",
  // Space
  "🚀", "🌌", "🪐", "🌠", "☄️", "🌑", "🌒", "🌓", "🌔", "🌕",
  "🌖", "🌗", "🌘", "🌙", "✨", "⭐", "🌟",
  // Nature
  "🌲", "🌳", "🌴", "🌵", "🌿", "🍀", "🌱", "🌷", "🌸", "🌹",
  "🌺", "🌻", "🌼", "🍁", "🍂", "🍃", "🌊", "⛰️", "🏔️", "🗻",
  "🏕️", "🌄", "🌅", "🌇", "🌈",
  // Weather
  "☀️", "⛅", "🌤️", "🌦️", "❄️", "⛄", "🔥",
  // Sports
  "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓",
  "🏸", "🥅", "⛳", "🏒", "🥌", "🎿", "🏂", "🏄", "🚴", "🏃",
  "🧗", "🏊",
  // Friendly faces
  "🙂", "😊", "😄", "😁", "😎", "🤓", "🧐", "🥳", "🤠", "🙌",
  "👋", "👨‍💻", "👨‍🔬", "👨‍🚀", "👨‍🏫", "🫡",
] as const;

/**
 * Pick an emoji deterministically from a numeric seed (e.g. day-of-year).
 * Stable per render so SSR doesn't mismatch the client.
 */
export function emojiForSeed(seed: number): string {
  const i = ((seed % LOGO_EMOJI.length) + LOGO_EMOJI.length) % LOGO_EMOJI.length;
  return LOGO_EMOJI[i];
}
