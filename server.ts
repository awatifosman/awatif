import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import {
  FUNDING_OPTIONS,
  LEAD_STATUS_LABELS,
  validateLeadPayload,
  type CrmLeadRecord,
  type CrmLeadUpdatePayload,
  type LeadStatus,
} from './src/types/crm.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const VALID_STATUSES = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || 'gis2026';
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  crypto.createHash('sha256').update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:gis-crm`).digest('hex');

interface AdminTokenPayload {
  username: string;
  fullName?: string;
  exp: number;
}

interface StoredCrmUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

function constantTimeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasswordHash(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

function signAdminToken(username: string, fullName?: string): string {
  const payload: AdminTokenPayload = {
    username,
    fullName,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyAdminToken(token: string | undefined): AdminTokenPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  if (!constantTimeMatch(signature, expectedSig)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as AdminTokenPayload;
    if (!parsed.username || typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractBearerToken(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return undefined;
  return auth.slice('Bearer '.length).trim();
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const session = verifyAdminToken(extractBearerToken(req));
  if (!session) {
    res.status(401).json({ error: 'Sesi admin tidak sah atau telah tamat. Sila log masuk semula.' });
    return;
  }
  next();
}

async function ensureJsonFile(filePath: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

async function readLeads(): Promise<CrmLeadRecord[]> {
  await ensureJsonFile(LEADS_FILE);
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CrmLeadRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: CrmLeadRecord[]): Promise<void> {
  await ensureJsonFile(LEADS_FILE);
  const tempFile = `${LEADS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), 'utf8');
  await fs.rename(tempFile, LEADS_FILE);
}

