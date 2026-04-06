interface TeamMember {
  name: string;
  studentId: string;
}

interface TeamLeader {
  name: string;
  email: string;
  phone?: string;
}

interface TeamInfoCardProps {
  teamName: string;
  status: "pending" | "approved" | "rejected";
  leader: TeamLeader;
  members: TeamMember[];
}

export default function TeamInfoCard({ teamName, status, leader, members }: TeamInfoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-900/50 text-emerald-400 border-emerald-700/50";
      case "rejected":
        return "bg-red-900/50 text-red-400 border-red-700/50";
      case "pending":
      default:
        return "bg-amber-900/50 text-amber-400 border-amber-700/50";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="w-full border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.8)] p-6 transition hover:border-[rgba(200,120,60,0.5)] sm:p-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8]">
          {teamName}
        </h2>
        <span
          className={`inline-block border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${getStatusColor(status)}`}
        >
          {getStatusText(status)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Team Leader Section */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-[#d4b896]">
            Team Leader
          </h3>
          <div className="space-y-2 border-l-2 border-[rgba(200,120,60,0.3)] pl-4">
            <p className="text-[#f5e6c8]">
              <span className="text-[#c4a07a]">Name:</span> {leader.name}
            </p>
            <p className="text-[#f5e6c8]">
              <span className="text-[#c4a07a]">Email:</span> {leader.email}
            </p>
            <p className="text-[#f5e6c8]">
              <span className="text-[#c4a07a]">Phone:</span> {leader.phone || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(200,120,60,0.15)]" />

        {/* Team Members Section */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-[#d4b896]">
            Team Members ({members.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {members.map((member, index) => (
              <div
                key={index}
                className="border border-[rgba(200,120,60,0.15)] bg-[rgba(20,8,3,0.5)] p-3"
              >
                <p className="text-sm font-semibold text-[#f5e6c8]">{member.name}</p>
                <p className="text-xs text-[#c4a07a]">ID: {member.studentId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
