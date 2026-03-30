import SleuthShell from "./components/sleuth-shell";

const faqItems = [
  {
    question: "Who can participate in Techie Sleuths 26?",
    answer:
      "Any undergraduate student with interest in puzzles, coding, and collaborative problem solving can participate.",
  },
  {
    question: "How many members can be in a team?",
    answer:
      "A team should include 2 to 4 members. Individual participation can be allowed based on final event rules.",
  },
  {
    question: "Do we need prior cybersecurity experience?",
    answer:
      "Not mandatory. Challenges are designed with mixed difficulty so both beginners and experienced participants can engage.",
  },
  {
    question: "Will the event be online or on-site?",
    answer:
      "Event mode and schedule will be announced by the organizers. Keep checking official channels for updated logistics.",
  },
];

export default function Home() {
  return (
    <SleuthShell>
      <section id="home" className="section-anchor">
        
      </section>

      <div id="registrations" className="section-anchor hidden-anchor" aria-hidden="true" />

      <section id="about-us" className="copy-block section-anchor">
        <h1>ABOUT US</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining
          essentially unchanged.
        </p>
      </section>

      <section id="faq" className="faq-block section-anchor">
        <h1>FAQ</h1>
        <div className="faq-list" aria-label="Frequently asked questions">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div id="games" className="section-anchor hidden-anchor" aria-hidden="true" />
    </SleuthShell>
  );
}
