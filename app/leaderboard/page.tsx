import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeaderboardLive from "@/components/leaderboard/LeaderboardLive";
import { getPublicLeaderboard } from "@/app/actions/leaderboard";

export const revalidate = 30;

export default async function LeaderboardPage() {
  const initialEntries = await getPublicLeaderboard();

  return (
    <div className="min-h-screen text-white site-background">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <section className="mb-10 text-center">
            <h1 className="mb-3 text-[clamp(1.8rem,5vw,3rem)] font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8]">
              Public Leaderboard
            </h1>
            <p className="text-[#c4a07a] text-base sm:text-lg">
              Live standings for all teams across Trail of Shadows, No Exit, and AI Interrogation.
            </p>
          </section>

          <LeaderboardLive initialEntries={initialEntries} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
