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
  FileSpreadsheet
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
  has_downloaded_pass: boolean
  download_count: number
  first_downloaded_at: string | null
  last_downloaded_at: string | null
}

interface AdminStats {
  total: number
  downloaded: number
  downloadedPercent: number
  notDownloaded: number
  present: number
  presentPercent: number
  absent: number
  totalDownloadEvents: number
}

export default function AdminDashboardPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Stats & Students
  const [stats, setStats] = useState<AdminStats>({
    total: 1004,
    downloaded: 0,
    downloadedPercent: 0,
    notDownloaded: 1004,
    present: 0,
    presentPercent: 0,
    absent: 1004,
    totalDownloadEvents: 0
  })
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DOWNLOADED' | 'NOT_DOWNLOADED' | 'PRESENT' | 'ABSENT'>('ALL')
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Load admin token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glc_admin_token')
    if (saved) {
      setAdminToken(saved)
    }
  }, [])

  // Auto-fetch data when token is available or filters change
  useEffect(() => {
    if (adminToken) {
      fetchStudents()
    }
  }, [adminToken, statusFilter])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)

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
        setStats(data.stats)
        setStudents(data.students)
      }
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoadingStudents(false)
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
      <div className="max-w-7xl mx-auto space-y-8">
        
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
              Real-time pass generation, student tracking, and auditorium attendance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 transition-colors shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchStudents}
              disabled={loadingStudents}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-wine-900 hover:bg-wine-800 border border-wine-700 text-cream-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingStudents ? 'animate-spin' : ''}`} />
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

        {/* ========================================== */}
        {/* METRICS CARDS GRID                         */}
        {/* ========================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Total Enrolled Students */}
          <div className="bg-[#13030F] border border-wine-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-cream-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Total Roster</span>
              <Users className="w-4 h-4 text-cream-300" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.total.toLocaleString()}
            </div>
            <div className="text-[11px] text-cream-400/80 mt-2">
              TAPMI / MAHE Bengaluru
            </div>
          </div>

          {/* Card 2: Passes Downloaded */}
          <div className="bg-[#13030F] border border-wine-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-cream-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Passes Claimed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                {stats.downloaded}
              </span>
              <span className="text-xs font-bold text-emerald-500">
                ({stats.downloadedPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-wine-950 rounded-full h-1.5 mt-3 overflow-hidden border border-wine-900">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.downloadedPercent)}%` }}
              />
            </div>
          </div>

          {/* Card 3: Unclaimed Passes */}
          <div className="bg-[#13030F] border border-wine-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-cream-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Unclaimed Passes</span>
              <UserX className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                {stats.notDownloaded}
              </span>
              <span className="text-xs font-bold text-amber-500">
                ({stats.total > 0 ? 100 - stats.downloadedPercent : 0}%)
              </span>
            </div>
            <div className="text-[11px] text-amber-300/80 mt-2">
              Pending student pass generation
            </div>
          </div>

          {/* Card 4: Auditorium Attendance */}
          <div className="bg-[#13030F] border border-wine-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-cream-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Auditorium Scans</span>
              <UserCheck className="w-4 h-4 text-glc-magenta" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-glc-magenta tracking-tight">
                {stats.present}
              </span>
              <span className="text-xs font-bold text-glc-magenta/80">
                ({stats.presentPercent}%)
              </span>
            </div>
            <div className="text-[11px] text-cream-400/80 mt-2">
              Checked in at Auditorium
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* FILTER & SEARCH BAR                        */}
        {/* ========================================== */}
        <div className="bg-[#13030F] border border-wine-800/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter Pills */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`py-1.5 px-3.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white'
                    : 'bg-wine-900/60 text-cream-300 hover:text-white'
                }`}
              >
                All Students ({stats.total})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DOWNLOADED')}
                className={`py-1.5 px-3.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'DOWNLOADED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-wine-900/60 text-emerald-300 hover:text-white'
                }`}
              >
                Pass Claimed ({stats.downloaded})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('NOT_DOWNLOADED')}
                className={`py-1.5 px-3.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'NOT_DOWNLOADED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-wine-900/60 text-amber-300 hover:text-white'
                }`}
              >
                Unclaimed ({stats.notDownloaded})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('PRESENT')}
                className={`py-1.5 px-3.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'PRESENT'
                    ? 'bg-glc-magenta text-white'
                    : 'bg-wine-900/60 text-glc-magenta hover:text-white'
                }`}
              >
                Present ({stats.present})
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-cream-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Roll No, Name, or Email"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-wine-950 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta"
                />
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-wine-900 hover:bg-wine-800 border border-wine-700 text-white"
              >
                Search
              </button>
            </form>

          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto rounded-xl border border-wine-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-wine-900/50 text-cream-400 uppercase tracking-wider text-[10px] font-semibold border-b border-wine-800/80">
                <tr>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Learner Email</th>
                  <th className="py-3 px-4">Pass Status</th>
                  <th className="py-3 px-4">First Claimed</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Auditorium Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wine-800/50">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-cream-400">
                      {loadingStudents ? 'Loading student records...' : 'No matching student records found.'}
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-white tracking-wider">
                        {student.roll_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-cream-100">
                        {student.full_name}
                      </td>
                      <td className="py-3 px-4 text-cream-400">
                        {student.email}
                      </td>
                      <td className="py-3 px-4">
                        {student.has_downloaded_pass ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 border border-emerald-600/80 text-emerald-300">
                            Claimed ({student.download_count}x)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-zinc-400">
                            Unclaimed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-cream-400">
                        {formatDateTime(student.first_downloaded_at)}
                      </td>
                      <td className="py-3 px-4">
                        {student.status === 'PRESENT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-glc-magenta/20 border border-glc-magenta text-glc-magenta">
                            PRESENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-zinc-400">
                            ABSENT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-cream-400 text-[11px]">
                        {student.marked_at ? (
                          <span>
                            {formatDateTime(student.marked_at)}
                            {student.marked_by && (
                              <span className="block text-[10px] text-cream-500">
                                by {student.marked_by}
                              </span>
                            )}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11px] text-cream-400 pt-2">
            <span>Showing {students.length} student records</span>
            <span>Total Roster: {stats.total} students</span>
          </div>

        </div>

      </div>
    </main>
  )
}
