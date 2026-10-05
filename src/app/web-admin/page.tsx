'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  RefreshCw,
  LogOut,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Trash2,
  Power,
  Smartphone,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  KeyRound,
  DoorOpen
} from 'lucide-react'

interface StudentRecord {
  id: string
  roll_number: string
  full_name: string
  email: string
  qr_token: string
  status: string
  marked_at: string | null
  marked_by: string | null
  status_pm?: string
  marked_at_pm?: string | null
  marked_by_pm?: string | null
  has_downloaded_pass: boolean
  download_count: number
  first_downloaded_at: string | null
  last_downloaded_at: string | null
}

interface Volunteer {
  id: string
  created_at: string
  username: string
  name: string
  gate: string
  is_active: boolean
  is_logged_in: boolean
  last_login_at?: string
  scansCount: number
}

interface AdminStats {
  total: number
  downloaded: number
  downloadedPercent: number
  notDownloaded: number
  present: number
  presentPercent: number
  absent: number
  presentAm: number
  presentAmPercent: number
  absentAm: number
  presentPm: number
  presentPmPercent: number
  absentPm: number
  presentBoth: number
  presentBothPercent: number
  totalDownloadEvents: number
}

interface ScanAttempt {
  id: string
  created_at: string
  token: string | null
  student_roll: string | null
  student_name: string | null
  user_agent: string | null
  ip_address: string | null
  attempt_type: string
}

