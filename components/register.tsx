"use client";

import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  studentId: string;
}

interface FormState {
  teamName: string;
  teamEmail: string;
  teamContact: string;
  teamPassword: string;
  confirmPassword: string;
  teamMembers: TeamMember[];
  teamLeader: TeamMember;
}

export default function RegForm() {
  const [form, setForm] = useState<FormState>({
    teamName: "",
    teamEmail: "",
    teamContact: "",
    teamPassword: "",
    confirmPassword: "",
    teamMembers: [],
    teamLeader: { id: "leader", name: "", studentId: "" },
  });

  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLeaderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setForm((prev) => ({
      ...prev,
      teamLeader: { ...prev.teamLeader, [field]: e.target.value },
    }));
  };

  const handleMemberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const members = [...form.teamMembers];
    members[currentMemberIndex] = {
      ...members[currentMemberIndex],
      [field]: e.target.value,
    };
    setForm((prev) => ({ ...prev, teamMembers: members }));
  };

  const addMember = () => {
    if (form.teamMembers.length < 4) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: "",
        studentId: "",
      };
      setForm((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember],
      }));
      setCurrentMemberIndex(form.teamMembers.length);
    }
  };

  const goToPrevMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  const goToNextMember = () => {
    if (currentMemberIndex < form.teamMembers.length - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Team registration submitted:", form);
    setSubmitted(true);
  };

  const currentMember = form.teamMembers[currentMemberIndex];
  const inputBaseClass =
    "w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:border-[rgba(200,120,60,0.6)] focus:bg-[rgba(80,50,20,0.8)]";

  return (
    <section id="register" className="flex min-h-screen items-center justify-center bg-[#1a0a02] px-5 py-10">
      <div className="w-full max-w-[650px]">
        <h1 className="mb-10 text-center text-4xl font-bold tracking-[0.12em] text-[#f5e6c8] md:text-5xl">
          REGISTRATION
        </h1>

        {submitted ? (
          <div className="py-10 text-center text-lg text-[#d4b896]">
            <p>✔ Team registered successfully!</p>
          </div>
        ) : (
          <form
            className="rounded-lg border-2 border-[#c87838] bg-[rgba(18,6,2,0.8)] px-4 py-8 sm:px-7"
            onSubmit={handleSubmit}
          >
            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM NAME
              </label>
              <input
                type="text"
                placeholder="Team Name"
                value={form.teamName}
                onChange={(e) => handleInputChange(e, "teamName")}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM EMAIL
              </label>
              <input
                type="email"
                placeholder="user@students.nsbm.ac.lk"
                value={form.teamEmail}
                onChange={(e) => handleInputChange(e, "teamEmail")}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM CONTACT NO.
              </label>
              <input
                type="tel"
                placeholder="07XXXXXXXXX"
                value={form.teamContact}
                onChange={(e) => handleInputChange(e, "teamContact")}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.teamPassword}
                onChange={(e) => handleInputChange(e, "teamPassword")}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="mb-5 rounded border border-[rgba(200,120,60,0.2)] bg-[rgba(18,6,2,0.6)] p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-[0.08em] text-[#f5e6c8]">
                  TEAM MEMBERS
                </h3>
                <button
                  type="button"
                  className="rounded bg-[#c87838] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#a85e2a] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={addMember}
                  disabled={form.teamMembers.length >= 4}
                >
                  ADD MEMBER
                </button>
              </div>
              <p className="mb-4 text-[11px] tracking-[0.05em] text-[#998866]">
                MINIMUM 2, MAXIMUM 4 MEMBERS ALLOWED
              </p>

              {form.teamMembers.length > 0 && (
                <div className="rounded bg-[rgba(40,20,10,0.4)] p-5">
                  <div className="mb-5 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      className="text-2xl leading-none text-[#c87838] disabled:cursor-not-allowed disabled:text-[#664422]"
                      onClick={goToPrevMember}
                      disabled={currentMemberIndex === 0}
                    >
                      ‹
                    </button>
                    <span className="min-w-12 text-center text-sm text-[#998866]">
                      {currentMemberIndex + 1} / {form.teamMembers.length}
                    </span>
                    <button
                      type="button"
                      className="text-2xl leading-none text-[#c87838] disabled:cursor-not-allowed disabled:text-[#664422]"
                      onClick={goToNextMember}
                      disabled={currentMemberIndex === form.teamMembers.length - 1}
                    >
                      ›
                    </button>
                  </div>

                  {currentMember && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-[#d4b896]">
                          NAME
                        </label>
                        <input
                          type="text"
                          placeholder="FULL NAME"
                          value={currentMember.name}
                          onChange={(e) => handleMemberChange(e, "name")}
                          className={inputBaseClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-[#d4b896]">
                          STUDENT ID
                        </label>
                        <input
                          type="text"
                          placeholder="STUDENT ID NUMBER"
                          value={currentMember.studentId}
                          onChange={(e) => handleMemberChange(e, "studentId")}
                          className={inputBaseClass}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-5 rounded border border-[rgba(200,120,60,0.2)] bg-[rgba(18,6,2,0.6)] p-5">
              <div className="mb-3 text-sm font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM LEADER
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-[#d4b896]">
                    NAME
                  </label>
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={form.teamLeader.name}
                    onChange={(e) => handleLeaderChange(e, "name")}
                    required
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-[#d4b896]">
                    STUDENT ID
                  </label>
                  <input
                    type="text"
                    placeholder="STUDENT ID NUMBER"
                    value={form.teamLeader.studentId}
                    onChange={(e) => handleLeaderChange(e, "studentId")}
                    required
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-[#c87838] px-4 py-3.5 text-sm font-semibold tracking-[0.08em] text-white transition hover:bg-[#a85e2a]"
            >
              REGISTER TEAM
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
