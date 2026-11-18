import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Download,
  ExternalLink,
  Eye,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import {
  readLeadsFromLocalStorage,
  writeLeadsToLocalStorage,
} from '../hooks/useLeadSubmission';
import {
  FUNDING_OPTIONS,
  LEAD_STATUS_LABELS,
  type CrmLeadRecord,
  type FundingInterest,
  type LeadStatus,
} from '../types/crm';

interface AdminDashboardProps {
  adminUsername: string;
  authToken: string;
  onLogout: () => void;
  onBackToLanding: () => void;
  onOpenApplyModal: () => void;
  refreshSignal?: number;
}

const STATUS_TEXT_COLOR: Record<LeadStatus, string> = {
  baru: 'text-[#1E40AF]',
  dihubungi: 'text-[#B45309]',
  konsultasi: 'text-amber-700',
  berjaya_daftar: 'text-emerald-700',
  tidak_berminat: 'text-slate-500',
};

function formatMalaysiaDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function buildWhatsAppUrl(lead: CrmLeadRecord): string {
  const rawDigits = lead.telefon.replace(/\D/g, '');
  const formatted = rawDigits.startsWith('0')
    ? `6${rawDigits}`
    : rawDigits.startsWith('60')
      ? rawDigits
      : `60${rawDigits}`;
  const text = encodeURIComponent(
    `Salam sejahtera ${lead.nama}, saya wakil kaunselor GIS (Program Logistik & TVET MQA). Terima kasih atas pendaftaran minat anda untuk program ${lead.programPilihan}. Bilakah masa sesuai untuk kami kongsikan info lanjut & bantuan kewangan PTPTN/PTPK?`,
  );
  return `https://wa.me/${formatted}?text=${text}`;
}

