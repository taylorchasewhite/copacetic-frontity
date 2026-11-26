"use client";

import { useState } from "react";

const games = [
  { id: "super-step-bros", title: "Super Step Bros." },
  { id: "skateboard-steve", title: "The Adventures of Grumpy Gramps & Skateboard Steve" },
  { id: "simon-says", title: "Simon Says" },
];

export function AtariArcade() {
  const [playing, setPlaying] = useState<(typeof games)[number] | null>(null);

  return (
    <section aria-labelledby="arcade-heading" className="mb-8 rounded-md border border-primary-200 p-4">
      <h2 id="arcade-heading" className="font-heading text-2xl font-bold">Play the original cartridges</h2>
      <p className="my-2">Choose a game to play right here. No download required.</p>
      <div className="flex flex-wrap gap-2">
        {games.map((game) => (
          <a
            key={game.id}
            href={`/atari/play.html?game=${game.id}`}
            aria-current={playing === game ? "true" : undefined}
            className="rounded border border-primary-300 px-3 py-2 font-semibold underline hover:bg-primary-50 aria-[current=true]:bg-primary-100"
            onClick={(event) => {
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              setPlaying(game);
            }}
          >
            {game.title}
          </a>
        ))}
      </div>
      {playing && (
        <>
          <div className="mt-4 flex items-center justify-between gap-3">
            <strong aria-live="polite">Playing: {playing.title}</strong>
            <button type="button" className="shrink-0 underline" onClick={() => setPlaying(null)}>Stop game</button>
          </div>
          <iframe
            key={playing.id}
            src={`/atari/play.html?game=${playing.id}`}
            title={`${playing.title} Atari 2600 emulator`}
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            className="mt-2 h-[min(640px,calc(76vw+170px))] w-full rounded bg-black"
          />
        </>
      )}
    </section>
  );
}
