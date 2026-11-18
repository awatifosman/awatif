import { useCallback, useState } from 'react';
import {
  validateLeadPayload,
  type CrmLeadPayload,
  type CrmLeadRecord,
} from '../types/crm';

export const NOTIFY_EMAIL =
  (import.meta.env.VITE_NOTIFY_EMAIL as string | undefined)?.trim() ||
  'awatifosman86@gmail.com';

export const LEADS_LOCAL_STORAGE_KEY = 'gis_crm_leads';

export function saveLeadToLocalStorage(lead: CrmLeadRecord): void {
  try {
    const raw = window.localStorage.getItem(LEADS_LOCAL_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CrmLeadRecord[]) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    const deduped = [lead, ...list.filter((item) => item.id !== lead.id)];
    window.localStorage.setItem(LEADS_LOCAL_STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // Ignore localStorage quota/availability errors
  }
}

export function readLeadsFromLocalStorage(): CrmLeadRecord[] {
  try {
    const raw = window.localStorage.getItem(LEADS_LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CrmLeadRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeLeadsToLocalStorage(leads: CrmLeadRecord[]): void {
  try {
    window.localStorage.setItem(LEADS_LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Ignore localStorage quota/availability errors
  }
}

export type LeadSubmissionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success';
      lead: CrmLeadRecord;
      emailNotified: boolean;
      mailtoLink: string;
    }
  | { status: 'error'; message: string };

export function buildLeadMailtoLink(payload: CrmLeadPayload): string {
  const subject = encodeURIComponent(
    `Permohonan Baru GIS (${payload.programPilihan}) - ${payload.nama}`,
  );
  const body = encodeURIComponent(
    `Salam Puan Awatif,\n\nBerikut adalah maklumat pendaftaran minat baru daripada laman web GIS:\n\n` +
      `1. Nama Penuh: ${payload.nama}\n` +
      `2. No. Telefon: ${payload.telefon}\n` +
      `3. Alamat Emel: ${payload.emel}\n` +
      `4. Program Pilihan: ${payload.programPilihan}\n` +
      `5. Minat Pembiayaan: ${payload.minatPembiayaan}\n\n` +
      `Mohon hubungi untuk konsultasi pengajian Logistik, TVET & bantuan kewangan.`,
  );
  return `mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`;
}

export function useLeadSubmission(onLeadSaved?: (lead: CrmLeadRecord) => void) {
  const [state, setState] = useState<LeadSubmissionState>({ status: 'idle' });

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  const submitLead = useCallback(
    async (rawPayload: Partial<CrmLeadPayload>): Promise<boolean> => {
      const validation = validateLeadPayload(rawPayload);
      if (!validation.valid || !validation.normalized) {
        setState({
          status: 'error',
          message: validation.error ?? 'Sila semak semula maklumat borang anda.',
        });
        return false;
      }

      const payload = validation.normalized;
      setState({ status: 'loading' });

      try {
        // 1. Simpan ke pelayan CRM GIS (/api/leads) & mirror ke localStorage
        const apiResponse = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const apiData = (await apiResponse.json()) as {
          lead?: CrmLeadRecord;
          error?: string;
        };

        if (!apiResponse.ok || !apiData.lead) {
          throw new Error(
            apiData.error || 'Pelayan gagal menyimpan maklumat pendaftaran anda.',
          );
        }

        saveLeadToLocalStorage(apiData.lead);

        // 2. Hantar notifikasi emel pantas ke awatifosman86@gmail.com (best-effort)
        let emailNotified = false;
        try {
          const emailRes = await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              _subject: `Permohonan Baru GIS - ${payload.nama}`,
              _template: 'table',
              Nama: payload.nama,
              'No. Telefon': payload.telefon,
              Email: payload.emel,
              'Program Pilihan': payload.programPilihan,
              Pembiayaan: payload.minatPembiayaan,
              Sumber: payload.sumber ?? 'Landing Page GIS',
            }),
          });
          const emailJson = (await emailRes.json()) as { success?: string | boolean };
          emailNotified =
            emailRes.ok &&
            (emailJson.success === 'true' || emailJson.success === true);
        } catch {
          emailNotified = false;
        }

        onLeadSaved?.(apiData.lead);

        setState({
          status: 'success',
          lead: apiData.lead,
          emailNotified,
          mailtoLink: buildLeadMailtoLink(payload),
        });
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Ralat rangkaian berlaku. Sila cuba sebentar lagi.';
        setState({ status: 'error', message });
        return false;
      }
    },
    [onLeadSaved],
  );

  return {
    state,
    submitLead,
    reset,
    isLoading: state.status === 'loading',
  };
}