async function readUsers(): Promise<StoredCrmUser[]> {
  await ensureJsonFile(USERS_FILE);
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredCrmUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredCrmUser[]): Promise<void> {
  await ensureJsonFile(USERS_FILE);
  const tempFile = `${USERS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(users, null, 2), 'utf8');
  await fs.rename(tempFile, USERS_FILE);
}

async function forwardToExternalCrm(
  lead: CrmLeadRecord,
): Promise<{ synced: boolean; provider?: string }> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL?.trim();
  const providerName = process.env.CRM_PROVIDER_NAME?.trim() || 'External CRM';

  if (!webhookUrl) {
    return { synced: false };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const apiKey = process.env.CRM_API_KEY?.trim();
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    return {
      synced: response.ok,
      provider: response.ok ? providerName : undefined,
    };
  } catch (error) {
    console.warn('[CRM] External webhook sync skipped or failed:', error);
    return { synced: false };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      crmWebhookConfigured: Boolean(process.env.CRM_WEBHOOK_URL?.trim()),
      crmProvider: process.env.CRM_PROVIDER_NAME?.trim() || 'GIS CRM',
    });
  });

  // Register New CRM User Route
  app.post('/api/admin/register', async (req: Request, res: Response) => {
    const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const username =
      typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const confirmPassword =
      typeof req.body?.confirmPassword === 'string' ? req.body.confirmPassword : '';

    if (!fullName || !email || !username || !password || !confirmPassword) {
      res.status(400).json({ error: 'Sila lengkapkan semua medan pendaftaran.' });
      return;
    }

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Nama penuh mestilah sekurang-kurangnya 2 aksara.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Format alamat emel tidak sah.' });
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
      res.status(400).json({
        error: 'Username mestilah 3–32 aksara (huruf, nombor, titik, atau garis bawah tanpa ruang).',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Kata laluan mestilah sekurang-kurangnya 6 aksara.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Kata laluan dan pengesahan kata laluan tidak sepadan.' });
      return;
    }

    try {
      const existingUsers = await readUsers();

      const usernameExists =
        username === ADMIN_USERNAME.toLowerCase() ||
        existingUsers.some((u) => u.username.toLowerCase() === username);
      if (usernameExists) {
        res.status(409).json({
          error: 'Username ini sudah didaftarkan. Sila pilih username lain atau log masuk.',
        });
        return;
      }

      const emailExists = existingUsers.some((u) => u.email.toLowerCase() === email);
      if (emailExists) {
        res.status(409).json({
          error: 'Alamat emel ini sudah didaftarkan. Sila gunakan emel lain atau log masuk.',
        });
        return;
      }

      const newUser: StoredCrmUser = {
        id: crypto.randomUUID(),
        fullName,
        email,
        username,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      await writeUsers([newUser, ...existingUsers]);

      res.status(201).json({
        registered: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          username: newUser.username,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error) {
      console.error('[CRM] Failed to register user:', error);
      res.status(500).json({ error: 'Gagal mendaftarkan pengguna baharu.' });
    }
  });

  // Admin & Registered User Login Route
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    const usernameInput = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!usernameInput || !password) {
      res.status(400).json({ error: 'Sila masukkan nama pengguna dan kata laluan.' });
      return;
    }

    // 1. Semak akaun admin utama (.env)
    const isEnvAdmin =
      constantTimeMatch(usernameInput, ADMIN_USERNAME) &&
      constantTimeMatch(password, ADMIN_PASSWORD);

    if (isEnvAdmin) {
      const token = signAdminToken(ADMIN_USERNAME, 'Pentadbir Utama');
      res.json({
        authenticated: true,
        username: ADMIN_USERNAME,
        fullName: 'Pentadbir Utama',
        token,
      });
      return;
    }

    // 2. Semak pengguna berdaftar dalam users.json
    try {
      const users = await readUsers();
      const normalized = usernameInput.toLowerCase();
      const matchedUser = users.find(
        (u) => u.username.toLowerCase() === normalized || u.email.toLowerCase() === normalized,
      );

      if (!matchedUser || !verifyPasswordHash(password, matchedUser.passwordHash)) {
        res.status(401).json({ error: 'Nama pengguna atau kata laluan tidak tepat.' });
        return;
      }

      const token = signAdminToken(matchedUser.username, matchedUser.fullName);
      res.json({
        authenticated: true,
        username: matchedUser.username,
        fullName: matchedUser.fullName,
        token,
      });
    } catch (error) {
      console.error('[CRM] Login error:', error);
      res.status(500).json({ error: 'Ralat pelayan semasa mengesahkan log masuk.' });
    }
  });

  app.get('/api/admin/session', (req: Request, res: Response) => {
    const session = verifyAdminToken(extractBearerToken(req));
    if (!session) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      username: session.username,
      fullName: session.fullName,
    });
  });

  // Public Lead Submission Endpoint (used by visitors via ApplyModal)
  app.post('/api/leads', async (req: Request, res: Response) => {
    const validation = validateLeadPayload(req.body ?? {});
    if (!validation.valid || !validation.normalized) {
      res.status(400).json({ error: validation.error || 'Data permohonan tidak sah.' });
      return;
    }

    const now = new Date().toISOString();
    const newLead: CrmLeadRecord = {
      id: crypto.randomUUID(),
      nama: validation.normalized.nama,
      telefon: validation.normalized.telefon,
      emel: validation.normalized.emel,
      programPilihan: validation.normalized.programPilihan,
      minatPembiayaan: validation.normalized.minatPembiayaan,
      status: 'baru',
      nota: '',
      sumber: validation.normalized.sumber ?? 'Landing Page GIS',
      tarikhDaftar: now,
      dikemaskiniPada: now,
      crmSynced: false,
    };

    const externalSync = await forwardToExternalCrm(newLead);
    newLead.crmSynced = externalSync.synced;
    if (externalSync.provider) {
      newLead.crmProvider = externalSync.provider;
    }

    try {
      const existing = await readLeads();
      const updated = [newLead, ...existing];
      await writeLeads(updated);
      res.status(201).json({ lead: newLead });
    } catch (error) {
      console.error('[CRM] Failed to persist lead:', error);
      res.status(500).json({ error: 'Gagal menyimpan rekod prospek ke pangkalan data.' });
    }
  });

  // Protected CRM Admin Routes
  app.get('/api/leads', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const leads = await readLeads();
      leads.sort(
        (a, b) => new Date(b.tarikhDaftar).getTime() - new Date(a.tarikhDaftar).getTime(),
      );
      res.json({ leads });
    } catch (error) {
      console.error('[CRM] Failed to read leads:', error);
      res.status(500).json({ error: 'Gagal memuatkan senarai prospek CRM.' });
    }
  });

  app.patch('/api/leads/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = (req.body ?? {}) as CrmLeadUpdatePayload;

    try {
      const leads = await readLeads();
      const idx = leads.findIndex((item) => item.id === id);
      if (idx === -1) {
        res.status(404).json({ error: 'Rekod prospek tidak ditemui.' });
        return;
      }

      const current = leads[idx];
      const nextStatus =
        body.status && VALID_STATUSES.includes(body.status) ? body.status : current.status;
      const nextFunding =
        body.minatPembiayaan && FUNDING_OPTIONS.includes(body.minatPembiayaan)
          ? body.minatPembiayaan
          : current.minatPembiayaan;
      const nextNota = typeof body.nota === 'string' ? body.nota.trim() : current.nota;

      const updatedLead: CrmLeadRecord = {
        ...current,
        status: nextStatus,
        minatPembiayaan: nextFunding,
        nota: nextNota,
        dikemaskiniPada: new Date().toISOString(),
      };

      leads[idx] = updatedLead;
      await writeLeads(leads);
      res.json({ lead: updatedLead });
    } catch (error) {
      console.error('[CRM] Failed to update lead:', error);
      res.status(500).json({ error: 'Gagal mengemas kini rekod prospek.' });
    }
  });

  app.delete('/api/leads/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const leads = await readLeads();
      const filtered = leads.filter((item) => item.id !== id);
      if (filtered.length === leads.length) {
        res.status(404).json({ error: 'Rekod prospek tidak ditemui.' });
        return;
      }
      await writeLeads(filtered);
      res.json({ deleted: true, id });
    } catch (error) {
      console.error('[CRM] Failed to delete lead:', error);
      res.status(500).json({ error: 'Gagal memadam rekod prospek.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GIS Landing & CRM Server running on http://localhost:${PORT}`);
  });
}

startServer();
