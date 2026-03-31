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

  const removeMember = () => {
    if (form.teamMembers.length > 0) {
      const members = form.teamMembers.filter((_, i) => i !== currentMemberIndex);
      setForm((prev) => ({ ...prev, teamMembers: members }));
      setCurrentMemberIndex(Math.max(0, currentMemberIndex - 1));
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

  return (
    <section className="registration-section">
      <div className="registration-container">
        <h1 className="registration-title">REGISTRATION</h1>

        {submitted ? (
          <div className="success-message">
            <p>✔ Team registered successfully!</p>
          </div>
        ) : (
          <form className="registration-form" onSubmit={handleSubmit}>
            {/* Team Details */}
            <div className="form-group">
              <label>TEAM NAME</label>
              <input
                type="text"
                placeholder="Team Name"
                value={form.teamName}
                onChange={(e) => handleInputChange(e, "teamName")}
                required
              />
            </div>

            <div className="form-group">
              <label>TEAM EMAIL</label>
              <input
                type="email"
                placeholder="user@students.nsbm.ac.lk"
                value={form.teamEmail}
                onChange={(e) => handleInputChange(e, "teamEmail")}
                required
              />
            </div>

            <div className="form-group">
              <label>TEAM CONTACT NO.</label>
              <input
                type="tel"
                placeholder="07XXXXXXXXX"
                value={form.teamContact}
                onChange={(e) => handleInputChange(e, "teamContact")}
                required
              />
            </div>

            <div className="form-group">
              <label>TEAM PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.teamPassword}
                onChange={(e) => handleInputChange(e, "teamPassword")}
                required
              />
            </div>

            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                required
              />
            </div>

            {/* Team Members */}
            <div className="team-members-section">
              <div className="members-header">
                <h3>TEAM MEMBERS</h3>
                <button
                  type="button"
                  className="add-member-btn"
                  onClick={addMember}
                  disabled={form.teamMembers.length >= 4}
                >
                  ADD MEMBER
                </button>
              </div>
              <p className="members-info">MINIMUM 2, MAXIMUM 4 MEMBERS ALLOWED</p>

              {form.teamMembers.length > 0 && (
                <div className="member-carousel">
                  <div className="carousel-controls">
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={goToPrevMember}
                      disabled={currentMemberIndex === 0}
                    >
                      ‹
                    </button>
                    <span className="member-count">
                      {currentMemberIndex + 1} / {form.teamMembers.length}
                    </span>
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={goToNextMember}
                      disabled={currentMemberIndex === form.teamMembers.length - 1}
                    >
                      ›
                    </button>
                  </div>

                  {currentMember && (
                    <div className="member-form">
                      <div className="member-field">
                        <label>NAME</label>
                        <input
                          type="text"
                          placeholder="FULL NAME"
                          value={currentMember.name}
                          onChange={(e) => handleMemberChange(e, "name")}
                        />
                      </div>
                      <div className="member-field">
                        <label>STUDENT ID</label>
                        <input
                          type="text"
                          placeholder="STUDENT ID NUMBER"
                          value={currentMember.studentId}
                          onChange={(e) => handleMemberChange(e, "studentId")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Team Leader */}
            <div className="team-leader-section">
              <div className="leader-title">TEAM LEADER</div>
              <div className="leader-fields">
                <div className="leader-field">
                  <label>NAME</label>
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={form.teamLeader.name}
                    onChange={(e) => handleLeaderChange(e, "name")}
                    required
                  />
                </div>
                <div className="leader-field">
                  <label>STUDENT ID</label>
                  <input
                    type="text"
                    placeholder="STUDENT ID NUMBER"
                    value={form.teamLeader.studentId}
                    onChange={(e) => handleLeaderChange(e, "studentId")}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn">
              REGISTER TEAM
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .registration-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a0a02;
          padding: 40px 20px;
        }

        .registration-container {
          width: 100%;
          max-width: 650px;
        }

        .registration-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: #f5e6c8;
          margin-bottom: 40px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .registration-form {
          border: 2px solid #c87838;
          border-radius: 8px;
          padding: 40px 30px;
          background-color: rgba(18, 6, 2, 0.8);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #f5e6c8;
          margin-bottom: 8px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          background-color: rgba(60, 40, 20, 0.6);
          border: 1px solid rgba(200, 120, 60, 0.3);
          border-radius: 4px;
          color: #f5e6c8;
          font-size: 0.9rem;
          box-sizing: border-box;
        }

        .form-group input::placeholder {
          color: #998866;
        }

        .form-group input:focus {
          outline: none;
          background-color: rgba(80, 50, 20, 0.8);
          border-color: rgba(200, 120, 60, 0.6);
        }

        .team-members-section {
          background-color: rgba(18, 6, 2, 0.6);
          border: 1px solid rgba(200, 120, 60, 0.2);
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .members-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .members-header h3 {
          color: #f5e6c8;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin: 0;
          text-transform: uppercase;
        }

        .add-member-btn {
          background-color: #c87838;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background-color 0.3s;
          text-transform: uppercase;
        }

        .add-member-btn:hover:not(:disabled) {
          background-color: #a85e2a;
        }

        .add-member-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .members-info {
          font-size: 0.7rem;
          color: #998866;
          margin: 0 0 15px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .member-carousel {
          background-color: rgba(40, 20, 10, 0.4);
          border-radius: 4px;
          padding: 20px;
        }

        .carousel-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .carousel-btn {
          background: none;
          border: none;
          color: #c87838;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .carousel-btn:disabled {
          color: #664422;
          cursor: not-allowed;
        }

        .member-count {
          color: #998866;
          font-size: 0.85rem;
          min-width: 50px;
          text-align: center;
        }

        .member-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .member-field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #d4b896;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .member-field input {
          width: 100%;
          padding: 10px 12px;
          background-color: rgba(60, 40, 20, 0.6);
          border: 1px solid rgba(200, 120, 60, 0.3);
          border-radius: 4px;
          color: #f5e6c8;
          font-size: 0.85rem;
          box-sizing: border-box;
        }

        .member-field input::placeholder {
          color: #886644;
        }

        .team-leader-section {
          background-color: rgba(18, 6, 2, 0.6);
          border: 1px solid rgba(200, 120, 60, 0.2);
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .leader-title {
          color: #f5e6c8;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 15px;
          text-transform: uppercase;
        }

        .leader-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .leader-field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #d4b896;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .leader-field input {
          width: 100%;
          padding: 10px 12px;
          background-color: rgba(60, 40, 20, 0.6);
          border: 1px solid rgba(200, 120, 60, 0.3);
          border-radius: 4px;
          color: #f5e6c8;
          font-size: 0.85rem;
          box-sizing: border-box;
        }

        .leader-field input::placeholder {
          color: #886644;
        }

        .register-btn {
          width: 100%;
          padding: 14px;
          background-color: #c87838;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background-color 0.3s;
          text-transform: uppercase;
        }

        .register-btn:hover {
          background-color: #a85e2a;
        }

        .success-message {
          text-align: center;
          padding: 40px;
          color: #d4b896;
          font-size: 1.1rem;
        }
      `}</style>
    </section>
  );
}
