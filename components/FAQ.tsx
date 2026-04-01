"use client";

const faqItems = [
  {
    question: "Who can participate in Techie Sleuths 26?",
    answer:
      "Any NSBM undergraduate student with interest in puzzles, coding, and collaborative problem solving can participate.",
  },
  {
    question: "How many members can be in a team?",
    answer:
      "A team should include 2 to 4 members.",
  },
  {
    question: "Do we need prior experience in areas like cybersecurity?",
    answer:
      "Not mandatory but will defineatly help. Challenges are designed with mixed difficulty and categories so both beginners and experienced participants can engage.",
  },
  {
    question: "Will the event be online or on-site?",
    answer:
      "Yes, the event will happen as an on-site event at the Univeristy premises. Stay upto date with community's channels for any changes",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
      <div className="relative z-[1] mx-auto max-w-4xl">
        <h2 className="mb-10 text-center text-[clamp(2rem,5vw,3rem)] font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8]">
          FAQ
        </h2>
        <div className="flex flex-col gap-4" aria-label="Frequently asked questions">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-[#c4a07a]/30 bg-[#1a1a1a]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#c4a07a]/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[1rem] font-semibold text-[#f5e6c8] transition-colors sm:text-[1.1rem] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#c4a07a]/50 text-[#c4a07a] transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-4 text-[0.95rem] leading-[1.8] text-[#c4a07a] sm:text-[1rem]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