export default function AdminDashboardPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Tab State
  const [activeTab, setActiveTab] = useState<'students' | 'volunteers' | 'attempts'>('students')

  // Attempts State
  const [attempts, setAttempts] = useState<ScanAttempt[]>([])
  const [loadingAttempts, setLoadingAttempts] = useState(false)

  // Stats & Students
  const [activeSession, setActiveSession] = useState<'AM' | 'PM'>('AM')
  const [switchingSession, setSwitchingSession] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    total: 1005,
    downloaded: 0,
    downloadedPercent: 0,
    notDownloaded: 1005,
    present: 0,
    presentPercent: 0,
    absent: 1005,
    presentAm: 0,
    presentAmPercent: 0,
    absentAm: 1005,
    presentPm: 0,
    presentPmPercent: 0,
    absentPm: 1005,
    presentBoth: 0,
    presentBothPercent: 0,
    totalDownloadEvents: 0
  })
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DOWNLOADED' | 'NOT_DOWNLOADED' | 'PRESENT_AM' | 'PRESENT_PM' | 'PRESENT_BOTH' | 'ABSENT'>('ALL')
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Volunteers State
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loadingVolunteers, setLoadingVolunteers] = useState(false)
  const [creatingVolunteer, setCreatingVolunteer] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newGate, setNewGate] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [volunteerFormError, setVolunteerFormError] = useState('')
  const [volunteerFormSuccess, setVolunteerFormSuccess] = useState('')

  // Load admin token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glc_admin_token')
    if (saved) {
      setAdminToken(saved)
    }
  }, [])

  // Auto-fetch data when token is available or tab/filters change
  useEffect(() => {
    if (adminToken) {
      if (activeTab === 'students') {
        fetchStudents()
      } else if (activeTab === 'volunteers') {
        fetchVolunteers()
      } else if (activeTab === 'attempts') {
        fetchAttempts()
      }
    }
  }, [adminToken, activeTab, statusFilter])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword.trim() })
      })

      const data = await res.json()

      if (res.ok && data.token) {
        localStorage.setItem('glc_admin_token', data.token)
        setAdminToken(data.token)
        setAdminPassword('')
      } else {
        setLoginError(data.error || 'Invalid administrator password.')
      }
    } catch {
      setLoginError('Network error connecting to authentication server.')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('glc_admin_token')
    setAdminToken(null)
    setStudents([])
    setVolunteers([])
  }

  const fetchStudents = async () => {
    if (!adminToken) return
    setLoadingStudents(true)

    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())

      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })

      if (res.status === 401) {
        handleAdminLogout()
        return
      }

      const data = await res.json()
      if (res.ok && data.success) {
        if (data.activeSession) {
          setActiveSession(data.activeSession)
        }
        setStats(data.stats)
        setStudents(data.students)
      }
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleSwitchSession = async (targetSession: 'AM' | 'PM') => {
    if (!adminToken || switchingSession || activeSession === targetSession) return
    const sessionLabel = targetSession === 'AM' ? 'Morning Entry (Session 1)' : 'Post-Lunch Return (Session 2)'
    if (!window.confirm(`Switch active scanning mode to "${sessionLabel}"? Gate scanners will automatically record attendance for this session.`)) {
      return
    }

    setSwitchingSession(true)
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ session: targetSession })
      })
      if (res.ok) {
        setActiveSession(targetSession)
        fetchStudents()
      } else {
        alert('Failed to switch session mode.')
      }
    } catch (err) {
      console.error('Session switch error:', err)
      alert('Error updating session mode.')
    } finally {
      setSwitchingSession(false)
    }
  }

  const fetchVolunteers = async () => {
    if (!adminToken) return
    setLoadingVolunteers(true)

    try {
      const res = await fetch('/api/admin/volunteers', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })

      if (res.status === 401) {
        handleAdminLogout()
        return
      }

      const data = await res.json()
      if (res.ok && data.success) {
        setVolunteers(data.volunteers || [])
      }
    } catch (err) {
      console.error('Failed to load volunteers:', err)
    } finally {
      setLoadingVolunteers(false)
    }
  }

  const fetchAttempts = async () => {
    if (!adminToken) return
    setLoadingAttempts(true)

    try {
      const res = await fetch('/api/admin/attempts', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })

      if (res.status === 401) {
        handleAdminLogout()
        return
      }

      const data = await res.json()
      if (res.ok && data.success) {
        setAttempts(data.attempts || [])
      }
    } catch (err) {
      console.error('Failed to load scan attempts:', err)
    } finally {
      setLoadingAttempts(false)
    }
  }

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminToken) return
    setVolunteerFormError('')
    setVolunteerFormSuccess('')
    setCreatingVolunteer(true)

    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newName.trim(),
          username: newUsername.trim().toLowerCase(),
          password: newPassword,
          gate: newGate.trim() || 'Gate 1 · Main Entrance'
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setVolunteerFormSuccess(`Volunteer account "${data.volunteer.username}" created successfully!`)
        setNewName('')
        setNewUsername('')
        setNewPassword('')
        setNewGate('')
        fetchVolunteers()
      } else {
        setVolunteerFormError(data.error || 'Failed to create volunteer account.')
      }
    } catch {
      setVolunteerFormError('Network error creating volunteer account.')
    } finally {
      setCreatingVolunteer(false)
    }
  }

  const handleToggleVolunteerActive = async (id: string, currentStatus: boolean) => {
    if (!adminToken) return

    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id,
          action: 'toggle_active',
          isActive: !currentStatus
        })
      })

      if (res.ok) {
        fetchVolunteers()
      }
    } catch (err) {
      console.error('Toggle active error:', err)
    }
  }

  const handleResetVolunteerSession = async (id: string) => {
    if (!adminToken) return

    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id,
          action: 'reset_session'
        })
      })

      if (res.ok) {
        fetchVolunteers()
      }
    } catch (err) {
      console.error('Reset session error:', err)
    }
  }

  const handleDeleteVolunteer = async (id: string, username: string) => {
    if (!adminToken) return
    if (!window.confirm(`Are you sure you want to delete volunteer account "${username}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/volunteers?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })

      if (res.ok) {
        fetchVolunteers()
      }
    } catch (err) {
      console.error('Delete volunteer error:', err)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStudents()
  }

  const handleExportCsv = () => {
    if (!adminToken) return
    window.open(`/api/admin/export?token=${encodeURIComponent(adminToken)}`, '_blank')
  }

  const formatDateTime = (isoStr: string | null) => {
    if (!isoStr) return '—'
    try {
      return new Date(isoStr).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoStr
    }
  }

  // ==========================================
  // 1. ADMIN LOGIN VIEW
  // ==========================================
  if (!adminToken) {
    return (
      <main className="min-h-screen bg-wine-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#13030F] border border-wine-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-wine-900/80 border border-wine-700/80 flex items-center justify-center mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-glc-magenta" />
            </div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
              Welcome Nexora
            </h1>
            <p className="text-xs text-cream-400 mt-1 uppercase tracking-wider font-semibold">
              GLC 2026 Operations & Metrics
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 px-6 rounded-xl font-semibold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-glc-magenta to-glc-orange hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loggingIn ? 'Authenticating...' : 'Access Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-wine-900 text-center text-[11px] text-cream-400/60">
            Authorized Personnel Only · TAPMI MAHE Bengaluru
          </div>
        </div>
      </main>
    )
  }

  // ==========================================
  // 2. LOGGED-IN ADMIN DASHBOARD
  // ==========================================
  return (
    <main className="min-h-screen bg-wine-950 text-cream-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-wine-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-wine-900 border border-wine-700 text-glc-orange mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Nexora Control Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              GLC 2026 Live Metrics & Roster
            </h1>
            <p className="text-xs text-cream-300/80 mt-0.5">
              Real-time pass generation, student tracking, volunteer accounts, and auditorium attendance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'students' && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 transition-colors shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={activeTab === 'students' ? fetchStudents : activeTab === 'volunteers' ? fetchVolunteers : fetchAttempts}
              disabled={loadingStudents || loadingVolunteers || loadingAttempts}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-wine-900 hover:bg-wine-800 border border-wine-700 text-cream-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${(loadingStudents || loadingVolunteers || loadingAttempts) ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-wine-800/80 pb-3">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-glc-magenta text-white shadow-lg'
                : 'bg-wine-900/60 text-cream-300 hover:text-white border border-wine-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students Roster & Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'volunteers'
                ? 'bg-glc-magenta text-white shadow-lg'
                : 'bg-wine-900/60 text-cream-300 hover:text-white border border-wine-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Volunteer Gate Access ({volunteers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'attempts'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-wine-900/60 text-cream-300 hover:text-white border border-wine-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Self-Scan Attempts ({attempts.length})</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: STUDENTS ROSTER & METRICS           */}
        {/* ========================================== */}
        {activeTab === 'students' && (
          <div className="space-y-8 animate-fadeIn">
            {/* SESSION MODE CONTROL BANNER */}
            <div className="p-5 rounded-2xl bg-[#170513] border-2 border-wine-700/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  activeSession === 'PM'
                    ? 'bg-gradient-to-br from-amber-600 to-orange-600 shadow-amber-900/40'
                    : 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-900/40'
                }`}>
                  <DoorOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-cream-400">
                      Active Gate Scanner Session:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeSession === 'PM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {activeSession === 'PM' ? 'Session 2 · Post-Lunch Return (PM)' : 'Session 1 · Morning Entry (AM)'}
                    </span>
                  </div>
                  <p className="text-xs text-cream-300/80 mt-1">
                    {activeSession === 'PM'
                      ? 'Volunteer gate cameras are currently recording Post-Lunch Return attendance into the PM slot.'
                      : 'Volunteer gate cameras are currently recording Morning Entry attendance into the AM slot.'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleSwitchSession('AM')}
                  disabled={switchingSession || activeSession === 'AM'}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeSession === 'AM'
                      ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400 ring-2 ring-emerald-500/40'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800 hover:border-wine-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Session 1 (AM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchSession('PM')}
                  disabled={switchingSession || activeSession === 'PM'}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeSession === 'PM'
                      ? 'bg-amber-600 text-white shadow-lg border border-amber-400 ring-2 ring-amber-500/40'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800 hover:border-wine-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  <span>Session 2 (Post-Lunch)</span>
                </button>
              </div>
            </div>

            {/* METRICS CARDS GRID (5 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              
              {/* Card 1: Total Enrolled Students */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800/90 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cream-400">
                    Total Enrolled
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-wine-900/80 border border-wine-700/80 flex items-center justify-center text-glc-orange">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stats.total.toLocaleString()}
                </div>
                <div className="mt-1.5 text-[10px] text-cream-400/80 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>TAPMI Roster</span>
                </div>
              </div>

              {/* Card 2: Passes Claimed / Downloaded */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800/90 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cream-400">
                    Passes Claimed
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-center text-emerald-400">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stats.downloaded.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400">
                    {stats.downloadedPercent}%
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-wine-950 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(stats.downloadedPercent, 1))}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-cream-400/70">
                  {stats.notDownloaded} pending
                </div>
              </div>

              {/* Card 3: Morning Present (AM) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800/90 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cream-400">
                    Morning Present (AM)
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-700/80 flex items-center justify-center text-teal-400">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {(stats.presentAm ?? stats.present ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-teal-400">
                    {stats.presentAmPercent ?? stats.presentPercent ?? 0}%
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-wine-950 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(stats.presentAmPercent ?? 0, (stats.presentAm || 0) > 0 ? 2 : 0))}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-cream-400/70">
                  {(stats.absentAm ?? stats.absent ?? 0)} absent AM
                </div>
              </div>

              {/* Card 4: Post-Lunch Present (PM) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800/90 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cream-400">
                    Post-Lunch (PM)
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-700/80 flex items-center justify-center text-amber-400">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {(stats.presentPm ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-amber-400">
                    {stats.presentPmPercent ?? 0}%
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-wine-950 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(stats.presentPmPercent ?? 0, (stats.presentPm || 0) > 0 ? 2 : 0))}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-cream-400/70">
                  {(stats.absentPm ?? 0)} absent PM
                </div>
              </div>

              {/* Card 5: Attended Both Sessions (Full Day) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#13030F] border border-wine-800/90 shadow-xl relative overflow-hidden group col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cream-400">
                    Full Day (Both AM+PM)
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-glc-magenta/20 border border-glc-magenta/40 flex items-center justify-center text-glc-magenta">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {(stats.presentBoth ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-glc-orange">
                    {stats.presentBothPercent ?? 0}%
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-wine-950 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-glc-magenta to-glc-orange h-1 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(stats.presentBothPercent ?? 0, (stats.presentBoth || 0) > 0 ? 2 : 0))}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-cream-400/70">
                  Full day attendance credit
                </div>
              </div>

            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#13030F] p-4 rounded-2xl border border-wine-800/90 shadow-lg">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'ALL'
                      ? 'bg-glc-magenta text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  All ({stats.total})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('DOWNLOADED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'DOWNLOADED'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  Passes Claimed ({stats.downloaded})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('NOT_DOWNLOADED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'NOT_DOWNLOADED'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  Unclaimed ({stats.notDownloaded})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('PRESENT_AM')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'PRESENT_AM'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  Morning AM ({stats.presentAm ?? stats.present ?? 0})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('PRESENT_PM')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'PRESENT_PM'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  Post-Lunch PM ({stats.presentPm ?? 0})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('PRESENT_BOTH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                    statusFilter === 'PRESENT_BOTH'
                      ? 'bg-glc-magenta text-white shadow-sm'
                      : 'bg-wine-950 text-cream-300 hover:text-white border border-wine-800'
                  }`}
                >
                  Both Sessions ({stats.presentBoth ?? 0})
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, roll number, or email..."
                  className="w-full pl-10 pr-20 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1 px-3 py-1 rounded-lg bg-wine-900 hover:bg-wine-800 text-[10px] uppercase font-bold text-cream-200 border border-wine-700"
                >
                  Find
                </button>
              </form>

            </div>

            {/* Students Table */}
            <div className="bg-[#13030F] rounded-2xl border border-wine-800/90 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-wine-800/80 bg-wine-950/60 text-cream-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Pass Status</th>
                      <th className="py-3 px-4">First Claimed</th>
                      <th className="py-3 px-4 text-center">Downloads</th>
                      <th className="py-3 px-4">Morning (AM)</th>
                      <th className="py-3 px-4">Post-Lunch (PM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wine-800/50 text-cream-200">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-cream-400">
                          {loadingStudents ? (
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-glc-magenta" />
                              <span>Loading student records...</span>
                            </div>
                          ) : (
                            'No student records found matching this filter.'
                          )}
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => {
                        const isAmPresent = student.status === 'PRESENT'
                        const isPmPresent = student.status_pm === 'PRESENT'
                        const hasClaimed = student.has_downloaded_pass

                        return (
                          <tr key={student.id} className="hover:bg-wine-900/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-white">
                              {student.roll_number}
                            </td>
                            <td className="py-3 px-4 font-semibold text-cream-100">
                              {student.full_name}
                            </td>
                            <td className="py-3 px-4 text-cream-400 font-mono text-[11px]">
                              {student.email}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                                  hasClaimed
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60'
                                }`}
                              >
                                {hasClaimed ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Claimed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-zinc-400" />
                                    <span>Unclaimed</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-cream-300 text-[11px]">
                              {formatDateTime(student.first_downloaded_at)}
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-center">
                              {student.download_count > 0 ? (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[11px]">
                                  {student.download_count}x
                                </span>
                              ) : (
                                <span className="text-cream-500 text-[11px]">—</span>
                              )}
                            </td>
                            {/* Morning (AM) Attendance */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                                  isAmPresent
                                    ? 'bg-teal-950/60 text-teal-300 border-teal-600/50'
                                    : 'bg-wine-900/60 text-cream-400 border-wine-800'
                                }`}
                              >
                                {isAmPresent ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                    <span>PRESENT</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cream-500" />
                                    <span>ABSENT</span>
                                  </>
                                )}
                              </span>
                              {isAmPresent && student.marked_at && (
                                <span className="block text-[10px] text-cream-400 mt-0.5">
                                  {formatDateTime(student.marked_at)} {student.marked_by ? `· ${student.marked_by}` : ''}
                                </span>
                              )}
                            </td>
                            {/* Post-Lunch (PM) Attendance */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                                  isPmPresent
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                                    : 'bg-wine-900/60 text-cream-400 border-wine-800'
                                }`}
                              >
                                {isPmPresent ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    <span>PRESENT</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cream-500" />
                                    <span>ABSENT</span>
                                  </>
                                )}
                              </span>
                              {isPmPresent && student.marked_at_pm && (
                                <span className="block text-[10px] text-cream-400 mt-0.5">
                                  {formatDateTime(student.marked_at_pm)} {student.marked_by_pm ? `· ${student.marked_by_pm}` : ''}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="p-4 border-t border-wine-800/80 bg-wine-950/80 text-xs text-cream-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                  Showing <strong className="text-white">{students.length}</strong> of{' '}
                  <strong className="text-white">{stats.total}</strong> students in official roster
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>Claimed: <strong className="text-emerald-400">{stats.downloaded}</strong></span>
                  <span>Unclaimed: <strong className="text-amber-400">{stats.notDownloaded}</strong></span>
                  <span>Present in Hall: <strong className="text-glc-orange">{stats.present}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: VOLUNTEER ACCOUNTS & GATE ACCESS    */}
        {/* ========================================== */}
        {activeTab === 'volunteers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            
            {/* Left Column: Create Volunteer Account Form */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-glc-magenta" />
                  <span>Create Volunteer Login</span>
                </h3>
                <p className="text-xs text-cream-400 mt-1">
                  Issue unique login credentials for gate volunteers to scan passes.
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
                    className="w-full px-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Login ID / Username * (Unique)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-cream-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="e.g. rahul_gate1"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Login Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-cream-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Gate / Door Assignment *
                  </label>
                  <div className="relative">
                    <DoorOpen className="w-3.5 h-3.5 text-cream-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={newGate}
                      onChange={(e) => setNewGate(e.target.value)}
                      placeholder="e.g. Gate 1 · Main Foyer"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-white placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta"
                    />
                  </div>
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
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-glc-magenta to-glc-orange hover:shadow-lg text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {creatingVolunteer ? 'Creating...' : 'Create Volunteer Account'}
                </button>
              </form>
            </div>

            {/* Right Column: Active Volunteers Roster Table */}
            <div className="lg:col-span-7 bg-[#13030F] rounded-2xl border border-wine-800 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-wine-800/80 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Volunteer Gate Accounts
                  </h3>
                  <p className="text-[11px] text-cream-400">
                    Single-device session tracking and gate-side scans recorded.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-wine-900 border border-wine-700 text-[11px] font-bold text-glc-orange font-mono">
                  {volunteers.length} Active Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-wine-800/80 bg-wine-950/60 text-cream-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3.5">Volunteer</th>
                      <th className="py-3 px-3">Gate</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Device Session</th>
                      <th className="py-3 px-3 text-center">Scans</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wine-800/50 text-cream-200">
                    {volunteers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-cream-400">
                          {loadingVolunteers ? 'Loading volunteer accounts...' : 'No volunteer accounts created yet.'}
                        </td>
                      </tr>
                    ) : (
                      volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-wine-900/30 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-white text-xs">{v.name}</div>
                            <div className="font-mono text-[11px] text-glc-magenta">@{v.username}</div>
                          </td>
                          <td className="py-3 px-3 text-cream-300 text-xs">
                            {v.gate || 'Gate 1'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleVolunteerActive(v.id, v.is_active)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border cursor-pointer ${
                                v.is_active
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                              }`}
                            >
                              <Power className="w-2.5 h-2.5" />
                              <span>{v.is_active ? 'Active' : 'Disabled'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {v.is_logged_in ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  <Smartphone className="w-2.5 h-2.5" />
                                  <span>Phone Locked</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleResetVolunteerSession(v.id)}
                                  className="text-[10px] text-glc-orange hover:underline mt-1 cursor-pointer"
                                  title="Unlocks session if volunteer changed phones"
                                >
                                  Reset Device
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                                <span>Free</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-white text-xs">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-wine-900 border border-wine-700 text-glc-orange">
                              {v.scansCount}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteVolunteer(v.id, v.username)}
                              className="p-1.5 rounded-lg text-cream-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete volunteer account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SELF-SCAN ATTEMPTS LOG             */}
        {/* ========================================== */}
        {activeTab === 'attempts' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Summary card */}
            <div className="p-5 rounded-2xl bg-[#170513] border border-wine-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Security Intercept Log
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-600/40 text-amber-300">
                    {attempts.length} Recorded Intercepts
                  </span>
                </div>
                <p className="text-xs text-cream-300/80">
                  Real-time log of attendees attempting to self-scan passes using phone cameras or unofficial scanner apps without gate volunteer authentication.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchAttempts}
                disabled={loadingAttempts}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-amber-950/60 hover:bg-amber-900 border border-amber-700/80 text-amber-200 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAttempts ? 'animate-spin' : ''}`} />
                <span>Refresh Log</span>
              </button>
            </div>

            {/* Attempts Table */}
            <div className="rounded-2xl bg-[#13030F] border border-wine-800/80 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-wine-800 bg-wine-900/40 text-[10px] font-bold uppercase tracking-wider text-cream-400">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Pass Token</th>
                      <th className="py-3 px-4">Device / User Agent</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wine-900/60 text-cream-200">
                    {loadingAttempts ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-cream-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-glc-magenta" />
                          <span>Loading scan attempts...</span>
                        </td>
                      </tr>
                    ) : attempts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-cream-400">
                          No unauthorized self-scan attempts recorded yet.
                        </td>
                      </tr>
                    ) : (
                      attempts.map((att) => {
                        const dateStr = att.created_at
                          ? new Date(att.created_at).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })
                          : '—'

                        return (
                          <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] text-cream-400 whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3 px-4 font-semibold text-white">
                              {att.student_name || <span className="text-cream-500 italic">Unknown Attendee</span>}
                            </td>
                            <td className="py-3 px-4 font-mono text-glc-orange font-bold">
                              {att.student_roll || <span className="text-cream-500 italic">—</span>}
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px] text-cream-400">
                              {att.token ? (
                                <span className="truncate block max-w-[140px]" title={att.token}>
                                  {att.token}
                                </span>
                              ) : (
                                <span className="text-cream-500 italic">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[10px] text-cream-400 max-w-xs truncate" title={att.user_agent || ''}>
                              {att.user_agent ? (
                                att.user_agent.includes('iPhone')
                                  ? 'Apple iPhone / Safari'
                                  : att.user_agent.includes('Android')
                                  ? 'Android Mobile'
                                  : att.user_agent.slice(0, 40) + '...'
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-950/60 border border-red-800 text-red-300">
                                <span>Blocked</span>
                              </span>
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

      </div>
    </main>
  )
}