export function AdminDashboard({
  adminUsername,
  authToken,
  onLogout,
  onBackToLanding,
  onOpenApplyModal,
  refreshSignal = 0,
}: AdminDashboardProps) {
  const [leads, setLeads] = useState<CrmLeadRecord[]>(() => readLeadsFromLocalStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'semua'>('semua');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [detailLead, setDetailLead] = useState<CrmLeadRecord | null>(null);
  const [editingNoteLead, setEditingNoteLead] = useState<CrmLeadRecord | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [crmHealth, setCrmHealth] = useState<{
    crmWebhookConfigured: boolean;
    crmProvider: string;
  } | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, healthRes] = await Promise.all([
        fetch('/api/leads', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch('/api/health'),
      ]);

      if (leadsRes.status === 401) {
        onLogout();
        return;
      }

      const leadsData = (await leadsRes.json()) as {
        leads?: CrmLeadRecord[];
        error?: string;
      };
      if (!leadsRes.ok) {
        throw new Error(leadsData.error || 'Gagal memuatkan data CRM.');
      }

      const nextLeads = leadsData.leads ?? [];
      setLeads(nextLeads);
      writeLeadsToLocalStorage(nextLeads);

      if (healthRes.ok) {
        const healthData = (await healthRes.json()) as {
          crmWebhookConfigured: boolean;
          crmProvider: string;
        };
        setCrmHealth(healthData);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ralat berlaku semasa menyambung ke pelayan CRM.',
      );
    } finally {
      setLoading(false);
    }
  }, [authToken, onLogout]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads, refreshSignal]);

  const handleUpdateLead = async (
    id: string,
    patch: { status?: LeadStatus; minatPembiayaan?: FundingInterest; nota?: string },
  ) => {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(patch),
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      const data = (await res.json()) as { lead?: CrmLeadRecord; error?: string };
      if (!res.ok || !data.lead) {
        throw new Error(data.error || 'Gagal mengemas kini status prospek.');
      }

      setLeads((prev) => {
        const updated = prev.map((item) => (item.id === id ? data.lead! : item));
        writeLeadsToLocalStorage(updated);
        return updated;
      });
      if (detailLead?.id === id) {
        setDetailLead(data.lead);
      }
      if (editingNoteLead?.id === id) {
        setEditingNoteLead(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal mengemas kini rekod CRM.',
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) {
        throw new Error('Gagal memadam rekod prospek.');
      }

      setLeads((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        writeLeadsToLocalStorage(filtered);
        return filtered;
      });
      if (detailLead?.id === id) {
        setDetailLead(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memadam rekod.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === 'semua' || lead.status === statusFilter;
      const matchesQuery =
        !q ||
        lead.nama.toLowerCase().includes(q) ||
        lead.emel.toLowerCase().includes(q) ||
        lead.telefon.toLowerCase().includes(q) ||
        lead.programPilihan.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [leads, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const baru = leads.filter((l) => l.status === 'baru').length;
    const aktif = leads.filter(
      (l) => l.status === 'dihubungi' || l.status === 'konsultasi',
    ).length;
    const berjaya = leads.filter((l) => l.status === 'berjaya_daftar').length;
    const kadar = total > 0 ? Math.round((berjaya / total) * 100) : 0;
    return { total, baru, aktif, berjaya, kadar };
  }, [leads]);

  const handleExportCsv = () => {
    const headers = [
      'Nama Penuh',
      'No Telefon',
      'Alamat Emel',
      'Program Pilihan',
      'Pembiayaan',
      'Status CRM',
      'Nota Kaunselor',
      'Tarikh Daftar',
    ];
    const rows = filteredLeads.map((l) => [
      l.nama,
      l.telefon,
      l.emel,
      l.programPilihan,
      l.minatPembiayaan,
      LEAD_STATUS_LABELS[l.status],
      l.nota,
      formatMalaysiaDate(l.tarikhDaftar),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gis-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F294A] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Halaman Utama</span>
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
              <span aria-hidden="true" className="hidden sm:inline">/</span>
              <span className="font-heading font-bold text-[#0F294A] truncate">
                Portal CRM Admin
              </span>
              <span aria-hidden="true" className="hidden md:inline">·</span>
              <span className="hidden md:inline text-xs text-slate-500 truncate">
                Akaun: <strong className="text-[#0F294A]">{adminUsername}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredLeads.length === 0}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Eksport CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenApplyModal}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Tambah Prospek</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Log Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Heading & Sync Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              Pengurusan Prospek Pelajar &amp; Ibu Bapa
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F294A] mt-1">
              Senarai Pendaftaran Minat (CRM)
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>
              Integrasi:{' '}
              <strong className="text-[#0F294A]">
                {crmHealth?.crmWebhookConfigured
                  ? `${crmHealth.crmProvider} Aktif`
                  : 'Pelayan GIS + Storan Tempatan'}
              </strong>
            </span>
            <button
              type="button"
              onClick={fetchLeads}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0F294A] cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Muat Semula</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Jumlah Prospek</p>
            <p className="font-heading text-2xl font-extrabold text-[#0F294A] mt-1 tabular-nums">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Baru Masuk</p>
            <p className="font-heading text-2xl font-extrabold text-[#1E40AF] mt-1 tabular-nums">
              {stats.baru}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Dalam Tindakan</p>
            <p className="font-heading text-2xl font-extrabold text-[#B45309] mt-1 tabular-nums">
              {stats.aktif}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Berjaya Daftar</p>
            <p className="font-heading text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
              {stats.berjaya}
            </p>
          </div>
          <div className="col-span-2 lg:col-span-1 rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Kadar Penukaran</p>
            <p className="font-heading text-2xl font-extrabold text-[#0F294A] mt-1 tabular-nums">
              {stats.kadar}%
            </p>
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no. telefon, emel, atau program..."
              aria-label="Cari prospek CRM"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#F8FAFC] border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706]"
            />
          </div>

          <div
            role="group"
            aria-label="Tapis mengikut status"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('semua')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'semua'
                  ? 'bg-white text-[#0F294A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F294A]'
              }`}
            >
              Semua ({leads.length})
            </button>
            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((statusKey) => (
              <button
                key={statusKey}
                type="button"
                onClick={() => setStatusFilter(statusKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === statusKey
                    ? 'bg-white text-[#0F294A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F294A]'
                }`}
              >
                {LEAD_STATUS_LABELS[statusKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="rounded-xl p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Leads Table */}
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3" aria-busy="true" aria-label="Memuatkan prospek CRM">
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-12 rounded-lg bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FFFBEB] border border-amber-200 text-[#B45309] flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-lg font-bold text-[#0F294A]">
                {leads.length === 0
                  ? 'Belum Ada Prospek Berdaftar'
                  : 'Tiada Rekod Sepadan'}
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {leads.length === 0
                  ? 'Setiap pendaftaran daripada borang modal halaman utama akan muncul di sini secara automatik untuk tindakan susulan kaunselor.'
                  : 'Cuba tukar kata kunci carian atau penapis status di atas.'}
              </p>
              <button
                type="button"
                onClick={onOpenApplyModal}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Tambah Prospek Pertama</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Nama &amp; Program</th>
                    <th className="py-3.5 px-4">Hubungi (Telefon &amp; Emel)</th>
                    <th className="py-3.5 px-4">Pembiayaan</th>
                    <th className="py-3.5 px-4">Status CRM</th>
                    <th className="py-3.5 px-4">Tarikh Daftar</th>
                    <th className="py-3.5 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredLeads.map((lead) => {
                    const isSaving = savingId === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/80 transition-colors align-top"
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-heading font-bold text-[#0F294A]">
                            {lead.nama}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {lead.programPilihan}
                          </p>
                          {lead.nota && (
                            <p className="text-xs text-slate-500 mt-1.5 italic line-clamp-2">
                              Nota: {lead.nota}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          <p className="font-medium text-slate-800 tabular-nums">
                            {lead.telefon}
                          </p>
                          <p className="text-xs text-slate-500">{lead.emel}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            aria-label={`Pembiayaan untuk ${lead.nama}`}
                            disabled={isSaving}
                            value={lead.minatPembiayaan}
                            onChange={(e) =>
                              handleUpdateLead(lead.id, {
                                minatPembiayaan: e.target.value as FundingInterest,
                              })
                            }
                            className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                          >
                            {FUNDING_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            aria-label={`Status CRM untuk ${lead.nama}`}
                            disabled={isSaving}
                            value={lead.status}
                            onChange={(e) =>
                              handleUpdateLead(lead.id, {
                                status: e.target.value as LeadStatus,
                              })
                            }
                            className={`h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D97706] ${STATUS_TEXT_COLOR[lead.status]}`}
                          >
                            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map(
                              (statusKey) => (
                                <option key={statusKey} value={statusKey}>
                                  {LEAD_STATUS_LABELS[statusKey]}
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          {formatMalaysiaDate(lead.tarikhDaftar)}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailLead(lead)}
                              title="Lihat butiran penuh"
                              aria-label={`Lihat butiran ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[#0F294A] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <a
                              href={buildWhatsAppUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Hubungi melalui WhatsApp"
                              aria-label={`WhatsApp ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 flex items-center justify-center transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                            <a
                              href={`tel:${lead.telefon}`}
                              title="Panggil nombor telefon"
                              aria-label={`Panggil ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-[#1E40AF] flex items-center justify-center transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                            <a
                              href={`mailto:${lead.emel}`}
                              title="Hantar emel"
                              aria-label={`Emel ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-[#B45309] flex items-center justify-center transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteLead(lead);
                                setNoteDraft(lead.nota);
                              }}
                              title="Tambah atau sunting nota kaunselor"
                              aria-label={`Nota untuk ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <StickyNote className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleDeleteLead(lead.id)}
                              title="Padam rekod"
                              aria-label={`Padam ${lead.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>
            Paparan Admin CRM GIS · Sesi aktif sebagai {adminUsername}.
          </span>
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              onBackToLanding();
            }}
            className="inline-flex items-center gap-1 font-semibold text-[#0F294A] hover:underline"
          >
            <span>Lihat Halaman Utama Awam</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </p>
      </main>

      {/* Full Lead Details Modal */}
      {detailLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#FFFBEB] to-blue-50/70 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                  Butiran Penuh Prospek
                </p>
                <h2
                  id="detail-modal-title"
                  className="font-heading text-lg font-extrabold text-[#0F294A]"
                >
                  {detailLead.nama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailLead(null)}
                aria-label="Tutup butiran prospek"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">No. Telefon</p>
                  <p className="font-semibold text-[#0F294A] tabular-nums mt-0.5">
                    {detailLead.telefon}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alamat Emel</p>
                  <p className="font-semibold text-[#0F294A] mt-0.5 break-all">
                    {detailLead.emel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Program Pilihan</p>
                  <p className="font-semibold text-[#0F294A] mt-0.5">
                    {detailLead.programPilihan}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Minat Pembiayaan</p>
                  <p className="font-semibold text-[#0F294A] mt-0.5">
                    {detailLead.minatPembiayaan}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tarikh Daftar</p>
                  <p className="font-medium text-slate-700 tabular-nums mt-0.5">
                    {formatMalaysiaDate(detailLead.tarikhDaftar)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Sumber</p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {detailLead.sumber}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#0F294A] mb-1.5">
                  Status CRM Semasa
                </p>
                <select
                  value={detailLead.status}
                  disabled={savingId === detailLead.id}
                  onChange={(e) =>
                    handleUpdateLead(detailLead.id, {
                      status: e.target.value as LeadStatus,
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-[#F8FAFC] text-sm font-semibold text-[#0F294A]"
                >
                  {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {LEAD_STATUS_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-bold text-[#0F294A] mb-1">
                  Nota Kaunselor
                </p>
                <p className="text-sm text-slate-600 bg-[#F8FAFC] border border-slate-200 rounded-xl p-3">
                  {detailLead.nota || 'Tiada nota direkodkan lagi.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = detailLead;
                    setDetailLead(null);
                    handleDeleteLead(target.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Padam Rekod</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={buildWhatsAppUrl(detailLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setDetailLead(null)}
                    className="px-4 py-2 rounded-xl bg-[#0F294A] hover:bg-[#1E40AF] text-white text-xs font-bold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counselor Note Dialog */}
      {editingNoteLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Nota Susulan Kaunselor
              </p>
              <h2
                id="note-modal-title"
                className="font-heading text-lg font-bold text-[#0F294A] mt-0.5"
              >
                {editingNoteLead.nama}
              </h2>
            </div>

            <textarea
              rows={4}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Catatkan hasil panggilan, kelayakan SPM anak, atau tarikh susulan seterusnya..."
              className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            />

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingNoteLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingId === editingNoteLead.id}
                onClick={() =>
                  handleUpdateLead(editingNoteLead.id, { nota: noteDraft })
                }
                className="px-5 py-2 rounded-xl bg-[#0F294A] hover:bg-[#1E40AF] text-white text-sm font-bold cursor-pointer disabled:opacity-60"
              >
                Simpan Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
