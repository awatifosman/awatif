export type LeadStatus =
  | 'baru'
  | 'dihubungi'
  | 'konsultasi'
  | 'berjaya_daftar'
  | 'tidak_berminat';

export type FundingInterest = 'PTPTN' | 'PTPK' | 'Biasiswa' | 'Belum Pasti';

export type ProgramChoice =
  | 'Diploma Pengurusan Logistik'
  | 'Sijil TVET Operasi Gudang'
  | 'Perancangan Rantaian Bekalan'
  | 'Konsultasi Umum';

export interface CrmLeadPayload {
  nama: string;
  telefon: string;
  emel: string;
  programPilihan: ProgramChoice;
  minatPembiayaan: FundingInterest;
  sumber?: string;
}

export interface CrmLeadRecord {
  id: string;
  nama: string;
  telefon: string;
  emel: string;
  programPilihan: ProgramChoice;
  minatPembiayaan: FundingInterest;
  status: LeadStatus;
  nota: string;
  sumber: string;
  tarikhDaftar: string;
  dikemaskiniPada: string;
  crmSynced: boolean;
  crmProvider?: string;
}

export interface CrmLeadUpdatePayload {
  status?: LeadStatus;
  minatPembiayaan?: FundingInterest;
  nota?: string;
}

export interface LeadValidationResult {
  valid: boolean;
  error?: string;
  normalized?: CrmLeadPayload;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  baru: 'Baru Masuk',
  dihubungi: 'Sedang Dihubungi',
  konsultasi: 'Sesi Konsultasi',
  berjaya_daftar: 'Berjaya Daftar',
  tidak_berminat: 'Tangguh / Tidak Berminat',
};

export const PROGRAM_OPTIONS: ProgramChoice[] = [
  'Diploma Pengurusan Logistik',
  'Sijil TVET Operasi Gudang',
  'Perancangan Rantaian Bekalan',
  'Konsultasi Umum',
];

export const FUNDING_OPTIONS: FundingInterest[] = [
  'Belum Pasti',
  'PTPTN',
  'PTPK',
  'Biasiswa',
];

export function validateLeadPayload(input: Partial<CrmLeadPayload>): LeadValidationResult {
  const nama = (input.nama ?? '').trim();
  const telefon = (input.telefon ?? '').trim();
  const emel = (input.emel ?? '').trim();
  const programPilihan: ProgramChoice =
    input.programPilihan && PROGRAM_OPTIONS.includes(input.programPilihan)
      ? input.programPilihan
      : 'Diploma Pengurusan Logistik';
  const minatPembiayaan: FundingInterest =
    input.minatPembiayaan && FUNDING_OPTIONS.includes(input.minatPembiayaan)
      ? input.minatPembiayaan
      : 'Belum Pasti';

  if (!nama || !telefon || !emel) {
    return {
      valid: false,
      error: 'Sila lengkapkan nama penuh, no. telefon, dan alamat emel sebelum menghantar.',
    };
  }

  if (nama.length < 2) {
    return {
      valid: false,
      error: 'Nama penuh mestilah sekurang-kurangnya 2 aksara.',
    };
  }

  const digitsOnly = telefon.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return {
      valid: false,
      error: 'Sila masukkan nombor telefon yang sah (contoh: 012-3456789).',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emel)) {
    return {
      valid: false,
      error: 'Sila masukkan format alamat emel yang sah (contoh: nama@gmail.com).',
    };
  }

  return {
    valid: true,
    normalized: {
      nama,
      telefon,
      emel: emel.toLowerCase(),
      programPilihan,
      minatPembiayaan,
      sumber: input.sumber?.trim() || 'Landing Page GIS (Light Mode Cinematic)',
    },
  };
}
