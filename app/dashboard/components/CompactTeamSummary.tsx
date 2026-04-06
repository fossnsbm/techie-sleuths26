import Link from "next/link";

interface CompactTeamSummaryProps {
  teamName: string;
  memberCount: number;
}

export default function CompactTeamSummary({ teamName, memberCount }: CompactTeamSummaryProps) {
  return (
    <div className="flex flex-col gap-3 border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.6)] px-6 py-4 transition hover:border-[rgba(200,120,60,0.4)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium uppercase tracking-[0.08em] text-[#d4b896]">
          Team:
        </span>
        <span className="font-bold uppercase tracking-[0.06em] text-[#f5e6c8]">
          {teamName}
        </span>
        <span className="text-sm text-[#c4a07a]">
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
      </div>
      <Link
        href="/dashboard/team"
        className="text-xs font-semibold uppercase tracking-[0.12em] text-[#c4a07a] transition hover:text-[#f5e6c8]"
      >
        VIEW DETAILS →
      </Link>
    </div>
  );
}
