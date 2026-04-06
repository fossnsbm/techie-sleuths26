interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.8)] p-6 text-center transition hover:-translate-y-1 hover:border-[rgba(200,120,60,0.5)] sm:p-8">
      {icon && (
        <div className="mb-3 text-[#d4b896] opacity-60">
          {icon}
        </div>
      )}
      <div className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-none text-[#f5e6c8]">
        {value}
      </div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d4b896]">
        {label}
      </div>
    </div>
  );
}
