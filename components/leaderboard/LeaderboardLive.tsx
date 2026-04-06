"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface LeaderboardEntry {
  rank: number;
  team_id: string;
  team_name: string;
  total_points: number;
  trail_points: number;
  no_exit_points: number;
  ai_points: number;
}

interface LeaderboardLiveProps {
  initialEntries: LeaderboardEntry[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeaderboardLive({ initialEntries }: LeaderboardLiveProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    async function refreshLeaderboard() {
      const response = await fetch("/api/leaderboard", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { entries: LeaderboardEntry[] };
      setEntries(data.entries || []);
    }

    const channel = supabase
      .channel("public:leaderboard_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leaderboard_updates",
        },
        () => {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          debounceTimer = setTimeout(() => {
            refreshLeaderboard();
          }, 400);
        }
      )
      .subscribe();

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-[rgba(200,120,60,0.25)] bg-[rgba(30,12,5,0.82)] backdrop-blur-sm">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-[rgba(200,120,60,0.25)] text-left text-xs uppercase tracking-[0.12em] text-[#c4a07a]">
            <th className="px-4 py-4">Rank</th>
            <th className="px-4 py-4">Team</th>
            <th className="px-4 py-4 text-right">Total</th>
            <th className="px-4 py-4 text-right">Trail</th>
            <th className="px-4 py-4 text-right">No Exit</th>
            <th className="px-4 py-4 text-right">AI</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#d4b896]">
                No leaderboard data yet. Scores will appear as teams play.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr
                key={entry.team_id}
                className="border-b border-[rgba(200,120,60,0.12)] text-sm text-[#f5e6c8] last:border-b-0"
              >
                <td className="px-4 py-4 font-bold">
                  <span
                    className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-xs ${
                      entry.rank === 1
                        ? "bg-yellow-500/20 text-yellow-300"
                        : entry.rank === 2
                          ? "bg-gray-400/20 text-gray-200"
                          : entry.rank === 3
                            ? "bg-amber-700/30 text-amber-200"
                            : "bg-[rgba(200,120,60,0.2)] text-[#f5e6c8]"
                    }`}
                  >
                    #{entry.rank}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold tracking-[0.03em]">{entry.team_name}</td>
                <td className="px-4 py-4 text-right font-extrabold text-amber-300">{entry.total_points}</td>
                <td className="px-4 py-4 text-right">{entry.trail_points}</td>
                <td className="px-4 py-4 text-right">{entry.no_exit_points}</td>
                <td className="px-4 py-4 text-right">{entry.ai_points}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
