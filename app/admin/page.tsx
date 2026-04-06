'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  deleteAdminTeam,
  getAdminTeams,
  setAdminTeamPassword,
  updateAdminTeamDetails,
  type AdminTeamRecord
} from '@/app/actions/admin-teams'

interface EditState {
  teamName: string
  teamLeaderName: string
  teamLeaderPhone: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function AdminDashboardPage() {
  const [teams, setTeams] = useState<AdminTeamRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<AdminTeamRecord | null>(null)
  const [passwordModalTeam, setPasswordModalTeam] = useState<AdminTeamRecord | null>(null)
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editState, setEditState] = useState<EditState>({
    teamName: '',
    teamLeaderName: '',
    teamLeaderPhone: '',
    status: 'pending'
  })

  async function loadTeams() {
    setIsLoading(true)
    const data = await getAdminTeams()
    setTeams(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const openEditModal = (team: AdminTeamRecord) => {
    setSelectedTeam(team)
    setEditState({
      teamName: team.team_name,
      teamLeaderName: team.team_leader_name,
      teamLeaderPhone: team.team_leader_phone || '',
      status: (team.status || 'pending') as 'pending' | 'approved' | 'rejected'
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedTeam) return
    setIsSaving(true)
    const result = await updateAdminTeamDetails(selectedTeam.id, editState)
    setIsSaving(false)

    if (!result.success) {
      toast.error('Update failed', { description: result.message })
      return
    }

    toast.success('Team updated', { description: result.message })
    setSelectedTeam(null)
    await loadTeams()
  }

  const handlePasswordSet = async () => {
    if (!passwordModalTeam) return
    setIsSaving(true)
    const result = await setAdminTeamPassword(passwordModalTeam.id, password)
    setIsSaving(false)

    if (!result.success) {
      toast.error('Password update failed', { description: result.message })
      return
    }

    toast.success('Password updated', { description: result.message })
    setPassword('')
    setPasswordModalTeam(null)
  }

  const handleDeleteTeam = async (team: AdminTeamRecord) => {
    const confirmed = window.confirm(`Delete team "${team.team_name}" and its user account permanently?`)
    if (!confirmed) return

    setIsSaving(true)
    const result = await deleteAdminTeam(team.id)
    setIsSaving(false)

    if (!result.success) {
      toast.error('Delete failed', { description: result.message })
      return
    }

    toast.success('Team deleted', { description: result.message })
    await loadTeams()
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8]">Admin Dashboard</h1>
        <p className="text-[#c4a07a]">Manage registered teams, passwords, and account access.</p>
      </section>

      <section className="overflow-x-auto rounded-lg border border-[rgba(200,120,60,0.25)] bg-[rgba(30,12,5,0.82)] backdrop-blur-sm">
        {isLoading ? (
          <div className="p-8 text-center text-[#d4b896]">Loading teams...</div>
        ) : (
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-[rgba(200,120,60,0.2)] text-left text-xs uppercase tracking-[0.12em] text-[#c4a07a]">
                <th className="px-4 py-4">Team</th>
                <th className="px-4 py-4">Leader</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Points</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-[rgba(200,120,60,0.12)] text-sm text-[#f5e6c8] last:border-b-0">
                  <td className="px-4 py-4 font-semibold">{team.team_name}</td>
                  <td className="px-4 py-4">{team.team_leader_name}</td>
                  <td className="px-4 py-4">{team.team_leader_email}</td>
                  <td className="px-4 py-4 uppercase">{team.status || 'pending'}</td>
                  <td className="px-4 py-4 text-right font-bold text-amber-300">{team.total_points}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(team)}
                        className="border border-[rgba(200,120,60,0.3)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#d4b896] transition hover:border-[rgba(200,120,60,0.6)] hover:text-[#f5e6c8]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setPasswordModalTeam(team)
                          setPassword('')
                        }}
                        className="border border-blue-400/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-blue-200 transition hover:border-blue-300/60"
                      >
                        Set Password
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team)}
                        disabled={isSaving}
                        className="border border-red-500/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-red-300 transition hover:border-red-400 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSelectedTeam(null)} />
          <div className="relative w-full max-w-xl rounded-lg border border-[rgba(200,120,60,0.35)] bg-[rgba(18,6,2,0.98)] p-6">
            <h2 className="mb-5 text-xl font-bold uppercase tracking-[0.1em] text-[#f5e6c8]">Edit Team</h2>

            <div className="space-y-4">
              <input
                value={editState.teamName}
                onChange={(e) => setEditState((prev) => ({ ...prev, teamName: e.target.value }))}
                placeholder="Team name"
                className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8]"
              />
              <input
                value={editState.teamLeaderName}
                onChange={(e) => setEditState((prev) => ({ ...prev, teamLeaderName: e.target.value }))}
                placeholder="Leader name"
                className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8]"
              />
              <input
                value={editState.teamLeaderPhone}
                onChange={(e) => setEditState((prev) => ({ ...prev, teamLeaderPhone: e.target.value }))}
                placeholder="07XXXXXXXX"
                className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8]"
              />
              <select
                value={editState.status}
                onChange={(e) => setEditState((prev) => ({ ...prev, status: e.target.value as 'pending' | 'approved' | 'rejected' }))}
                className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTeam(null)}
                className="border border-[rgba(200,120,60,0.3)] px-4 py-2 text-sm text-[#d4b896]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="bg-[#c87838] px-4 py-2 text-sm font-semibold text-[#1a0a02] disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setPasswordModalTeam(null)} />
          <div className="relative w-full max-w-lg rounded-lg border border-[rgba(200,120,60,0.35)] bg-[rgba(18,6,2,0.98)] p-6">
            <h2 className="mb-5 text-xl font-bold uppercase tracking-[0.1em] text-[#f5e6c8]">Set Team Password</h2>
            <p className="mb-3 text-sm text-[#c4a07a]">{passwordModalTeam.team_name}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8]"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPasswordModalTeam(null)}
                className="border border-[rgba(200,120,60,0.3)] px-4 py-2 text-sm text-[#d4b896]"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSet}
                disabled={isSaving || password.length < 8}
                className="bg-[#c87838] px-4 py-2 text-sm font-semibold text-[#1a0a02] disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
