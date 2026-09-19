'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Inbox,
  Wrench,
  Star,
  MapPin,
  Settings,
  LogOut,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Save,
  Key,
  Shield,
  Search,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  LayoutTemplate,
  Image as ImageIcon,
  Check,
  User,
  Camera,
  UploadCloud,
  Plus,
  X,
} from 'lucide-react'

type TabType = 'cms' | 'inquiries' | 'services' | 'photos' | 'reviews' | 'areas' | 'settings'

interface SiteContentItem {
  id: string
  key: string
  value: string
  label: string
  type: string
  group: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('cms')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Data states
  const [siteContent, setSiteContent] = useState<SiteContentItem[]>([])
  const [cmsEdits, setCmsEdits] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const [inquiries, setInquiries] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [photoFilter, setPhotoFilter] = useState('ALL')
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoImageUrl, setPhotoImageUrl] = useState('')
  const [photoCategory, setPhotoCategory] = useState('repair')
  const [photoLocation, setPhotoLocation] = useState('Kanpur')
  const [uploadingPhotoFile, setUploadingPhotoFile] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)

  // Profile & Username
  const [currentUser, setCurrentUser] = useState<{
    id: string
    username?: string
    email: string
    name: string
    role?: string
  } | null>(null)
  const [newUsername, setNewUsername] = useState('')
  const [usernamePasswordConfirm, setUsernamePasswordConfirm] = useState('')
  const [changingUsername, setChangingUsername] = useState(false)

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const getToken = () => localStorage.getItem('admin_token')

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    }
    const res = await fetch(url, { ...options, headers })
    if (res.status === 401) {
      handleLogout()
      throw new Error('Session expired')
    }
    return res.json()
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    const savedUser = localStorage.getItem('admin_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {}
    }
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [cmsRes, inqRes, servRes, revRes, areaRes, statsRes, profRes, photosRes] = await Promise.all([
        authFetch('/api/admin/site-content'),
        authFetch('/api/admin/inquiries'),
        authFetch('/api/admin/services'),
        authFetch('/api/admin/reviews'),
        authFetch('/api/admin/service-areas'),
        authFetch('/api/admin/stats'),
        authFetch('/api/admin/profile').catch(() => null),
        authFetch('/api/admin/photos').catch(() => null),
      ])

      if (profRes?.success && profRes.data) {
        setCurrentUser(profRes.data)
        localStorage.setItem('admin_user', JSON.stringify(profRes.data))
      }

      if (photosRes?.success && Array.isArray(photosRes.data)) {
        setPhotos(photosRes.data)
      }

      if (cmsRes.success && cmsRes.data) {
        setSiteContent(cmsRes.data)
        const initialEdits: Record<string, string> = {}
        cmsRes.data.forEach((item: SiteContentItem) => {
          initialEdits[item.key] = item.value
        })
        setCmsEdits(initialEdits)
      }

      if (inqRes.success) setInquiries(inqRes.data || [])
      if (servRes.success) setServices(servRes.data || [])
      if (revRes.success) setReviews(revRes.data || [])
      if (areaRes.success) setAreas(areaRes.data || [])
      if (statsRes.success) setStats(statsRes.data || null)
    } catch (err: any) {
      console.error(err)
      setAlertMsg({ type: 'error', text: 'Error loading admin data' })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  // Save single CMS key
  const handleSaveCmsKey = async (key: string) => {
    const val = cmsEdits[key]
    try {
      setSavingKey(key)
      const res = await authFetch('/api/admin/site-content', {
        method: 'PUT',
        body: JSON.stringify({ key, value: val }),
      })
      if (res.success) {
        setAlertMsg({ type: 'success', text: `Saved "${key}" successfully! Changes are live.` })
        setTimeout(() => setAlertMsg(null), 3500)
      } else {
        throw new Error(res.error || 'Failed to save')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error updating content' })
    } finally {
      setSavingKey(null)
    }
  }

  // Toggle Service active
  const handleToggleService = async (id: string, currentActive: boolean) => {
    try {
      const res = await authFetch(`/api/admin/services`, {
        method: 'PUT',
        body: JSON.stringify({ id, active: !currentActive }),
      })
      if (res.success) {
        setServices(services.map((s) => (s.id === id ? { ...s, active: !currentActive } : s)))
        setAlertMsg({ type: 'success', text: 'Service status updated' })
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update service' })
    }
  }

  // Update Inquiry Status
  const handleUpdateInquiry = async (id: string, status: string) => {
    try {
      const res = await authFetch('/api/admin/inquiries', {
        method: 'PUT',
        body: JSON.stringify({ id, status }),
      })
      if (res.success) {
        setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)))
        setAlertMsg({ type: 'success', text: `Inquiry marked as ${status}` })
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update inquiry' })
    }
  }

  // Toggle Review published
  const handleToggleReview = async (id: string, currentPublished: boolean) => {
    try {
      const res = await authFetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !currentPublished }),
      })
      if (res.success) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, published: !currentPublished } : r)))
        setAlertMsg({ type: 'success', text: `Review ${!currentPublished ? 'published' : 'hidden'} successfully` })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update review status' })
    }
  }

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return
    try {
      const res = await authFetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })
      if (res.success) {
        setReviews(reviews.filter((r) => r.id !== id))
        setAlertMsg({ type: 'success', text: 'Review deleted successfully' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to delete review' })
    }
  }

  // Photos Handlers
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingPhotoFile(true)
      const formData = new FormData()
      formData.append('file', file)

      const token = getToken()
      const res = await fetch('/api/admin/photos/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.data?.url) {
        setPhotoImageUrl(data.data.url)
        setAlertMsg({ type: 'success', text: 'Photo file uploaded successfully!' })
        setTimeout(() => setAlertMsg(null), 3000)
      } else {
        throw new Error(data.error || 'Failed to upload photo')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Image upload failed' })
    } finally {
      setUploadingPhotoFile(false)
    }
  }

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoTitle.trim() || !photoImageUrl.trim()) {
      setAlertMsg({ type: 'error', text: 'Please provide both title and photo image.' })
      return
    }

    try {
      setSavingPhoto(true)
      const res = await authFetch('/api/admin/photos', {
        method: 'POST',
        body: JSON.stringify({
          title: photoTitle.trim(),
          caption: photoCaption.trim() || null,
          imageUrl: photoImageUrl.trim(),
          category: photoCategory,
          location: photoLocation.trim() || 'Kanpur',
          sortOrder: 0,
          published: true,
        }),
      })

      if (res.success && res.data) {
        setPhotos([res.data, ...photos])
        setAlertMsg({ type: 'success', text: 'Work photo successfully added and published to home page!' })
        setIsPhotoModalOpen(false)
        setPhotoTitle('')
        setPhotoCaption('')
        setPhotoImageUrl('')
        setPhotoCategory('repair')
        setPhotoLocation('Kanpur')
      } else {
        throw new Error(res.error || 'Failed to save photo')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Failed to create photo' })
    } finally {
      setSavingPhoto(false)
    }
  }

  const handleTogglePhoto = async (id: string, currentPublished: boolean) => {
    try {
      const res = await authFetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !currentPublished }),
      })
      if (res.success) {
        setPhotos(
          photos.map((p) => (p.id === id ? { ...p, published: !currentPublished } : p))
        )
        setAlertMsg({
          type: 'success',
          text: !currentPublished ? 'Photo published live to home page' : 'Photo hidden from site',
        })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update photo status' })
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work photo?')) return
    try {
      const res = await authFetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
      })
      if (res.success) {
        setPhotos(photos.filter((p) => p.id !== id))
        setAlertMsg({ type: 'success', text: 'Photo deleted successfully' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to delete photo' })
    }
  }

  // Username Change
  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = newUsername.trim().toLowerCase()
    if (clean.length < 3) {
      setAlertMsg({ type: 'error', text: 'New username must be at least 3 characters.' })
      return
    }
    if (clean === currentUser?.username?.toLowerCase()) {
      setAlertMsg({ type: 'error', text: 'New username is the same as your current username.' })
      return
    }

    try {
      setChangingUsername(true)
      const res = await authFetch('/api/admin/change-username', {
        method: 'PUT',
        body: JSON.stringify({
          newUsername: clean,
          currentPassword: usernamePasswordConfirm || undefined,
        }),
      })

      if (res.success) {
        setAlertMsg({
          type: 'success',
          text: `Admin username successfully changed to @${res.data.user.username}!`,
        })
        setCurrentUser(res.data.user)
        localStorage.setItem('admin_user', JSON.stringify(res.data.user))
        setNewUsername('')
        setUsernamePasswordConfirm('')
      } else {
        throw new Error(res.error || 'Failed to update username')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Failed to change username' })
    } finally {
      setChangingUsername(false)
    }
  }

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setAlertMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setAlertMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    try {
      setChangingPassword(true)
      const res = await authFetch('/api/admin/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.success) {
        setAlertMsg({ type: 'success', text: 'Password successfully changed!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        throw new Error(res.error || 'Password update failed')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Failed to change password' })
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading Star Digital Control Center...
          </p>
        </div>
      </div>
    )
  }

  const groupedCms = {
    hero: siteContent.filter((item) => item.group === 'hero'),
    contact: siteContent.filter((item) => item.group === 'contact'),
    general: siteContent.filter((item) => item.group === 'general' || item.group === 'about' || item.group === 'footer'),
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">STAR DIGITAL</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wider">
                  Admin CMS
                </span>
                {currentUser?.username && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    @{currentUser.username}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Kanpur Doorstep Appliance Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-xs font-semibold text-slate-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Toast Alert */}
        {alertMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-sm ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {alertMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{alertMsg.text}</span>
            </div>
            <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'cms', label: 'Website Content (CMS)', icon: LayoutTemplate, count: siteContent.length },
            { id: 'inquiries', label: 'Customer Messages', icon: Inbox, count: inquiries.length },
            { id: 'services', label: 'Services Directory', icon: Wrench, count: services.length },
            { id: 'photos', label: 'Work Photos', icon: Camera, count: photos.length },
            { id: 'areas', label: 'Kanpur Areas', icon: MapPin, count: areas.length },
            { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
            { id: 'settings', label: 'Security & Password', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-red-600 text-white shadow-red-600/20 shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── TAB 1: WEBSITE CONTENT CMS ── */}
        {activeTab === 'cms' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Live Website Content & Image Manager
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update any text, image URL, phone number, or guarantee below. Click "Save Live" to immediately reflect on the website.
                  </p>
                </div>
              </div>

              {/* Group 1: Hero Section */}
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600 uppercase tracking-wider">
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Homepage Hero Section</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {groupedCms.hero.map((item) => (
                    <div
                      key={item.key}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {item.label}
                          </label>
                          <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {item.key}
                          </span>
                        </div>

                        {item.type === 'image_url' ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={cmsEdits[item.key] ?? item.value}
                              onChange={(e) =>
                                setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                            />
                            {cmsEdits[item.key] && (
                              <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                                <img
                                  src={cmsEdits[item.key]}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as any).src =
                                      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80'
                                  }}
                                />
                                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                                  Live Image Preview
                                </span>
                              </div>
                            )}
                          </div>
                        ) : item.value.length > 70 ? (
                          <textarea
                            rows={3}
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) =>
                              setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                            }
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 leading-relaxed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) =>
                              setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                          />
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Contact & Helpline */}
              <div className="mt-10 pt-8 border-t border-slate-200 space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600 uppercase tracking-wider">
                  <Phone className="w-4 h-4" />
                  <span>Helpline, WhatsApp & Hub Information</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {groupedCms.contact.map((item) => (
                    <div
                      key={item.key}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {item.label}
                          </label>
                          <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {item.key}
                          </span>
                        </div>

                        <input
                          type="text"
                          value={cmsEdits[item.key] ?? item.value}
                          onChange={(e) =>
                            setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                        />
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: General, Guarantees & Footer */}
              <div className="mt-10 pt-8 border-t border-slate-200 space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600 uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Guarantees, Story & Footer Tagline</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {groupedCms.general.map((item) => (
                    <div
                      key={item.key}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {item.label}
                          </label>
                          <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {item.key}
                          </span>
                        </div>

                        {item.value.length > 60 ? (
                          <textarea
                            rows={3}
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) =>
                              setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                            }
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 leading-relaxed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) =>
                              setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                          />
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: INQUIRIES & MESSAGES ── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Messages & Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct inquiries received from website visitors across Kanpur.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New Only</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-semibold">No customer inquiries yet</p>
                <p className="text-xs">When users submit messages from the contact page, they appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inquiries
                  .filter((inq) => statusFilter === 'ALL' || inq.status === statusFilter)
                  .map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-900 text-base">{inq.name}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'NEW'
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : inq.status === 'RESOLVED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Phone: {inq.phone}</span>
                          {inq.service && <span>Service: {inq.service}</span>}
                          {inq.createdAt && (
                            <span>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inq.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-600" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${inq.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + inq.phone.replace(/[^0-9]/g, '') : inq.phone.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(
                              inq.name
                            )},%20STAR%20DIGITAL%20here%20regarding%20your%20appliance%20service%20inquiry.`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {inq.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'RESOLVED')}
                              className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                            >
                              Mark Resolved
                            </button>
                          )}
                          {inq.status === 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'NEW')}
                              className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SERVICES DIRECTORY ── */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Appliance Services Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle services active/inactive or modify details directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-slate-900">
                    <img
                      src={s.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                      alt={s.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.active
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-500 text-white'
                        }`}
                      >
                        {s.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold">{s.name}</h3>
                      <p className="text-xs text-slate-300 font-mono">/{s.slug}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {s.tagline || s.shortDesc}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleService(s.id, s.active)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          s.active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {s.active ? 'Deactivate' : 'Activate'}
                      </button>

                      <Link
                        href={`/services/${s.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: KANPUR SERVICE AREAS ── */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Kanpur Coverage Localities</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active service zones, postal codes, and estimated arrival windows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{area.name}</h4>
                    <p className="text-xs text-slate-500">
                      {area.district} {area.pincode && `• PIN: ${area.pincode}`}
                    </p>
                    <span className="inline-block text-[11px] text-emerald-700 font-medium">
                      ~{area.estimatedArrivalMins} Mins Dispatch
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Reviews Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time reviews submitted by website visitors and CMS testimonials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  Total: {reviews.length}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live: {reviews.filter((r) => r.published).length}
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 space-y-2">
                <Star className="w-10 h-10 mx-auto opacity-30 text-amber-500" />
                <p className="text-sm font-semibold">No reviews found</p>
                <p className="text-xs">When users submit reviews from the website, they appear here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                      rev.published ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>

                        {!rev.isPlaceholder ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Live User Review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500">
                            CMS Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        &ldquo;{rev.review}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.customerName}</h4>
                          <p className="text-[11px] text-slate-400">{rev.area}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rev.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {rev.published ? 'Active Live' : 'Hidden'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                        <button
                          onClick={() => handleToggleReview(rev.id, rev.published)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            rev.published
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {rev.published ? 'Hide on Site' : 'Publish Live'}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: WORK PHOTOS & GALLERY ── */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Work Photos & Service Gallery</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">
                    {photos.length} Total
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Upload and manage genuine doorstep appliance repair photos displayed on the storefront home page.
                </p>
              </div>

              <button
                onClick={() => {
                  setPhotoTitle('')
                  setPhotoCaption('')
                  setPhotoImageUrl('')
                  setPhotoCategory('repair')
                  setPhotoLocation('Kanpur')
                  setIsPhotoModalOpen(true)
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-98 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL', label: 'All Photos' },
                { id: 'ac', label: 'Air Conditioners' },
                { id: 'washing_machine', label: 'Washing Machines' },
                { id: 'refrigerator', label: 'Refrigerators' },
                { id: 'repair', label: 'Electronics & Purifiers' },
              ].map((tab) => {
                const isActive = photoFilter === tab.id
                const count =
                  tab.id === 'ALL'
                    ? photos.length
                    : photos.filter((p) => p.category?.toLowerCase() === tab.id.toLowerCase()).length

                return (
                  <button
                    key={tab.id}
                    onClick={() => setPhotoFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-slate-100'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Photos Grid */}
            {photos.filter((p) => photoFilter === 'ALL' || p.category?.toLowerCase() === photoFilter.toLowerCase()).length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                <Camera className="w-12 h-12 mx-auto text-slate-300" />
                <h3 className="text-base font-bold text-slate-700">No photos in this category yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click &apos;Upload New Photo&apos; above to upload a photo from your computer or paste an image URL.
                </p>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload First Photo</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos
                  .filter((p) => photoFilter === 'ALL' || p.category?.toLowerCase() === photoFilter.toLowerCase())
                  .map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden group">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                              {photo.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                                photo.published
                                  ? 'bg-emerald-500/90 text-white'
                                  : 'bg-slate-800/80 text-slate-300'
                              }`}
                            >
                              {photo.published ? 'Active Live' : 'Hidden'}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-5 space-y-2">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{photo.title}</h3>
                          {photo.caption && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{photo.caption}</p>
                          )}
                          {photo.location && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span>{photo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePhoto(photo.id, photo.published)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            photo.published
                              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {photo.published ? 'Hide on Site' : 'Publish Live'}
                        </button>

                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* ── MODAL: UPLOAD / ADD NEW PHOTO ── */}
            {isPhotoModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Upload Work Photo</h3>
                        <p className="text-xs text-slate-500">Showcase repair work to customers in Kanpur.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPhotoModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePhoto} className="space-y-4">
                    {/* Image Upload / Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Photo File or URL *
                      </label>

                      {/* File Upload Box */}
                      <label className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-red-50/30">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          disabled={uploadingPhotoFile}
                          className="hidden"
                        />
                        {uploadingPhotoFile ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-red-600 py-2">
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            <span>Uploading photo to server...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-center py-2">
                            <UploadCloud className="w-8 h-8 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">
                              Click to choose image from device
                            </span>
                            <span className="text-[11px] text-slate-400">
                              JPEG, PNG, WEBP up to 10MB
                            </span>
                          </div>
                        )}
                      </label>

                      {/* Or URL input */}
                      <div className="relative pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            Or paste image URL
                          </span>
                        </div>
                        <input
                          type="url"
                          value={photoImageUrl}
                          onChange={(e) => setPhotoImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... or /uploads/photos/..."
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Live Image Preview */}
                      {photoImageUrl && (
                        <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] relative bg-slate-100">
                          <img
                            src={photoImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                            Preview
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Photo Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="e.g. Split AC Chemical Jet Servicing"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description / Caption
                      </label>
                      <textarea
                        rows={2}
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        placeholder="Details of the repair performed, parts replaced, or diagnostic steps taken..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 resize-none"
                      />
                    </div>

                    {/* Category and Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Appliance Category
                        </label>
                        <select
                          value={photoCategory}
                          onChange={(e) => setPhotoCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600"
                        >
                          <option value="ac">Air Conditioner (AC)</option>
                          <option value="washing_machine">Washing Machine</option>
                          <option value="refrigerator">Refrigerator</option>
                          <option value="repair">Electronics & Purifiers</option>
                          <option value="workshop">Workshop PCB Lab</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kanpur Location
                        </label>
                        <input
                          type="text"
                          value={photoLocation}
                          onChange={(e) => setPhotoLocation(e.target.value)}
                          placeholder="e.g. Kakadeo, Kanpur"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingPhoto || uploadingPhotoFile || !photoImageUrl}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 transition-all disabled:opacity-50 shadow-md shadow-red-600/20"
                      >
                        {savingPhoto ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Publish to Gallery</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: SECURITY & SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Change Admin Username */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Change Admin Username</h3>
                    <p className="text-xs text-slate-500">
                      Update your login username for accessing the admin panel.
                    </p>
                  </div>
                </div>
                {currentUser?.username && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Active: <strong className="text-slate-900 font-mono">@{currentUser.username}</strong>
                  </span>
                )}
              </div>

              <form onSubmit={handleChangeUsername} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.username || 'admin'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-mono cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. stardigital_admin"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    At least 3 characters. Letters, numbers, underscores, and hyphens.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password <span className="text-slate-400 font-normal">(optional security verification)</span>
                  </label>
                  <input
                    type="password"
                    value={usernamePasswordConfirm}
                    onChange={(e) => setUsernamePasswordConfirm(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingUsername}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all disabled:opacity-50 shadow-md"
                  >
                    {changingUsername ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Update Username</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Admin Password */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Change Admin Password</h3>
                  <p className="text-xs text-slate-500">
                    Update your master access credentials securely.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 transition-all disabled:opacity-50 shadow-md shadow-red-600/20"
                  >
                    {changingPassword ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
