'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Plus,
  RefreshCw,
  LogOut,
  Smartphone,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react'

interface Volunteer {
  id: string
  created_at: string
  username: string
  name: string
  gate: string
  is_active: boolean
  is_logged_in: boolean
  last_login_at: string | null
  scansCount: number
}

interface StudentRecord {
  id: string
  roll_number: string
  full_name: string
  email: string
  program: string
  year_of_study: string
  status: string
  marked_at: string | null
  marked_by: string | null
}

export default function AdminDashboardPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'attendance' | 'volunteers'>('attendance')

  // Stats & Students
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percent: 0 })
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL')
  const [volunteerFilter, setVolunteerFilter] = useState('ALL')
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Volunteers
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loadingVolunteers, setLoadingVolunteers] = useState(false)

  // New Volunteer Form
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newGate, setNewGate] = useState('Gate 1 · Main Foyer')
  const [volunteerFormError, setVolunteerFormError] = useState('')
  const [volunteerFormSuccess, setVolunteerFormSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [creatingVolunteer, setCreatingVolunteer] = useState(false)

  // Load admin token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glc_admin_token')
    if (saved) {
      setAdminToken(saved)
    }
  }, [])

  // Auto-fetch data when token is available
  useEffect(() => {
    if (adminToken) {
      fetchStudents()
      fetchVolunteers()
    }
  }, [adminToken])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      })

      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('glc_admin_token', data.token)
        setAdminToken(data.token)
        setAdminPassword('')
      } else {
        setLoginError(data.error || 'Invalid admin password.')
      }
    } catch {
      setLoginError('Network error logging in.')
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('glc_admin_token')
    setAdminToken(null)
  }

  const fetchStudents = async () => {
    if (!adminToken) return
    setLoadingStudents(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (volunteerFilter !== 'ALL') params.set('volunteer', volunteerFilter)

      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.status === 401) {
        handleAdminLogout()
        return
      }
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setStudents(data.students || [])
      }
    } catch (err) {
      console.error('Fetch students error:', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  const fetchVolunteers = async () => {
    if (!adminToken) return
    setLoadingVolunteers(true)
    try {
      const res = await fetch('/api/admin/volunteers', {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.status === 401) {
        handleAdminLogout()
        return
      }
      const data = await res.json()
      if (data.success) {
        setVolunteers(data.volunteers || [])
      }
    } catch (err) {
      console.error('Fetch volunteers error:', err)
    } finally {
      setLoadingVolunteers(false)
    }
  }

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()
    setVolunteerFormError('')
    setVolunteerFormSuccess('')

    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      setVolunteerFormError('Please fill in all volunteer fields.')
      return
    }

    setCreatingVolunteer(true)
    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword.trim(),
          name: newName.trim(),
          gate: newGate.trim()
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setVolunteerFormSuccess(`Volunteer @${data.volunteer.username} created successfully!`)
        setNewUsername('')
        setNewPassword('')
        setNewName('')
        fetchVolunteers()
      } else {
        setVolunteerFormError(data.error || 'Failed to create volunteer.')
      }
    } catch {
      setVolunteerFormError('Network error creating volunteer.')
    } finally {
      setCreatingVolunteer(false)
    }
  }

  const handleResetVolunteerSession = async (volunteerId: string, volunteerName: string) => {
    if (!confirm(`Force logout ${volunteerName}? This will unlock their account to log in on a new device.`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: volunteerId, action: 'reset_session' })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        fetchVolunteers()
      } else {
        alert(data.error || 'Failed to reset session.')
      }
    } catch {
      alert('Network error resetting session.')
    }
  }

  const handleDeleteVolunteer = async (volunteerId: string, volunteerName: string) => {
    if (!confirm(`Delete volunteer account "${volunteerName}"?`)) return

    try {
      const res = await fetch(`/api/admin/volunteers?id=${volunteerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        fetchVolunteers()
      }
    } catch {
      alert('Error deleting volunteer.')
    }
  }

  // Login view if unauthenticated
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-wine-950 text-cream-50 font-sans p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-[#13030F] border border-wine-800 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/logos/tapmi-logo.svg"
              alt="TAPMI"
              width={90}
              height={28}
              className="brightness-0 invert h-6 w-auto"
            />
            <div className="h-4 w-px bg-wine-700" />
            <span className="text-xs font-bold text-glc-magenta tracking-wider">
              ADMIN CONTROL
            </span>
          </div>

          <h1 className="text-xl font-bold text-center text-white mb-2">
            Secretariat Access
          </h1>
          <p className="text-xs text-center text-cream-300 mb-6">
            Enter master key to manage attendance and volunteers.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-cream-400 font-semibold mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Master Admin Key"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-glc-magenta hover:bg-glc-pink text-white transition-all shadow-lg active:scale-95"
            >
              Sign In to Admin
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wine-950 text-cream-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-wine-950/95 backdrop-blur-md border-b border-wine-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/tapmi-logo.svg"
            alt="TAPMI"
            width={90}
            height={28}
            className="brightness-0 invert h-6 w-auto"
          />
          <div className="h-4 w-px bg-wine-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-glc-magenta tracking-wider">
              GLC 2026 ADMIN
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/admin/export?token=${adminToken}`}
            download
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wine-900 border border-wine-700 hover:border-glc-orange text-xs text-cream-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-glc-orange" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wine-900/60 hover:bg-rose-500/20 text-xs text-cream-300 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Real-Time Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-cream-400 font-semibold mb-1">
              Total Students
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.total}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-emerald-500/30 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center justify-between">
              <span>Present</span>
              <span className="text-xs font-bold font-mono">{stats.percent}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
              {stats.present}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-cream-400 font-semibold mb-1">
              Absent
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cream-300">
              {stats.absent}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-glc-magenta/30 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-glc-magenta font-semibold mb-1 flex items-center justify-between">
              <span>Volunteers Online</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {volunteers.filter((v) => v.is_logged_in).length} <span className="text-sm font-normal text-cream-400">/ {volunteers.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-wine-800/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'attendance'
                  ? 'bg-glc-magenta text-white shadow-md'
                  : 'text-cream-300 hover:text-white hover:bg-wine-900/60'
              }`}
            >
              Attendance & Audit ({stats.present}/{stats.total})
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'volunteers'
                  ? 'bg-glc-magenta text-white shadow-md'
                  : 'text-cream-300 hover:text-white hover:bg-wine-900/60'
              }`}
            >
              Volunteers & Gates ({volunteers.length})
            </button>
          </div>

          <button
            onClick={() => {
              fetchStudents()
              fetchVolunteers()
            }}
            title="Refresh Data"
            className="p-2 rounded-lg bg-wine-900/60 text-cream-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingStudents || loadingVolunteers ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* TAB 1: ATTENDANCE & AUDIT SEARCH */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                  placeholder="Search by Roll Number, Student Name, Program..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13030F] border border-wine-800 text-sm text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#13030F] border border-wine-800 text-xs text-cream-200 focus:outline-none focus:border-glc-magenta"
                >
                  <option value="ALL">Status: All</option>
                  <option value="PRESENT">Present Only</option>
                  <option value="ABSENT">Absent Only</option>
                </select>

                <button
                  onClick={fetchStudents}
                  className="px-4 py-2.5 rounded-xl bg-wine-800 hover:bg-wine-700 text-xs font-semibold text-white transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-wine-800/80 bg-wine-950/60 text-cream-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Marked At (IST)</th>
                      <th className="py-3 px-4">Volunteer / Gate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wine-800/50 text-cream-200">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-cream-400">
                          {loadingStudents ? 'Loading student records...' : 'No matching students found.'}
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => {
                        const isPresent = student.status === 'PRESENT'

                        return (
                          <tr key={student.id} className="hover:bg-wine-900/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-white">
                              {student.roll_number}
                            </td>
                            <td className="py-3 px-4 font-semibold text-cream-100">
                              {student.full_name}
                            </td>
                            <td className="py-3 px-4 text-cream-400">
                              {student.year_of_study || student.program}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                                  isPresent
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-wine-900 text-cream-400 border-wine-700/60'
                                }`}
                              >
                                {isPresent ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Present</span>
                                  </>
                                ) : (
                                  <span>Absent</span>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-cream-300 font-mono text-[11px]">
                              {student.marked_at
                                ? new Date(student.marked_at).toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                  })
                                : '—'}
                            </td>
                            <td className="py-3 px-4 text-glc-orange font-medium">
                              {student.marked_by || '—'}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOLUNTEERS & GATES MANAGEMENT */}
        {activeTab === 'volunteers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Create Volunteer Form */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-glc-magenta" />
                  <span>Add Volunteer Account</span>
                </h3>
                <p className="text-xs text-cream-400 mt-1">
                  Create single-device credentials for gate coordinators.
                </p>
              </div>

              <form onSubmit={handleCreateVolunteer} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Volunteer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Username * (Unique login ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="e.g. rahul_gate1"
                    className="w-full px-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-cream-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Gate / Door Assignment *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGate}
                    onChange={(e) => setNewGate(e.target.value)}
                    placeholder="e.g. Gate 1 · Main Foyer"
                    className="w-full px-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta"
                  />
                </div>

                {volunteerFormError && (
                  <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                    {volunteerFormError}
                  </div>
                )}

                {volunteerFormSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                    {volunteerFormSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creatingVolunteer}
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-glc-magenta hover:bg-glc-pink text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {creatingVolunteer ? 'Creating...' : 'Create Volunteer Account'}
                </button>
              </form>
            </div>

            {/* Volunteers Roster */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Volunteer Accounts ({volunteers.length})
                </h3>
              </div>

              {volunteers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#13030F] border border-wine-800 text-cream-400 text-xs">
                  No volunteers registered yet. Create your first gate coordinator account on the left.
                </div>
              ) : (
                volunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="p-4 rounded-xl bg-[#13030F] border border-wine-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-wine-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{vol.name}</span>
                        <span className="font-mono text-[11px] text-cream-400">(@{vol.username})</span>
                        {vol.is_logged_in ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Online</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-wine-900 text-cream-400 border border-wine-700/50 text-[10px] font-mono">
                            Logged Out
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-cream-300/80 mt-1 flex items-center gap-3">
                        <span>{vol.gate}</span>
                        <span>·</span>
                        <span className="text-glc-orange font-semibold">{vol.scansCount} students checked in</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {vol.is_logged_in && (
                        <button
                          onClick={() => handleResetVolunteerSession(vol.id, vol.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs transition-colors flex items-center gap-1.5"
                          title="Clears device session token so volunteer can log in from a new device"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Reset Device Lock</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteVolunteer(vol.id, vol.name)}
                        className="p-1.5 rounded-lg bg-wine-900 hover:bg-rose-500/20 text-cream-400 hover:text-rose-300 transition-colors"
                        title="Delete volunteer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
