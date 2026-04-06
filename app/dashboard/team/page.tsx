import TeamInfoCard from "../components/TeamInfoCard";
import Link from "next/link";

// Mock team data (same as dashboard for now)
const MOCK_TEAM = {
  name: "The Baker Street Irregulars",
  leader: {
    name: "Sherlock Holmes",
    email: "sherlock@students.nsbm.ac.lk",
    phone: "0771234567"
  },
  members: [
    { name: "Sherlock Holmes", studentId: "12345" },
    { name: "John Watson", studentId: "12346" },
    { name: "Irene Adler", studentId: "12347" }
  ],
  status: "pending" as const
};

export default function TeamPage() {
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
            {MOCK_TEAM.name}
          </h1>
          <p className="text-lg text-[#c4a07a] sm:text-xl">
            Team Information & Members
          </p>
        </section>

        {/* Team Details Card */}
        <section>
          <TeamInfoCard
            teamName={MOCK_TEAM.name}
            status={MOCK_TEAM.status}
            leader={MOCK_TEAM.leader}
            members={MOCK_TEAM.members}
          />
        </section>
      </div>
    </div>
  );
}
