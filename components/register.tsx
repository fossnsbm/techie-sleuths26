"use client";

import { useEffect, useRef, useState } from "react";
import * as z from 'zod'

// Zod schemas
const teamMember = z.object({
  name: z.string().min(1, "Name is required"),
  studentId: z.string().regex(/[0-9]{5}/, "Invalid Student Id")
})

const registrationSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  teamEmail: z.email("Invalid email").regex(/@students\.nsbm\.ac\.lk$/, "Must be an NSBM student email"),
  teamContact: z.string().regex(/^07\d{8}$/, "Contact must be in format 07XXXXXXXX"),
  teamPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  teamMembers: z.array(teamMember).min(2, "At least 2 members required").max(4, "Maximum 4 members allowed")
}).refine((data) => data.teamPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type TeamMember = z.infer<typeof teamMember>
type RegistrationFormData = z.infer<typeof registrationSchema>

export default function RegForm() {
  const getMemberLabel = (index: number): string => {
    if (index === 0) return "TEAM LEADER";
    return `MEMBER ${index + 1}`;
  };

  const registrationSection = useRef<HTMLFormElement>(null);

  const [memberCount, setMemberCount] = useState(2);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (errors.length > 0 && registrationSection.current) {
      registrationSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [errors]);

  const addMember = () => {
    if (memberCount < 4) {
      setMemberCount(prev => prev + 1);
      setCurrentMemberIndex(memberCount);
    }
  };

  const removeMember = () => {
    if (memberCount > 2 && currentMemberIndex >= 2) {
      setMemberCount(prev => prev - 1);

      if (currentMemberIndex >= memberCount - 1) {
        setCurrentMemberIndex(memberCount - 2);
      }
    }
  };

  const goToPrevMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  const goToNextMember = () => {
    if (currentMemberIndex < memberCount - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const handleSubmit = (formData: FormData) => {
    setErrors([]);

    const teamMembers: TeamMember[] = []

    for (let i = 0; i < memberCount; i++) {
      const name = formData.get(`teamMembers[${i}].name`);
      const studentId = formData.get(`teamMembers[${i}].studentId`);
      if (name && studentId) {
        teamMembers.push({
          name: name.toString(),
          studentId: studentId.toString()
        });
      }
    }

    const data = {
      ...Object.fromEntries(formData), teamMembers
    };

    const registration = registrationSchema.safeParse(data);

    if (!registration.success) {
      const errorMessages = registration.error.issues.map(err =>
        `${err.path.join('.')}: ${err.message}`
      );
      setErrors(errorMessages);
      return;
    }

    console.log("Team registration submitted", registration.data);
    setSubmitted(true);
  };

  const inputBaseClass =
    "w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:border-[rgba(200,120,60,0.6)] focus:bg-[rgba(80,50,20,0.8)]";

  return (
    <section id="register" ref={registrationSection} className="flex min-h-screen items-center justify-center bg-[#1a0a02] px-5 py-10">
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
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(new FormData(e.currentTarget))
            }}
          >
            {errors.length > 0 && (
              <div className="mb-5 rounded border border-red-500/30 bg-red-900/20 p-4">
                <p className="mb-2 text-sm font-semibold text-red-400">Please fix the following errors:</p>
                <ul className="list-inside list-disc space-y-1 text-xs text-red-300">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
                TEAM NAME
              </label>
              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
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
                name="teamEmail"
                placeholder="student@students.nsbm.ac.lk"
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
                name="teamContact"
                placeholder="07XXXXXXXXX"
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
                name="teamPassword"
                placeholder="••••••••"
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
                name="confirmPassword"
                placeholder="••••••••"
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
                  disabled={memberCount >= 4}
                >
                  ADD MEMBER
                </button>
              </div>
              <p className="mb-4 text-[11px] tracking-[0.05em] text-[#998866]">
                MINIMUM 2, MAXIMUM 4 MEMBERS ALLOWED
              </p>

              {memberCount > 0 && (
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
                      {currentMemberIndex + 1} / {memberCount}
                    </span>
                    <button
                      type="button"
                      className="text-2xl leading-none text-[#c87838] disabled:cursor-not-allowed disabled:text-[#664422]"
                      onClick={goToNextMember}
                      disabled={currentMemberIndex === memberCount - 1}
                    >
                      ›
                    </button>

                    {/* Remove button - only show for optional members (index >= 2) */}
                    {currentMemberIndex >= 2 && (
                      <button
                        type="button"
                        className="ml-2 text-lg leading-none text-red-400 hover:text-red-300 transition"
                        onClick={removeMember}
                        aria-label="Remove member"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Render all member inputs but only show current one */}
                  {Array.from({ length: memberCount }).map((_, index) => (
                    <div
                      key={index}
                      className={`${index === currentMemberIndex ? '' : 'hidden'}`}
                    >
                      {/* Member Label */}
                      <div className="mb-3 text-sm font-semibold tracking-[0.08em] text-[#f5e6c8]">
                        {getMemberLabel(index)}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-[#d4b896]">
                            NAME
                          </label>
                          <input
                            type="text"
                            name={`teamMembers[${index}].name`}
                            placeholder="FULL NAME"
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
                            name={`teamMembers[${index}].studentId`}
                            placeholder="STUDENT ID NUMBER"
                            required
                            className={inputBaseClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
