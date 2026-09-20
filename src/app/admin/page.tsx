'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { uploadImageFile } from '@/lib/image-upload'
import { normalizePhoneNumber, formatPhoneDisplay } from '@/lib/phone-normalizer'
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
  Check,
  User,
  Camera,
  UploadCloud,
  Plus,
  X,
  BadgePercent,
  Tag,
  IndianRupee,
  Edit2,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  Filter,
} from 'lucide-react'

type TabType = 'cms' | 'pricing' | 'inquiries' | 'services' | 'photos' | 'areas' | 'reviews' | 'settings'

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
  const [uploadingCmsKey, setUploadingCmsKey] = useState<string | null>(null)
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)

  // Pricing & Rate Card states
  const [pricingItems, setPricingItems] = useState<any[]>([])
  const [pricingFilter, setPricingFilter] = useState('ALL')
  const [pricingSearch, setPricingSearch] = useState('')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [editingPricingItem, setEditingPricingItem] = useState<any | null>(null)
  const [priceName, setPriceName] = useState('')
  const [priceCategoryId, setPriceCategoryId] = useState('tv')
  const [priceCategory, setPriceCategory] = useState('LED / Smart TV')
  const [priceRange, setPriceRange] = useState('')
  const [priceServiceTime, setPriceServiceTime] = useState('Same Day')
  const [priceDescription, setPriceDescription] = useState('')
  const [priceFeatures, setPriceFeatures] = useState('')
  const [pricePopular, setPricePopular] = useState(false)
  const [priceActive, setPriceActive] = useState(true)
  const [priceSortOrder, setPriceSortOrder] = useState(0)
  const [savingPricing, setSavingPricing] = useState(false)
  const [deletingPricingId, setDeletingPricingId] = useState<string | null>(null)

  // Service Areas management states
  const [areaSearch, setAreaSearch] = useState('')
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [editingAreaItem, setEditingAreaItem] = useState<any | null>(null)
  const [areaName, setAreaName] = useState('')
  const [areaDistrict, setAreaDistrict] = useState('Kanpur')
  const [areaPincode, setAreaPincode] = useState('')
  const [areaEstimatedArrivalMins, setAreaEstimatedArrivalMins] = useState(45)
  const [areaActive, setAreaActive] = useState(true)
  const [areaSortOrder, setAreaSortOrder] = useState(0)
  const [savingArea, setSavingArea] = useState(false)
  const [deletingAreaId, setDeletingAreaId] = useState<string | null>(null)

  // Services Directory management states
  const [serviceSearch, setServiceSearch] = useState('')
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingServiceItem, setEditingServiceItem] = useState<any | null>(null)
  const [serviceName, setServiceName] = useState('')
  const [serviceSlug, setServiceSlug] = useState('')
  const [serviceTagline, setServiceTagline] = useState('')
  const [serviceShortDesc, setServiceShortDesc] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [serviceIcon, setServiceIcon] = useState('Wrench')
  const [serviceImage, setServiceImage] = useState('')
  const [serviceActive, setServiceActive] = useState(true)
  const [serviceSortOrder, setServiceSortOrder] = useState(0)
  const [savingService, setSavingService] = useState(false)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)

  // Inquiries Notes Modal state
  const [inquirySearch, setInquirySearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notesModalInquiry, setNotesModalInquiry] = useState<any | null>(null)
  const [notesText, setNotesText] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null)

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

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Quick Helpline Numbers
  const [quickPhone, setQuickPhone] = useState('+91 90058 88922')
  const [quickWhatsapp, setQuickWhatsapp] = useState('+91 90058 88922')
  const [savingQuickContact, setSavingQuickContact] = useState(false)

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null)

  // Silent sync helper for cross-tab updates without any visible sync badges
  const triggerSiteSync = (type = 'SYNC_ALL') => {
    try {
      if (typeof window !== 'undefined') {
        const now = Date.now().toString()
        localStorage.setItem('stardigital_updated_at', now)
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel('stardigital_sync')
          channel.postMessage({ type, timestamp: Date.now() })
          setTimeout(() => {
            try { channel.close() } catch {}
          }, 300)
        }
      }
    } catch {}
  }

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    }

    const isGet = !options.method || options.method.toUpperCase() === 'GET'
    const cacheBustedUrl = isGet
      ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
      : url

    const res = await fetch(cacheBustedUrl, {
      cache: 'no-store',
      ...options,
      headers,
    })
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
      const [cmsRes, inqRes, servRes, revRes, areaRes, statsRes, profRes, photosRes, pricingRes] = await Promise.all([
        authFetch('/api/admin/site-content'),
        authFetch('/api/admin/inquiries'),
        authFetch('/api/admin/services'),
        authFetch('/api/admin/reviews'),
        authFetch('/api/admin/service-areas'),
        authFetch('/api/admin/stats'),
        authFetch('/api/admin/profile').catch(() => null),
        authFetch('/api/admin/photos').catch(() => null),
        authFetch('/api/admin/pricing').catch(() => null),
      ])

      if (profRes?.success && profRes.data) {
        setCurrentUser(profRes.data)
        localStorage.setItem('admin_user', JSON.stringify(profRes.data))
      }

      if (photosRes?.success && Array.isArray(photosRes.data)) {
        setPhotos(photosRes.data)
      }

      if (pricingRes?.success && Array.isArray(pricingRes.data)) {
        setPricingItems(pricingRes.data)
      }

      if (cmsRes?.success && cmsRes.data) {
        setSiteContent(cmsRes.data)
        const initialEdits: Record<string, string> = {}
        cmsRes.data.forEach((item: SiteContentItem) => {
          initialEdits[item.key] = item.value
        })
        setCmsEdits(initialEdits)

        const p = initialEdits['business_phone'] || initialEdits['contact_phone'] || '+91 90058 88922'
        const w = initialEdits['business_whatsapp'] || initialEdits['contact_whatsapp'] || '+91 90058 88922'
        setQuickPhone(p)
        setQuickWhatsapp(w)
      }

      if (inqRes?.success) setInquiries(inqRes.data || [])
      if (servRes?.success) setServices(servRes.data || [])
      if (revRes?.success) setReviews(revRes.data || [])
      if (areaRes?.success) setAreas(areaRes.data || [])
      if (statsRes?.success) setStats(statsRes.data || null)
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

  // ── CMS Content Handlers ──
  const handleSaveCmsKey = async (key: string) => {
    let val = cmsEdits[key] ?? ''
    // Auto-normalize phone and WhatsApp numbers
    if (
      key === 'business_phone' ||
      key === 'contact_phone' ||
      key === 'emergency_phone' ||
      key === 'helpline_phone' ||
      key === 'business_whatsapp' ||
      key === 'contact_whatsapp'
    ) {
      const norm = normalizePhoneNumber(val)
      if (!norm.isValid && val.trim().length > 0) {
        setAlertMsg({ type: 'error', text: 'Please enter a valid 10-digit mobile number (e.g. 90058 88922)' })
        return
      }
      val = norm.display
      setCmsEdits((prev) => ({ ...prev, [key]: val }))
    }

    try {
      setSavingKey(key)
      const res = await authFetch('/api/admin/site-content', {
        method: 'PUT',
        body: JSON.stringify({ key, value: val }),
      })
      if (res.success) {
        triggerSiteSync('CONTENT_UPDATED')
        setAlertMsg({ type: 'success', text: `Saved "${key}" successfully.` })
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

  const handleSaveQuickContact = async () => {
    const normP = normalizePhoneNumber(quickPhone)
    const normW = normalizePhoneNumber(quickWhatsapp)

    if (!normP.isValid && quickPhone.trim().length > 0) {
      setAlertMsg({ type: 'error', text: 'Calling number must be a valid 10-digit mobile number' })
      return
    }
    if (!normW.isValid && quickWhatsapp.trim().length > 0) {
      setAlertMsg({ type: 'error', text: 'WhatsApp number must be a valid 10-digit mobile number' })
      return
    }

    const cleanP = normP.display
    const cleanW = normW.display

    setQuickPhone(cleanP)
    setQuickWhatsapp(cleanW)

    try {
      setSavingQuickContact(true)
      const res = await authFetch('/api/admin/business-settings', {
        method: 'PUT',
        body: JSON.stringify({
          phone: cleanP,
          whatsapp: cleanW,
        }),
      })

      if (res.success || !res.error) {
        setCmsEdits((prev) => ({
          ...prev,
          business_phone: cleanP,
          contact_phone: cleanP,
          business_whatsapp: cleanW,
          contact_whatsapp: cleanW,
        }))
        triggerSiteSync('CONTACT_UPDATED')
        setAlertMsg({
          type: 'success',
          text: `Helpline numbers updated to ${cleanP} (WhatsApp: ${cleanW}) across website.`,
        })
        setTimeout(() => setAlertMsg(null), 4000)
      } else {
        throw new Error(res.error || 'Failed to update numbers')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error updating numbers' })
    } finally {
      setSavingQuickContact(false)
    }
  }

  // ── Services Directory Handlers ──
  const handleOpenCreateServiceModal = () => {
    setEditingServiceItem(null)
    setServiceName('')
    setServiceSlug('')
    setServiceTagline('')
    setServiceShortDesc('')
    setServiceDescription('')
    setServiceIcon('Wrench')
    setServiceImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80')
    setServiceActive(true)
    setServiceSortOrder(services.length + 1)
    setIsServiceModalOpen(true)
  }

  const handleOpenEditServiceModal = (s: any) => {
    setEditingServiceItem(s)
    setServiceName(s.name || '')
    setServiceSlug(s.slug || '')
    setServiceTagline(s.tagline || '')
    setServiceShortDesc(s.shortDesc || '')
    setServiceDescription(s.description || '')
    setServiceIcon(s.icon || 'Wrench')
    setServiceImage(s.image || '')
    setServiceActive(s.active !== false)
    setServiceSortOrder(s.sortOrder || 0)
    setIsServiceModalOpen(true)
  }

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceName.trim()) {
      setAlertMsg({ type: 'error', text: 'Service name is required.' })
      return
    }

    try {
      setSavingService(true)
      const payload = {
        name: serviceName.trim(),
        slug: serviceSlug.trim() || serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tagline: serviceTagline.trim(),
        shortDesc: serviceShortDesc.trim(),
        description: serviceDescription.trim(),
        icon: serviceIcon.trim() || 'Wrench',
        image: serviceImage.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        active: serviceActive,
        sortOrder: Number(serviceSortOrder) || 0,
      }

      if (editingServiceItem) {
        const res = await authFetch(`/api/admin/services`, {
          method: 'PUT',
          body: JSON.stringify({ id: editingServiceItem.id, ...payload }),
        })
        if (res.success && res.data) {
          setServices(services.map((s) => (s.id === res.data.id ? res.data : s)))
          triggerSiteSync('SERVICES_UPDATED')
          setAlertMsg({ type: 'success', text: `Service "${payload.name}" updated successfully.` })
          setIsServiceModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to update service')
        }
      } else {
        const res = await authFetch('/api/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (res.success && res.data) {
          setServices([...services, res.data])
          triggerSiteSync('SERVICES_UPDATED')
          setAlertMsg({ type: 'success', text: `Service "${payload.name}" created successfully.` })
          setIsServiceModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to create service')
        }
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error saving service' })
    } finally {
      setSavingService(false)
    }
  }

  const handleToggleService = async (id: string, currentActive: boolean) => {
    try {
      const res = await authFetch(`/api/admin/services`, {
        method: 'PUT',
        body: JSON.stringify({ id, active: !currentActive }),
      })
      if (res.success) {
        setServices(services.map((s) => (s.id === id ? { ...s, active: !currentActive } : s)))
        triggerSiteSync('SERVICES_UPDATED')
        setAlertMsg({ type: 'success', text: 'Service status updated.' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update service' })
    }
  }

  const handleDeleteService = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${name}"?`)) return
    try {
      setDeletingServiceId(id)
      const res = await authFetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (res.success) {
        setServices(services.filter((s) => s.id !== id))
        triggerSiteSync('SERVICES_UPDATED')
        setAlertMsg({ type: 'success', text: `Service "${name}" deleted.` })
        setTimeout(() => setAlertMsg(null), 3000)
      } else {
        throw new Error(res.error || 'Failed to delete service')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Delete failed' })
    } finally {
      setDeletingServiceId(null)
    }
  }

  // ── Service Areas Handlers ──
  const handleOpenCreateAreaModal = () => {
    setEditingAreaItem(null)
    setAreaName('')
    setAreaDistrict('Kanpur')
    setAreaPincode('')
    setAreaEstimatedArrivalMins(45)
    setAreaActive(true)
    setAreaSortOrder(areas.length + 1)
    setIsAreaModalOpen(true)
  }

  const handleOpenEditAreaModal = (a: any) => {
    setEditingAreaItem(a)
    setAreaName(a.name || '')
    setAreaDistrict(a.district || 'Kanpur')
    setAreaPincode(a.pincode || '')
    setAreaEstimatedArrivalMins(a.estimatedArrivalMins || 45)
    setAreaActive(a.active !== false)
    setAreaSortOrder(a.sortOrder || 0)
    setIsAreaModalOpen(true)
  }

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!areaName.trim()) {
      setAlertMsg({ type: 'error', text: 'Locality name is required.' })
      return
    }

    try {
      setSavingArea(true)
      const payload = {
        name: areaName.trim(),
        district: areaDistrict.trim() || 'Kanpur',
        pincode: areaPincode.trim() || null,
        estimatedArrivalMins: Number(areaEstimatedArrivalMins) || 45,
        active: areaActive,
        sortOrder: Number(areaSortOrder) || 0,
      }

      if (editingAreaItem) {
        const res = await authFetch(`/api/admin/service-areas`, {
          method: 'PUT',
          body: JSON.stringify({ id: editingAreaItem.id, ...payload }),
        })
        if (res.success && res.data) {
          setAreas(areas.map((a) => (a.id === res.data.id ? res.data : a)))
          triggerSiteSync('AREAS_UPDATED')
          setAlertMsg({ type: 'success', text: `Locality "${payload.name}" updated successfully.` })
          setIsAreaModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to update locality')
        }
      } else {
        const res = await authFetch('/api/admin/service-areas', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (res.success && res.data) {
          setAreas([...areas, res.data])
          triggerSiteSync('AREAS_UPDATED')
          setAlertMsg({ type: 'success', text: `Locality "${payload.name}" added to Kanpur network.` })
          setIsAreaModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to create locality')
        }
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error saving locality' })
    } finally {
      setSavingArea(false)
    }
  }

  const handleToggleAreaActive = async (area: any) => {
    try {
      const newActive = !area.active
      const res = await authFetch(`/api/admin/service-areas`, {
        method: 'PUT',
        body: JSON.stringify({ id: area.id, active: newActive }),
      })
      if (res.success) {
        setAreas(areas.map((a) => (a.id === area.id ? { ...a, active: newActive } : a)))
        triggerSiteSync('AREAS_UPDATED')
        setAlertMsg({ type: 'success', text: `Locality status updated.` })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to update locality status' })
    }
  }

  const handleDeleteArea = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Kanpur coverage?`)) return
    try {
      setDeletingAreaId(id)
      const res = await authFetch(`/api/admin/service-areas/${id}`, { method: 'DELETE' })
      if (res.success) {
        setAreas(areas.filter((a) => a.id !== id))
        triggerSiteSync('AREAS_UPDATED')
        setAlertMsg({ type: 'success', text: `Locality "${name}" removed.` })
        setTimeout(() => setAlertMsg(null), 3000)
      } else {
        throw new Error(res.error || 'Failed to delete locality')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Delete failed' })
    } finally {
      setDeletingAreaId(null)
    }
  }

  // ── Inquiries Handlers ──
  const handleUpdateInquiry = async (id: string, status: string) => {
    try {
      const res = await authFetch('/api/admin/inquiries', {
        method: 'PUT',
        body: JSON.stringify({ id, status }),
      })
      if (res.success) {
        setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)))
        setAlertMsg({ type: 'success', text: `Inquiry marked as ${status}.` })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to update inquiry' })
    }
  }

  const handleOpenNotesModal = (inq: any) => {
    setNotesModalInquiry(inq)
    setNotesText(inq.adminNotes || '')
  }

  const handleSaveInquiryNotes = async () => {
    if (!notesModalInquiry) return
    try {
      setSavingNotes(true)
      const res = await authFetch(`/api/admin/inquiries/${notesModalInquiry.id}`, {
        method: 'PUT',
        body: JSON.stringify({ adminNotes: notesText }),
      })
      if (res.success) {
        setInquiries(
          inquiries.map((inq) => (inq.id === notesModalInquiry.id ? { ...inq, adminNotes: notesText } : inq))
        )
        setAlertMsg({ type: 'success', text: 'Inquiry note saved.' })
        setNotesModalInquiry(null)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to save inquiry note' })
    } finally {
      setSavingNotes(false)
    }
  }

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return
    try {
      setDeletingInquiryId(id)
      const res = await authFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
      if (res.success) {
        setInquiries(inquiries.filter((inq) => inq.id !== id))
        setAlertMsg({ type: 'success', text: 'Inquiry deleted successfully.' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to delete inquiry' })
    } finally {
      setDeletingInquiryId(null)
    }
  }

  // ── Reviews Handlers ──
  const handleToggleReview = async (id: string, currentPublished: boolean) => {
    try {
      const res = await authFetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !currentPublished }),
      })
      if (res.success) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, published: !currentPublished } : r)))
        triggerSiteSync('REVIEWS_UPDATED')
        setAlertMsg({ type: 'success', text: `Review ${!currentPublished ? 'published' : 'hidden'} successfully.` })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to update review status' })
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return
    try {
      const res = await authFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      if (res.success) {
        setReviews(reviews.filter((r) => r.id !== id))
        triggerSiteSync('REVIEWS_UPDATED')
        setAlertMsg({ type: 'success', text: 'Review deleted successfully.' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to delete review' })
    }
  }

  // ── Image Upload Handlers (Auto-compress from phone & persist to Supabase) ──
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingPhotoFile(true)
      const token = getToken()
      const data = await uploadImageFile(file, token)
      if (data?.url) {
        setPhotoImageUrl(data.url)
        setAlertMsg({ type: 'success', text: 'Photo uploaded and optimized successfully.' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Image upload failed' })
    } finally {
      setUploadingPhotoFile(false)
      e.target.value = ''
    }
  }

  const handleCmsImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingCmsKey(key)
      const token = getToken()
      const data = await uploadImageFile(file, token)
      if (data?.url) {
        setCmsEdits((prev) => ({ ...prev, [key]: data.url }))
        setAlertMsg({ type: 'success', text: 'Image uploaded! Click "Save Changes" to apply live.' })
        setTimeout(() => setAlertMsg(null), 4000)
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Image upload failed' })
    } finally {
      setUploadingCmsKey(null)
      e.target.value = ''
    }
  }

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingServiceImage(true)
      const token = getToken()
      const data = await uploadImageFile(file, token)
      if (data?.url) {
        setServiceImage(data.url)
        setAlertMsg({ type: 'success', text: 'Banner image uploaded successfully!' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Image upload failed' })
    } finally {
      setUploadingServiceImage(false)
      e.target.value = ''
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
        triggerSiteSync('PHOTOS_UPDATED')
        setAlertMsg({ type: 'success', text: 'Work photo successfully added to gallery.' })
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
        setPhotos(photos.map((p) => (p.id === id ? { ...p, published: !currentPublished } : p)))
        triggerSiteSync('PHOTOS_UPDATED')
        setAlertMsg({
          type: 'success',
          text: !currentPublished ? 'Photo published to home page.' : 'Photo hidden from site.',
        })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to update photo status' })
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work photo?')) return
    try {
      const res = await authFetch(`/api/admin/photos/${id}`, { method: 'DELETE' })
      if (res.success) {
        setPhotos(photos.filter((p) => p.id !== id))
        triggerSiteSync('PHOTOS_UPDATED')
        setAlertMsg({ type: 'success', text: 'Photo deleted successfully.' })
        setTimeout(() => setAlertMsg(null), 3000)
      }
    } catch {
      setAlertMsg({ type: 'error', text: 'Failed to delete photo' })
    }
  }

  // ── Pricing Handlers ──
  const categoryNamesMap: Record<string, string> = {
    tv: 'LED / Smart TV',
    refrigerator: 'Refrigerator',
    'washing-machine': 'Washing Machine',
    ac: 'Air Conditioner (AC)',
    others: 'Microwave & Other Appliances',
  }

  const handleOpenAddPricingModal = () => {
    setEditingPricingItem(null)
    setPriceName('')
    setPriceCategoryId('tv')
    setPriceCategory('LED / Smart TV')
    setPriceRange('')
    setPriceServiceTime('Same Day')
    setPriceDescription('')
    setPriceFeatures('')
    setPricePopular(false)
    setPriceActive(true)
    setPriceSortOrder(pricingItems.length + 1)
    setIsPricingModalOpen(true)
  }

  const handleOpenEditPricingModal = (item: any) => {
    setEditingPricingItem(item)
    setPriceName(item.name || '')
    setPriceCategoryId(item.categoryId || 'tv')
    setPriceCategory(item.category || categoryNamesMap[item.categoryId] || 'Other Services')
    setPriceRange(item.priceRange || '')
    setPriceServiceTime(item.serviceTime || 'Same Day')
    setPriceDescription(item.description || '')
    setPricePopular(Boolean(item.popular))
    setPriceActive(item.active !== false)
    setPriceSortOrder(item.sortOrder || 0)

    let feats = ''
    if (Array.isArray(item.features)) {
      feats = item.features.join('\n')
    } else if (typeof item.features === 'string') {
      try {
        const parsed = JSON.parse(item.features)
        feats = Array.isArray(parsed) ? parsed.join('\n') : item.features
      } catch {
        feats = item.features
      }
    }
    setPriceFeatures(feats)
    setIsPricingModalOpen(true)
  }

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!priceName.trim() || !priceRange.trim()) {
      setAlertMsg({ type: 'error', text: 'Service Name and Price Range are required.' })
      return
    }

    try {
      setSavingPricing(true)
      const featuresArray = priceFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)

      const payload = {
        name: priceName.trim(),
        categoryId: priceCategoryId,
        category: priceCategory,
        priceRange: priceRange.trim(),
        serviceTime: priceServiceTime.trim() || 'Same Day',
        description: priceDescription.trim(),
        features: featuresArray,
        popular: pricePopular,
        active: priceActive,
        sortOrder: Number(priceSortOrder) || 0,
      }

      if (editingPricingItem) {
        const res = await authFetch(`/api/admin/pricing/${editingPricingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (res.success && res.data) {
          setPricingItems(pricingItems.map((p) => (p.id === res.data.id ? res.data : p)))
          triggerSiteSync('PRICING_UPDATED')
          setAlertMsg({ type: 'success', text: 'Rate card updated successfully.' })
          setIsPricingModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to update pricing')
        }
      } else {
        const res = await authFetch('/api/admin/pricing', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (res.success && res.data) {
          setPricingItems([res.data, ...pricingItems])
          triggerSiteSync('PRICING_UPDATED')
          setAlertMsg({ type: 'success', text: 'New rate card created successfully.' })
          setIsPricingModalOpen(false)
        } else {
          throw new Error(res.error || 'Failed to create pricing item')
        }
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error saving rate card' })
    } finally {
      setSavingPricing(false)
    }
  }

  const handleDeletePricing = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete rate card "${name}"?`)) return

    try {
      setDeletingPricingId(id)
      const res = await authFetch(`/api/admin/pricing/${id}`, { method: 'DELETE' })
      if (res.success) {
        setPricingItems((prev) => prev.filter((p) => p.id !== id))
        triggerSiteSync('PRICING_UPDATED')
        setAlertMsg({ type: 'success', text: `Rate card "${name}" deleted.` })
        setTimeout(() => setAlertMsg(null), 3000)
      } else {
        throw new Error(res.error || 'Failed to delete pricing item')
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Delete failed' })
    } finally {
      setDeletingPricingId(null)
    }
  }

  const handleTogglePricingActive = async (item: any) => {
    const newStatus = !item.active
    try {
      const res = await authFetch(`/api/admin/pricing/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: newStatus }),
      })
      if (res.success && res.data) {
        setPricingItems(pricingItems.map((p) => (p.id === item.id ? res.data : p)))
        triggerSiteSync('PRICING_UPDATED')
        setAlertMsg({
          type: 'success',
          text: `Rate card marked ${newStatus ? 'Active' : 'Inactive'}`,
        })
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Toggle failed' })
    }
  }

  const handleTogglePricingPopular = async (item: any) => {
    const newPopular = !item.popular
    try {
      const res = await authFetch(`/api/admin/pricing/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ popular: newPopular }),
      })
      if (res.success && res.data) {
        setPricingItems(pricingItems.map((p) => (p.id === item.id ? res.data : p)))
        triggerSiteSync('PRICING_UPDATED')
        setAlertMsg({
          type: 'success',
          text: `Rate card ${newPopular ? 'marked Most Requested' : 'unmarked Most Requested'}`,
        })
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Toggle failed' })
    }
  }

  // ── Username & Password Handlers ──
  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = newUsername.trim().toLowerCase()
    if (clean.length < 3) {
      setAlertMsg({ type: 'error', text: 'New username must be at least 3 characters.' })
      return
    }
    if (clean === currentUser?.username?.toLowerCase()) {
      setAlertMsg({ type: 'error', text: 'New username is the same as current username.' })
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
          text: `Username changed to @${res.data.user.username}.`,
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
        setAlertMsg({ type: 'success', text: 'Password successfully changed.' })
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'NEW').length
  const activeServicesCount = services.filter((s) => s.active).length
  const activeAreasCount = areas.filter((a) => a.active !== false).length

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-sans antialiased text-slate-900">
      {/* Top Admin Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-slate-900 text-xs sm:text-base tracking-tight">STAR DIGITAL</span>
                <span className="px-1.5 sm:px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wider border border-red-200/50">
                  Admin
                </span>
                {currentUser?.username && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    @{currentUser.username}
                  </span>
                )}
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-none">Kanpur Doorstep Appliance Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] rounded-xl transition-all"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden xs:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-[11px] sm:text-xs font-semibold text-slate-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-8 w-full flex-1">
        {/* Toast Alert */}
        {alertMsg && (
          <div
            className={`mb-3.5 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-sm animate-in fade-in duration-200 ${
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
            <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-700 text-xs">
              ✕
            </button>
          </div>
        )}

        {/* ── Advanced Quick Metrics KPI Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'inquiries'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Inquiries</span>
              <Inbox className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{inquiries.length}</span>
              {newInquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-100 text-red-700">
                  {newInquiriesCount} new
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'services'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Services</span>
              <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{activeServicesCount}</span>
              <span className="text-[10px] text-slate-400 font-medium">/ {services.length} active</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'pricing'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Rate Cards</span>
              <BadgePercent className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{pricingItems.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">rates</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('areas')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'areas'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Localities</span>
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{areas.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">Kanpur zones</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'photos'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Photos</span>
              <Camera className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{photos.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">gallery</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all ${
              activeTab === 'reviews'
                ? 'bg-white border-red-500/40 shadow-sm ring-2 ring-red-500/10'
                : 'bg-white/80 border-black/[0.04] hover:bg-white hover:border-black/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Reviews</span>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-slate-900">{reviews.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({reviews.filter((r) => r.published).length} live)
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Tabs - Apple Segmented Control */}
        <div className="p-1 sm:p-1.5 bg-slate-200/70 backdrop-blur-md rounded-xl sm:rounded-2xl flex overflow-x-auto gap-1 sm:gap-1.5 mb-4 sm:mb-6 scrollbar-none border border-black/[0.04]">
          {[
            { id: 'cms', label: 'Website Content', shortLabel: 'CMS', icon: LayoutTemplate, count: siteContent.length },
            { id: 'pricing', label: 'Rate Cards & Pricing', shortLabel: 'Pricing', icon: BadgePercent, count: pricingItems.length },
            { id: 'inquiries', label: 'Customer Messages', shortLabel: 'Messages', icon: Inbox, count: inquiries.length },
            { id: 'services', label: 'Services Directory', shortLabel: 'Services', icon: Wrench, count: services.length },
            { id: 'areas', label: 'Kanpur Areas', shortLabel: 'Areas', icon: MapPin, count: areas.length },
            { id: 'photos', label: 'Work Photos', shortLabel: 'Photos', icon: Camera, count: photos.length },
            { id: 'reviews', label: 'Reviews', shortLabel: 'Reviews', icon: Star, count: reviews.length },
            { id: 'settings', label: 'Security', shortLabel: 'Security', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-bold scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                      isActive ? 'bg-red-50 text-red-600' : 'bg-slate-300/60 text-slate-700'
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
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
            {/* Quick Helplines Card */}
            <div className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 sm:pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-lg font-extrabold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span>Customer Helpline &amp; WhatsApp Numbers</span>
                    </h2>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      Changing numbers here updates phone dial pad and WhatsApp links across the entire website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 mt-3.5 sm:mt-6">
                <div className="space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                      <span>Calling Phone Number</span>
                    </span>
                    {normalizePhoneNumber(quickPhone).isValid && (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        ✓ Valid Indian Number
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    onBlur={() => {
                      if (quickPhone.trim()) setQuickPhone(formatPhoneDisplay(quickPhone))
                    }}
                    placeholder="+91 90058 88922 or 9005888922"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Pre-filled in dialer when users tap Call Now.</span>
                    <span className="font-mono text-slate-300">{normalizePhoneNumber(quickPhone).display}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      <span>WhatsApp Booking Number</span>
                    </span>
                    {normalizePhoneNumber(quickWhatsapp).isValid && (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        ✓ WA: {normalizePhoneNumber(quickWhatsapp).waFormat}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={quickWhatsapp}
                    onChange={(e) => setQuickWhatsapp(e.target.value)}
                    onBlur={() => {
                      if (quickWhatsapp.trim()) setQuickWhatsapp(formatPhoneDisplay(quickWhatsapp))
                    }}
                    placeholder="+91 90058 88922 or 9005888922"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Direct WhatsApp launch on Mobile &amp; Laptop.</span>
                    <span className="font-mono text-slate-300">Link: {normalizePhoneNumber(quickWhatsapp).waFormat}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3.5 sm:mt-6 pt-3.5 border-t border-slate-800">
                <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Active Helpline: <strong className="text-white font-mono">{quickPhone}</strong></span>
                </div>

                <button
                  onClick={handleSaveQuickContact}
                  disabled={savingQuickContact}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-red-600/25 disabled:opacity-50"
                >
                  {savingQuickContact ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Helpline Numbers</span>
                </button>
              </div>
            </div>

            {/* CMS Section Blocks */}
            <div className="bg-white p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm">
              <div className="pb-3.5 sm:pb-5 border-b border-slate-100">
                <h2 className="text-sm sm:text-lg font-bold text-slate-900">Website Content Manager</h2>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Edit site text, headings, badges, and image links. Click &quot;Save Changes&quot; to apply.
                </p>
              </div>

              {/* Group 1: Hero Section */}
              <div className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                  <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Homepage Hero Section</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
                  {groupedCms.hero.map((item) => (
                    <div
                      key={item.key}
                      className="p-3 sm:p-5 rounded-2xl bg-[#fbfbfd] border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-2.5 sm:space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-800">{item.label}</label>
                          <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {item.key}
                          </span>
                        </div>

                        {item.type === 'image_url' ? (
                          <div className="space-y-2.5">
                            {/* Upload from Phone / Device Button */}
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer transition-all active:scale-95 ${
                                  uploadingCmsKey === item.key
                                    ? 'bg-red-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingCmsKey === item.key}
                                  onChange={(e) => handleCmsImageUpload(item.key, e)}
                                  className="hidden"
                                />
                                {uploadingCmsKey === item.key ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Uploading &amp; optimizing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Upload from Phone / PC</span>
                                  </>
                                )}
                              </label>
                              <span className="text-[11px] text-slate-400">Camera or Gallery</span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                                Or enter / paste image URL
                              </span>
                              <input
                                type="text"
                                value={cmsEdits[item.key] ?? item.value}
                                onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                                placeholder="https://... or /api/images/..."
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                              />
                            </div>

                            {(cmsEdits[item.key] ?? item.value) && (
                              <div className="relative h-28 sm:h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                                <img
                                  src={cmsEdits[item.key] ?? item.value}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as any).src =
                                      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80'
                                  }}
                                />
                                <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                                  Live Preview
                                </span>
                              </div>
                            )}
                          </div>
                        ) : item.value.length > 70 ? (
                          <textarea
                            rows={3}
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                            className="w-full p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 leading-relaxed font-medium"
                          />
                        ) : (
                          <input
                            type="text"
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                          />
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/50">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-red-600 active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Contact & Helpline */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Helpline, WhatsApp &amp; Hub Information</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
                  {groupedCms.contact.map((item) => (
                    <div
                      key={item.key}
                      className="p-3 sm:p-5 rounded-2xl bg-[#fbfbfd] border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-2.5 sm:space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-800">{item.label}</label>
                          <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {item.key}
                          </span>
                        </div>

                        <input
                          type="text"
                          value={cmsEdits[item.key] ?? item.value}
                          onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                          onBlur={() => {
                            if (item.type === 'phone' || item.key.includes('phone') || item.key.includes('whatsapp')) {
                              const cur = cmsEdits[item.key] ?? item.value
                              if (cur?.trim()) {
                                setCmsEdits({ ...cmsEdits, [item.key]: formatPhoneDisplay(cur) })
                              }
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                        />
                        {(item.type === 'phone' || item.key.includes('phone') || item.key.includes('whatsapp')) && (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                            <span>Standard Indian format:</span>
                            <span className="font-mono font-semibold text-slate-600">
                              {normalizePhoneNumber(cmsEdits[item.key] ?? item.value).display}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/50">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-red-600 active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: General, About & Footer */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                  <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>General &amp; Footer Content</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
                  {groupedCms.general.map((item) => (
                    <div
                      key={item.key}
                      className="p-3 sm:p-5 rounded-2xl bg-[#fbfbfd] border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-2.5 sm:space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-800">{item.label}</label>
                          <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {item.key}
                          </span>
                        </div>

                        {item.value.length > 70 ? (
                          <textarea
                            rows={3}
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                            className="w-full p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 leading-relaxed font-medium"
                          />
                        ) : (
                          <input
                            type="text"
                            value={cmsEdits[item.key] ?? item.value}
                            onChange={(e) => setCmsEdits({ ...cmsEdits, [item.key]: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                          />
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200/50">
                        <button
                          onClick={() => handleSaveCmsKey(item.key)}
                          disabled={savingKey === item.key}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-red-600 active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {savingKey === item.key ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: RATE CARDS & PRICING ── */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-lg font-bold text-slate-900">Service Rate Cards &amp; Pricing</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-600 border border-red-200/50">
                    {pricingItems.length} Total
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  Manage inspection charges, part replacements, and turnaround times displayed on the pricing page.
                </p>
              </div>

              <button
                onClick={handleOpenAddPricingModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Rate Card</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex overflow-x-auto items-center gap-1.5 pb-1 scrollbar-none">
                {[
                  { id: 'ALL', label: 'All Services' },
                  { id: 'tv', label: 'Smart TV' },
                  { id: 'refrigerator', label: 'Refrigerator' },
                  { id: 'washing-machine', label: 'Washing Machine' },
                  { id: 'ac', label: 'AC' },
                  { id: 'others', label: 'Microwave & Other' },
                ].map((tab) => {
                  const isActive = pricingFilter === tab.id
                  const count =
                    tab.id === 'ALL'
                      ? pricingItems.length
                      : pricingItems.filter((i) => i.categoryId === tab.id).length

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPricingFilter(tab.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative min-w-[200px] sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rate cards..."
                  value={pricingSearch}
                  onChange={(e) => setPricingSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Pricing Grid */}
            {pricingItems.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm p-8 sm:p-12 text-center text-slate-400 space-y-2.5">
                <BadgePercent className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-sm sm:text-base font-bold text-slate-700">No rate cards found</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
                  Click &apos;Add New Rate Card&apos; above to create your first doorstep repair pricing item.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                {pricingItems
                  .filter((item) => {
                    const matchCat = pricingFilter === 'ALL' || item.categoryId === pricingFilter
                    const matchSearch =
                      !pricingSearch ||
                      item.name?.toLowerCase().includes(pricingSearch.toLowerCase()) ||
                      item.description?.toLowerCase().includes(pricingSearch.toLowerCase())
                    return matchCat && matchSearch
                  })
                  .map((item) => {
                    let feats: string[] = []
                    if (Array.isArray(item.features)) {
                      feats = item.features
                    } else if (typeof item.features === 'string') {
                      try {
                        const parsed = JSON.parse(item.features)
                        if (Array.isArray(parsed)) feats = parsed
                      } catch {
                        feats = item.features.split('\n').filter(Boolean)
                      }
                    }

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl border shadow-sm p-3.5 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
                          item.active ? 'border-black/[0.06]' : 'border-slate-200 opacity-60 bg-slate-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                {item.category || item.categoryId}
                              </span>
                              {item.popular && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  ★ Most Requested
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleTogglePricingActive(item)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                item.active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {item.active ? 'Active' : 'Hidden'}
                            </button>
                          </div>

                          <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug mb-2">
                            {item.name}
                          </h3>

                          <div className="flex items-center justify-between gap-2 mb-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                              <span className="text-sm sm:text-lg font-black text-emerald-700 tracking-tight">
                                {item.priceRange}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-500 block">estimated rate</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200/70 shrink-0">
                              <Clock className="w-3 h-3 text-red-500" />
                              <span>{item.serviceTime || 'Same Day'}</span>
                            </div>
                          </div>

                          {item.description && (
                            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {feats.length > 0 && (
                            <div className="space-y-1 pt-2 pb-2.5 border-t border-slate-100">
                              {feats.slice(0, 3).map((f, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                              {feats.length > 3 && (
                                <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold pl-4">
                                  +{feats.length - 3} more benefits
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenEditPricingModal(item)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit Rate</span>
                          </button>

                          <button
                            onClick={() => handleTogglePricingPopular(item)}
                            className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                              item.popular
                                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            }`}
                            title={item.popular ? 'Unmark Most Requested' : 'Mark as Most Requested'}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.popular ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleDeletePricing(item.id, item.name)}
                            disabled={deletingPricingId === item.id}
                            className="p-1.5 sm:p-2 rounded-xl text-red-600 hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50"
                            title="Delete Rate Card"
                          >
                            {deletingPricingId === item.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CUSTOMER INQUIRIES & MESSAGES ── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs sm:text-lg font-bold text-slate-900">Customer Messages &amp; Service Inquiries</h2>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Direct requests submitted by Kanpur homeowners via the website contact &amp; booking forms.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[160px] sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, issue..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Statuses ({inquiries.length})</option>
                  <option value="NEW">New Only</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm text-slate-400">
                <Inbox className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs sm:text-sm font-semibold">No customer inquiries yet</p>
                <p className="text-[10px] sm:text-xs text-slate-400">When visitors submit messages from the website, they appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {inquiries
                  .filter((inq) => {
                    const matchStatus = statusFilter === 'ALL' || inq.status === statusFilter
                    const matchSearch =
                      !inquirySearch ||
                      inq.name?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      inq.phone?.includes(inquirySearch) ||
                      inq.message?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      inq.service?.toLowerCase().includes(inquirySearch.toLowerCase())
                    return matchStatus && matchSearch
                  })
                  .map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white p-3.5 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{inq.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
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

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Phone: {inq.phone}</span>
                          {inq.service && <span>• Appliance: {inq.service}</span>}
                          {inq.createdAt && (
                            <span>• {new Date(inq.createdAt).toLocaleDateString('en-IN')}</span>
                          )}
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-700 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100 leading-relaxed">
                          &ldquo;{inq.message}&rdquo;
                        </p>

                        {inq.adminNotes && (
                          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[10px] sm:text-[11px] text-amber-900">
                            <strong className="font-bold">Staff Note:</strong> {inq.adminNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={getDialerUrl(inq.phone)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] sm:text-xs font-bold transition-all"
                          >
                            <Phone className="w-3 h-3 text-red-600" />
                            <span>Call</span>
                          </a>
                          <a
                            href={getWhatsAppUrl(
                              `Hello ${inq.name}, STAR DIGITAL here regarding your appliance service inquiry.`,
                              inq.phone
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[10px] sm:text-xs font-bold transition-all"
                          >
                            <MessageSquare className="w-3 h-3 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenNotesModal(inq)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
                            <span>Notes</span>
                          </button>

                          {inq.status !== 'RESOLVED' ? (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'RESOLVED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] sm:text-xs font-semibold transition-all"
                            >
                              Mark Resolved
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'NEW')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] sm:text-xs font-semibold transition-all"
                            >
                              Reopen
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                            disabled={deletingInquiryId === inq.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: SERVICES DIRECTORY ── */}
        {activeTab === 'services' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-lg font-bold text-slate-900">Appliance Services Directory</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-700">
                    {services.length} Total Services
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Manage appliance categories, service detail pages, and on-site visibility.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[160px] sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  onClick={handleOpenCreateServiceModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {services
                .filter(
                  (s) =>
                    !serviceSearch ||
                    s.name?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                    s.tagline?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                    s.slug?.toLowerCase().includes(serviceSearch.toLowerCase())
                )
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative h-32 sm:h-36 bg-slate-900 overflow-hidden">
                      <img
                        src={s.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                        alt={s.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                            s.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                          }`}
                        >
                          {s.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h3 className="text-xs sm:text-base font-bold">{s.name}</h3>
                        <p className="text-[10px] text-slate-300 font-mono">/{s.slug}</p>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 space-y-2">
                      <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2">
                        {s.tagline || s.shortDesc}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleToggleService(s.id, s.active)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold active:scale-95 transition-all ${
                            s.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {s.active ? 'Disable' : 'Enable'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditServiceModal(s)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                            title="Edit Service"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/services/${s.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 inline-flex items-center gap-1 text-[11px]"
                            title="Preview service page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteService(s.id, s.name)}
                            disabled={deletingServiceId === s.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: KANPUR SERVICE AREAS ── */}
        {activeTab === 'areas' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-lg font-bold text-slate-900">Kanpur Coverage Localities &amp; Zones</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-700">
                    {areas.length} Localities
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Manage active service zones, postal codes, and technician arrival times shown in service area sections.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[150px] sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search locality / pin..."
                    value={areaSearch}
                    onChange={(e) => setAreaSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  onClick={handleOpenCreateAreaModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Locality</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {areas
                .filter(
                  (area) =>
                    !areaSearch ||
                    area.name?.toLowerCase().includes(areaSearch.toLowerCase()) ||
                    area.district?.toLowerCase().includes(areaSearch.toLowerCase()) ||
                    area.pincode?.includes(areaSearch)
                )
                .map((area) => (
                  <div
                    key={area.id}
                    className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/[0.06] shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{area.name}</h4>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              area.active !== false
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {area.active !== false ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500">
                          {area.district} {area.pincode && `• PIN: ${area.pincode}`}
                        </p>
                        <span className="inline-block text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                          ~{area.estimatedArrivalMins || 45} Mins Technician Arrival
                        </span>
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleToggleAreaActive(area)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
                          area.active !== false
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {area.active !== false ? 'Deactivate' : 'Activate'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditAreaModal(area)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                          title="Edit Locality"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area.id, area.name)}
                          disabled={deletingAreaId === area.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete Locality"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: WORK PHOTOS & GALLERY ── */}
        {activeTab === 'photos' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-lg font-bold text-slate-900">Work Photos Gallery</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-600 border border-red-200/50">
                    {photos.length} Total
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  Manage genuine doorstep repair photos shown on the homepage gallery.
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex overflow-x-auto items-center gap-1.5 pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'All Photos' },
                { id: 'ac', label: 'ACs' },
                { id: 'washing_machine', label: 'Washing Machines' },
                { id: 'refrigerator', label: 'Refrigerators' },
                { id: 'repair', label: 'Electronics & RO' },
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
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {photos.filter((p) => photoFilter === 'ALL' || p.category?.toLowerCase() === photoFilter.toLowerCase()).length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm p-8 sm:p-12 text-center text-slate-400 space-y-2.5">
                <Camera className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-sm sm:text-base font-bold text-slate-700">No photos in this category yet</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
                  Click &apos;Upload New Photo&apos; above to upload a photo from your phone or paste an image URL.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                {photos
                  .filter((p) => photoFilter === 'ALL' || p.category?.toLowerCase() === photoFilter.toLowerCase())
                  .map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                          <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                              {photo.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-md ${
                                photo.published ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/80 text-slate-300'
                              }`}
                            >
                              {photo.published ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 space-y-1">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{photo.title}</h3>
                          {photo.caption && (
                            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">{photo.caption}</p>
                          )}
                          {photo.location && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span>{photo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePhoto(photo.id, photo.published)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold active:scale-95 transition-all ${
                            photo.published
                              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {photo.published ? 'Hide on Site' : 'Publish Live'}
                        </button>

                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 7: REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs sm:text-lg font-bold text-slate-900">Customer Reviews &amp; Testimonials</h2>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Approve or hide feedback submitted by customers on the review submission page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-700">
                  Total: {reviews.length}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live: {reviews.filter((r) => r.published).length}
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm text-slate-400 space-y-2">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 mx-auto opacity-30 text-amber-500" />
                <p className="text-xs sm:text-sm font-semibold">No reviews found</p>
                <p className="text-[10px] sm:text-xs">When users submit reviews from the website, they appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`bg-white p-3.5 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 transition-all ${
                      rev.published ? 'border-black/[0.06]' : 'border-slate-200 opacity-60 bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>

                        {!rev.isPlaceholder ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Verified User
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-slate-100 text-slate-500">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100 leading-relaxed">
                        &ldquo;{rev.review}&rdquo;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.customerName}</h4>
                          <p className="text-[10px] text-slate-400">{rev.area}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            rev.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {rev.published ? 'Visible' : 'Hidden'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                        <button
                          onClick={() => handleToggleReview(rev.id, rev.published)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold active:scale-95 transition-all ${
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
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 8: SECURITY & SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            {/* Change Admin Username */}
            <div className="bg-white p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm space-y-3.5 sm:space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-slate-900">Change Admin Username</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">Update your login username for accessing the control panel.</p>
                  </div>
                </div>
                {currentUser?.username && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Active: <strong className="text-slate-900 font-mono">@{currentUser.username}</strong>
                  </span>
                )}
              </div>

              <form onSubmit={handleChangeUsername} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Current Username</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.username || 'admin'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">New Username *</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. stardigital_admin"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-600 font-mono text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">At least 3 characters. Letters, numbers, underscores, and hyphens.</p>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Current Password <span className="text-slate-400 font-normal">(optional confirmation)</span>
                  </label>
                  <input
                    type="password"
                    value={usernamePasswordConfirm}
                    onChange={(e) => setUsernamePasswordConfirm(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={changingUsername}
                    className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {changingUsername ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Update Username</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Admin Password */}
            <div className="bg-white p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-sm space-y-3.5 sm:space-y-5">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">Change Admin Password</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Update your master access credentials securely.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-md shadow-red-600/20"
                  >
                    {changingPassword ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: ADD / EDIT RATE CARD ── */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-2xl max-w-lg w-[94vw] sm:w-full p-4 sm:p-6 space-y-4 relative my-auto max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <BadgePercent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">
                    {editingPricingItem ? 'Edit Service Rate Card' : 'Add New Rate Card'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Service item in the Kanpur doorstep rate matrix.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePricing} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Category *</label>
                <select
                  value={priceCategoryId}
                  onChange={(e) => {
                    const val = e.target.value
                    setPriceCategoryId(val)
                    setPriceCategory(categoryNamesMap[val] || val)
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                >
                  <option value="tv">LED / Smart TV</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="washing-machine">Washing Machine</option>
                  <option value="ac">Air Conditioner (AC)</option>
                  <option value="others">Microwave &amp; Other Appliances</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service / Repair Name *</label>
                <input
                  type="text"
                  required
                  value={priceName}
                  onChange={(e) => setPriceName(e.target.value)}
                  placeholder="e.g. LED Backlight Array Replacement"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price Range / Fee *</label>
                  <input
                    type="text"
                    required
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g. ₹899 – ₹1,899 or ₹299"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Service Time</label>
                  <input
                    type="text"
                    value={priceServiceTime}
                    onChange={(e) => setPriceServiceTime(e.target.value)}
                    placeholder="e.g. Same Day, 45–60 Mins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem / Work Description</label>
                <textarea
                  rows={2}
                  value={priceDescription}
                  onChange={(e) => setPriceDescription(e.target.value)}
                  placeholder="Fixes dark screen, sound working but no display..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 resize-none text-slate-800 leading-relaxed font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Included Features / Benefits</label>
                  <span className="text-[10px] text-slate-400">One bullet point per line</span>
                </div>
                <textarea
                  rows={3}
                  value={priceFeatures}
                  onChange={(e) => setPriceFeatures(e.target.value)}
                  placeholder="Full genuine LED strip set&#10;Even brightness calibration&#10;90-day parts warranty"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 resize-none text-slate-800 leading-relaxed font-mono"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={pricePopular}
                    onChange={(e) => setPricePopular(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>Mark as &quot;Most Requested&quot; highlight</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={priceActive}
                    onChange={(e) => setPriceActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>Active and visible on website</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPricing}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                >
                  {savingPricing ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPricingItem ? 'Save Changes' : 'Create Rate Card'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD / EDIT APPLIANCE SERVICE ── */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-2xl max-w-lg w-[94vw] sm:w-full p-4 sm:p-6 space-y-4 relative my-auto max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">
                    {editingServiceItem ? 'Edit Appliance Service' : 'Add New Service'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Service category and landing page in Kanpur directory.</p>
                </div>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => {
                    setServiceName(e.target.value)
                    if (!editingServiceItem) {
                      setServiceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                    }
                  }}
                  placeholder="e.g. Microwave Oven Repair"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g. microwave-oven-repair"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Route URL: /services/{serviceSlug || 'your-service'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Highlight</label>
                <input
                  type="text"
                  value={serviceTagline}
                  onChange={(e) => setServiceTagline(e.target.value)}
                  placeholder="e.g. Solo, Grill & Convection Microwave Specialists"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={serviceShortDesc}
                  onChange={(e) => setServiceShortDesc(e.target.value)}
                  placeholder="Certified doorstep repair for all major brands with 90-day warranty..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 resize-none text-slate-800 leading-relaxed font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Service Banner Image</label>

                {/* Upload from Phone / PC Button */}
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer transition-all active:scale-95 ${
                      uploadingServiceImage
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingServiceImage}
                      onChange={handleServiceImageUpload}
                      className="hidden"
                    />
                    {uploadingServiceImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading &amp; optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload from Phone / PC</span>
                      </>
                    )}
                  </label>
                  <span className="text-[11px] text-slate-400">Mobile Camera or Gallery</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Or enter / paste image URL
                  </span>
                  <input
                    type="text"
                    value={serviceImage}
                    onChange={(e) => setServiceImage(e.target.value)}
                    placeholder="https://... or /api/images/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                  />
                </div>

                {serviceImage && (
                  <div className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src={serviceImage}
                      alt="Service Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as any).src =
                          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
                      }}
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                      Banner Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={serviceActive}
                    onChange={(e) => setServiceActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>Active &amp; published in service directory</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                >
                  {savingService ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingServiceItem ? 'Save Changes' : 'Create Service'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADD / EDIT SERVICE AREA ── */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-2xl max-w-md w-[94vw] sm:w-full p-4 sm:p-6 space-y-4 relative my-auto max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">
                    {editingAreaItem ? 'Edit Kanpur Locality' : 'Add New Kanpur Locality'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Service coverage zone for doorstep technician dispatch.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAreaModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArea} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Area Name *</label>
                <input
                  type="text"
                  required
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g. Kakadeo, Swaroop Nagar, Kalyanpur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={areaDistrict}
                    onChange={(e) => setAreaDistrict(e.target.value)}
                    placeholder="Kanpur Nagar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={areaPincode}
                    onChange={(e) => setAreaPincode(e.target.value)}
                    placeholder="e.g. 208025"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Technician Arrival (Mins)</label>
                <input
                  type="number"
                  min={15}
                  max={180}
                  value={areaEstimatedArrivalMins}
                  onChange={(e) => setAreaEstimatedArrivalMins(Number(e.target.value))}
                  placeholder="45"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 font-medium"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={areaActive}
                    onChange={(e) => setAreaActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>Active &amp; shown in Kanpur coverage section</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAreaModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingArea}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                >
                  {savingArea ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingAreaItem ? 'Save Changes' : 'Add Locality'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: INQUIRY ADMIN NOTES ── */}
      {notesModalInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-2xl max-w-md w-[94vw] sm:w-full p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <h3 className="text-xs sm:text-base font-bold text-slate-900">
                  Staff Notes for {notesModalInquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setNotesModalInquiry(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-slate-500">
                Record internal details (technician assigned, job quote, parts required, customer preference).
              </p>
              <textarea
                rows={4}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="e.g. Assigned technician Rajesh for 3 PM visit. Quoted ₹1200 for fridge compressor relay..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800 leading-relaxed font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setNotesModalInquiry(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInquiryNotes}
                disabled={savingNotes}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {savingNotes ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: UPLOAD / ADD NEW PHOTO ── */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-2xl max-w-lg w-[94vw] sm:w-full p-4 sm:p-6 space-y-4 relative my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">Upload Work Photo</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Showcase repair work to customers in Kanpur.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePhoto} className="space-y-3">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Photo File or URL *</label>

                <label className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-red-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    disabled={uploadingPhotoFile}
                    className="hidden"
                  />
                  {uploadingPhotoFile ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 py-3">
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <span>Compressing &amp; uploading photo...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center py-2">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Tap to take photo with Camera or pick from Gallery / PC
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Auto-compressed for ultra-fast loading • JPEG, PNG, WEBP
                      </span>
                    </div>
                  )}
                </label>

                <div className="relative pt-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Or enter / paste image URL
                  </span>
                  <input
                    type="url"
                    value={photoImageUrl}
                    onChange={(e) => setPhotoImageUrl(e.target.value)}
                    placeholder="https://... or /api/images/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-red-600 text-slate-800"
                  />
                </div>

                {photoImageUrl && (
                  <div className="mt-1.5 rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] relative bg-slate-100">
                    <img src={photoImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Split AC Chemical Jet Servicing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Caption</label>
                <textarea
                  rows={2}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Details of repair performed..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 resize-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600 text-slate-800"
                  >
                    <option value="ac">Air Conditioner (AC)</option>
                    <option value="washing_machine">Washing Machine</option>
                    <option value="refrigerator">Refrigerator</option>
                    <option value="repair">Electronics &amp; RO</option>
                    <option value="workshop">Workshop PCB Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kanpur Location</label>
                  <input
                    type="text"
                    value={photoLocation}
                    onChange={(e) => setPhotoLocation(e.target.value)}
                    placeholder="e.g. Kakadeo, Kanpur"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPhoto || uploadingPhotoFile || !photoImageUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                >
                  {savingPhoto ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
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
  )
}
