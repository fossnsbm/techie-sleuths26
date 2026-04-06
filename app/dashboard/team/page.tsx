import TeamInfoCard from "../components/TeamInfoCard";
import Link from "next/link";
import { getAuthenticatedTeam } from "@/lib/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  // Fetch authenticated team data
  const team = await getAuthenticatedTeam();

  // This shouldn't happen due to middleware, but handle gracefully
  if (!team) {
    redirect('/login');
  }

  // Build leader object from team data
  const leader = {
    name: team.team_leader_name,
    email: team.team_leader_email,
    phone: team.team_leader_phone || undefined
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link 
                href="/dashboard" 
                className="font-medium uppercase tracking-[0.08em] text-[#c4a07a] transition hover:text-[#f5e6c8]"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <span className="text-[#d4b896]">/</span>
            </li>
            <li>
              <span className="font-medium uppercase tracking-[0.08em] text-[#f5e6c8]">
                Team
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Heading */}
        <section className="mb-8 sm:mb-10">
          <h1 className="mb-3 text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] md:tracking-[0.1em]">
            {team.team_name}
          </h1>
          <p className="text-lg text-[#c4a07a] sm:text-xl">
            Team Information & Members
          </p>
        </section>

        {/* Team Details Card */}
        <section>
          <TeamInfoCard
            teamName={team.team_name}
            status={(team.status || 'pending') as "pending" | "approved" | "rejected"}
            leader={leader}
            members={team.team_members}
          />
        </section>
      </div>
    </div>
  );
}
