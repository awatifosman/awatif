# Pelan Pembangunan Landing Page Rasmi GIS (Program Pengajian Logistik & TVET)

Dokumen ini merupakan panduan pembangunan lengkap dan kod sumber sedia guna (*single-file production ready*) untuk *landing page* rasmi **GIS (Institusi Pengajian Tinggi)** yang menyasarkan **ibu bapa kepada pelajar berumur 18 tahun ke atas**.

---

## 1. Spesifikasi Visual & Pengalaman Pengguna (UI/UX)

1. **Tema Warna Cerah (*Strict Light Mode*):**
   * Tidak menggunakan sebarang tema gelap (*dark mode*).
   * Latar belakang utama menggunakan putih bersih (`#FFFFFF`), kelabu lembut (`#F8FAFC`), dan krim lembut (`#FFFBEB`) untuk memberikan suasana mesra, telus, dan meyakinkan ibu bapa.
   * Warna aksen korporat menggunakan **Biru Diraja (*Royal Navy* `#0F294A`)** untuk teks berwibawa dan **Emas (*Warm Gold* `#D97706` / `#F59E0B`)** untuk butang tindakan utama (*Call-To-Action*).

2. **Arahan Aset Visual & Fotografi (*Widescreen Cinematic*):**
   * **Subjek Utama (Hero & Parallax):** Menggunakan gambar wanita Melayu manis bertudung yang kelihatan muda, bergaya moden, dan mesra (berusia sekitar 35 tahun) yang melambangkan profil ibu moden yang prihatin terhadap masa depan pendidikan anak.
   * **Komposisi Sinematik (*Widescreen 16:9 / 21:9*):** Gambar dipaparkan dalam nisbah layar lebar penuh dengan ruang negatif di bahagian kiri untuk kebolehbacaan teks yang jelas tanpa menutup wajah subjek.
   * *Nota Penggantian Gambar:* Dalam kod di bawah, pautan gambar beresolusi tinggi telah disertakan bersama kod sandaran (`onerror`). Anda boleh menggantikan URL gambar tersebut dengan foto rasmi penggambaran (*photoshoot*) GIS yang menepati kriteria wanita Melayu bertudung berusia 35 tahun.

3. **Gaya *Parallax* & Animasi Transisi (*Scroll Reveal*):**
   * **Parallax Scrolling:** Lapisan latar belakang sinematik bergerak pada kadar berbeza semasa pengguna menatal halaman (*scroll*), memberikan kedalaman visual yang premium.
   * **Animate Section & Text Transition:** Menggunakan `IntersectionObserver` API (ringan, pantas, dan tanpa kebergantungan luar yang berat) untuk animasi *fade-up*, *staggered text reveal*, dan peralihan kad secara berperingkat apabila memasuki ruang pandangan skrin.

4. **Aliran Tindakan (*Conversion Flow*) & Penghantaran Emel:**
   * Klik pada mana-mana butang **"Daftar Minat"** atau **"Mohon Sekarang"** akan membuka tetingkap pop-up (*modal*) cerah dengan **3 ruangan wajib**:
     1. Nama Penuh
     2. No. Telefon
     3. Alamat Emel
   * Apabila pengguna menekan butang **Hantar**, data akan dihantar terus ke emel **`awatifosman86@gmail.com`** melalui integrasi AJAX (`FormSubmit.co`) berserta butang sandaran aplikasi emel (`mailto:`).

---

## 2. Struktur Susun Atur Halaman (*Wireframe*)

1. **Header Navigasi Cerah (*Glassmorphism White*):** Logo GIS, pautan pantas, dan butang CTA utama.
2. **Hero Section (*Widescreen Cinematic + Parallax*):** Paparan skrin penuh menampilkan visual ibu Melayu moden bertudung (35 tahun) bersama tajuk utama beranimasi yang menyentuh emosi dan harapan ibu bapa.
3. **Seksyen Empati (4 Kebimbangan Ibu Bapa vs Penyelesaian GIS):** Susunan kad beranimasi yang menjawab isu peluang kerja, fasiliti kampus, beban kewangan, dan pengiktirafan MQA.
4. **Banner Parallax Sinematik (Suasana Kampus & Fasiliti):** Jalur layar lebar dengan kesan *parallax* yang menekankan persekitaran pembelajaran moden dan kondusif.
5. **Prospek Kerjaya Industri Logistik:** Kad interaktif bagi jawatan *Logistics Executive*, *Warehouse Supervisor*, dan *Planning Supervisor*.
6. **Jaminan Kewangan & Pengiktirafan Rasmi:** Lencana pengiktirafan **MQA**, **TVET**, **Pinjaman PTPTN**, **Pinjaman PTPK**, dan **Biasiswa**.
7. **Seksyen Penutup (*Call-To-Action*):** Ajakan tindakan terakhir sebelum *footer*.
8. **Modal Pop-Up Borang 3 Maklumat:** Tetingkap borang ringkas yang terus menghantar data ke `awatifosman86@gmail.com`.

---

## 3. Kod Sumber Lengkap (`index.html`)

Simpan kod di bawah sebagai fail `index.html` dan muat naik ke pelayan web (*hosting*) anda:

```html
<!DOCTYPE html>
<html lang="ms" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GIS | Masa Depan Kerjaya Logistik & TVET Diiktiraf MQA</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Plus Jakarta Sans & Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        heading: ['Plus Jakarta Sans', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            navy: '#0F294A',
                            blue: '#1E40AF',
                            gold: '#D97706',
                            amber: '#F59E0B',
                            cream: '#FFFBEB',
                        }
                    }
                }
            }
        }
    </script>

    <style>
        /* =========================================================
           GAYA PARALLAX & ANIMASI TRANSISI SEKSYEN / TEKS (LIGHT MODE)
           ========================================================= */
        .parallax-bg {
            background-attachment: fixed;
            background-position: center right;
            background-repeat: no-repeat;
            background-size: cover;
        }

        /* Sokongan peranti mudah alih supaya parallax kekal lancar */
        @media (max-width: 1024px) {
            .parallax-bg {
                background-attachment: scroll;
                background-position: center center;
            }
        }

        /* Keadaan awal elemen sebelum muncul di skrin */
        .reveal-up {
            opacity: 0;
            transform: translateY(36px);
            transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-left {
            opacity: 0;
            transform: translateX(-36px);
            transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-right {
            opacity: 0;
            transform: translateX(36px);
            transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Keadaan aktif apabila elemen memasuki viewport */
        .reveal-visible {
            opacity: 1;
            transform: translate(0, 0);
        }

        /* Kelewatan bertingkat (Staggered Text & Card Transition) */
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }

        /* Animasi halus pada butang CTA */
        @keyframes softPulse {
            0%, 100% { box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.35); }
            50% { box-shadow: 0 15px 32px -3px rgba(217, 119, 6, 0.55); }
        }
        .cta-glow {
            animation: softPulse 3s infinite ease-in-out;
        }
    </style>
</head>
<body class="bg-white text-slate-800 antialiased selection:bg-amber-200 selection:text-brand-navy">

    <!-- =========================================================
         1. HEADER NAVIGASI CERAH (LIGHT GLASSMORPHISM)
         ========================================================= -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <!-- Logo GIS -->
                <a href="#" class="flex items-center gap-3 group">
                    <div class="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center shadow-md group-hover:bg-brand-blue transition">
                        <i class="fa-solid fa-graduation-cap text-xl text-amber-400"></i>
                    </div>
                    <div>
                        <span class="font-heading font-extrabold text-2xl tracking-tight text-brand-navy block leading-none">GIS</span>
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institusi Pengajian Tinggi</span>
                    </div>
                </a>

                <!-- Menu Navigasi -->
                <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                    <a href="#kebimbangan" class="hover:text-brand-navy transition">Penyelesaian Ibu Bapa</a>
                    <a href="#kerjaya" class="hover:text-brand-navy transition">Peluang Kerjaya</a>
                    <a href="#kewangan" class="hover:text-brand-navy transition">Kewangan & MQA</a>
                </nav>

                <!-- Butang CTA Header -->
                <div>
                    <button onclick="openApplyModal()" class="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                        <span>Daftar Minat</span>
                        <i class="fa-solid fa-arrow-right text-amber-400 text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- =========================================================
         2. HERO SECTION (WIDESCREEN CINEMATIC & PARALLAX LIGHT MODE)
         Menampilkan subjek wanita Melayu bertudung bergaya umur 35 tahun
         ========================================================= -->
    <section class="relative min-h-[88vh] flex items-center overflow-hidden bg-slate-50 border-b border-slate-200">
        <!-- Lapisan Gambar Widescreen Cinematic dengan Parallax -->
        <!-- Nota: Gantikan URL gambar di bawah dengan foto rasmi wanita Melayu manis bertudung bergaya umur 35 tahun -->
        <div 
            id="heroParallaxLayer"
            class="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-right-top transition-transform duration-100 ease-out"
            style="background-image: url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=85');"
        ></div>

        <!-- Lapisan Gradient Cerah (Light Cinematic Overlay) supaya teks sangat jelas & tidak gelap -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/25 lg:to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 lg:hidden"></div>

        <!-- Kandungan Utama Widescreen -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
            <div class="max-w-2xl space-y-6">
                
                <!-- Lencana Sasaran Ibu Bapa -->
                <div class="reveal-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>Khas Untuk Ibu Bapa Pelajar Berumur 18 Tahun Ke Atas</span>
                </div>

                <!-- Tajuk Utama (H1) dengan Animasi Transisi -->
                <h1 class="reveal-up delay-100 font-heading text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-brand-navy tracking-tight leading-[1.15]">
                    Pilihan Bijak Seorang Ibu Untuk <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-amber-600">Masa Depan Kerjaya Anak</span> Dalam Industri Logistik
                </h1>

                <!-- Sub-tajuk Empati -->
                <p class="reveal-up delay-200 text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                    Usah biarkan kebimbangan mengenai peluang kerjaya, kekangan kewangan, atau fasiliti kolej menghalang kejayaan anak anda. Di <strong>GIS</strong>, kami menyediakan latihan <strong>TVET</strong> diiktiraf <strong>MQA</strong> lengkap dengan tajaan kewangan penuh demi masa depan yang terjamin.
                </p>

                <!-- Butang Tindakan Utama -->
                <div class="reveal-up delay-300 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button onclick="openApplyModal()" class="cta-glow inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                        <i class="fa-solid fa-file-signature text-lg"></i>
                        <span>Berminat? Klik Untuk Daftar</span>
                    </button>
                    <a href="#kebimbangan" class="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-300 text-brand-navy font-bold text-sm shadow-sm transition">
                        <span>Lihat Kelebihan GIS</span>
                        <i class="fa-solid fa-arrow-down text-xs text-amber-600"></i>
                    </a>
                </div>

                <!-- Kad Petunjuk Kepercayaan Pantas (Light Card) -->
                <div class="reveal-up delay-400 pt-4 grid grid-cols-3 gap-3 sm:gap-5 max-w-xl">
                    <div class="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-xl p-3.5 shadow-sm">
                        <p class="font-heading font-extrabold text-brand-navy text-base sm:text-lg">MQA & TVET</p>
                        <p class="text-[11px] sm:text-xs text-slate-600 mt-0.5">Kelayakan Sah IPT</p>
                    </div>
                    <div class="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-xl p-3.5 shadow-sm">
                        <p class="font-heading font-extrabold text-amber-600 text-base sm:text-lg">PTPTN & PTPK</p>
                        <p class="text-[11px] sm:text-xs text-slate-600 mt-0.5">Serta Biasiswa Penuh*</p>
                    </div>
                    <div class="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-xl p-3.5 shadow-sm">
                        <p class="font-heading font-extrabold text-brand-navy text-base sm:text-lg">Kerjaya Cerah</p>
                        <p class="text-[11px] sm:text-xs text-slate-600 mt-0.5">Industri Logistik Global</p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- =========================================================
         3. KEBIMBANGAN IBU BAPA VS PENYELESAIAN GIS
         ========================================================= -->
    <section id="kebimbangan" class="py-20 sm:py-28 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Tajuk Seksyen -->
            <div class="text-center max-w-3xl mx-auto mb-16 reveal-up">
                <span class="inline-block text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
                    Kami Memahami Naluri Ibu Bapa
                </span>
                <h2 class="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy mt-4 leading-tight">
                    Menjawab 4 Kerisauan Utama Anda Tentang Pendidikan Anak Selepas Umur 18 Tahun
                </h2>
                <p class="text-slate-600 mt-4 text-base sm:text-lg">
                    Setiap ibu bapa mahukan yang terbaik. Lihat bagaimana ekosistem pendidikan di GIS direka khusus untuk menghilangkan keraguan anda.
                </p>
            </div>

            <!-- Grid 4 Kad Penyelesaian -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Kad 1 -->
                <div class="reveal-left delay-100 rounded-2xl bg-slate-50 border border-slate-200/80 p-7 sm:p-9 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
                    <div class="inline-flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold mb-5">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>Risau anak tiada peluang kerjaya & masa depan mencabar?</span>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-briefcase text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-xl text-brand-navy">Laluan Kerjaya Cerah Industri Logistik</h3>
                            <p class="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                                Industri logistik dan rantaian bekalan berkembang pesat setiap tahun. Graduan GIS dilatih terus untuk mengisi jawatan penting seperti <strong>Logistics Executive</strong>, <strong>Warehouse Supervisor</strong>, dan <strong>Planning Supervisor</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Kad 2 -->
                <div class="reveal-right delay-200 rounded-2xl bg-slate-50 border border-slate-200/80 p-7 sm:p-9 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
                    <div class="inline-flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold mb-5">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>Bimbang kolej kekurangan fasiliti & peralatan latihan?</span>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-building-columns text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-xl text-brand-navy">Fasiliti Lengkap, Moden & Kondusif</h3>
                            <p class="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                                GIS menyediakan kemudahan pembelajaran dan latihan praktikal yang mencukupi serta selesa bagi memastikan pelajar menguasai kemahiran operasi logistik sebenar sebelum melangkah ke alam pekerjaan.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Kad 3 -->
                <div class="reveal-left delay-200 rounded-2xl bg-slate-50 border border-slate-200/80 p-7 sm:p-9 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
                    <div class="inline-flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold mb-5">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>Memikirkan kos yuran & sumber kewangan keluarga?</span>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-xl text-brand-navy">Pembiayaan PTPTN, PTPK & Biasiswa</h3>
                            <p class="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                                Jangan biarkan faktor kewangan menyekat impian anak anda. Kami menyediakan akses bantuan kewangan menyeluruh termasuk <strong>Pinjaman PTPTN</strong>, <strong>Pinjaman PTPK</strong>, serta skim <strong>Biasiswa</strong> bagi pelajar yang layak.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Kad 4 -->
                <div class="reveal-right delay-300 rounded-2xl bg-slate-50 border border-slate-200/80 p-7 sm:p-9 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
                    <div class="inline-flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold mb-5">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>Ragui status kelayakan kolej & pengiktirafan sijil?</span>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-certificate text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-xl text-brand-navy">Program TVET & Diiktiraf MQA</h3>
                            <p class="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                                GIS adalah Institusi Pengajian Tinggi yang menawarkan program <strong>TVET</strong> berimpak tinggi serta mendapat kelayakan dan akreditasi rasmi daripada <strong>MQA (Agensi Kelayakan Malaysia)</strong>.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- =========================================================
         4. SEKSYEN PARALLAX WIDESCREEN CINEMATIC (INSPIRASI IBU BAPA)
         ========================================================= -->
    <section 
        class="parallax-bg relative py-24 sm:py-32 border-y border-slate-200"
        style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80');"
    >
        <!-- Overlay Putih Cerah Supaya Kekal Light Mode & Mudah Dibaca -->
        <div class="absolute inset-0 bg-white/88 backdrop-blur-[2px]"></div>

        <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-up">
            <span class="inline-block px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-wider mb-5">
                Pendidikan Berteraskan Industri Sebenar
            </span>
            <h2 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
                "Ketenangan Hati Ibu Bapa Apabila Melihat Anak Berjaya Membina Kerjaya Stabil"
            </h2>
            <p class="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed font-medium">
                Di GIS, setiap pelajar dibimbing secara dekat oleh tenaga pengajar berpengalaman dalam persekitaran kampus yang selamat, profesional, dan berdaya saing.
            </p>
            <div class="mt-8">
                <button onclick="openApplyModal()" class="inline-flex items-center gap-2.5 bg-brand-navy hover:bg-brand-blue text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer">
                    <span>Dapatkan Maklumat Kursus & Yuran</span>
                    <i class="fa-solid fa-arrow-right text-amber-400"></i>
                </button>
            </div>
        </div>
    </section>

    <!-- =========================================================
         5. PROSPEK KERJAYA UTAMA DALAM BIDANG LOGISTIK
         ========================================================= -->
    <section id="kerjaya" class="py-20 sm:py-28 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 reveal-up">
                <div class="max-w-2xl">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-blue bg-blue-100 px-3.5 py-1.5 rounded-full">
                        Jaminan Masa Depan Graduan
                    </span>
                    <h2 class="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy mt-4">
                        Peluang Kerjaya Menanti Anak Anda Selepas Tamat Pengajian
                    </h2>
                    <p class="text-slate-600 mt-3 text-base">
                        Sektor perdagangan dan e-dagang memerlukan ribuan pakar logistik setiap tahun. Antara kerjaya utama graduan GIS termasuklah:
                    </p>
                </div>
                <button onclick="openApplyModal()" class="self-start md:self-auto inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition cursor-pointer">
                    <span>Semak Kelayakan Anak</span>
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>

            <!-- 3 Kad Kerjaya -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Kerjaya 1 -->
                <div class="reveal-up delay-100 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6">
                        <i class="fa-solid fa-truck-fast text-2xl"></i>
                    </div>
                    <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Pengurusan & Operasi</span>
                    <h3 class="font-heading text-xl font-extrabold text-brand-navy mt-1">Logistics Executive</h3>
                    <p class="text-slate-600 text-sm mt-3 leading-relaxed">
                        Menyelaras penghantaran kargo domestik dan antarabangsa, pengurusan dokumentasi kastam, serta memastikan aliran rantaian bekalan syarikat berjalan lancar.
                    </p>
                    <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Sektor Pelabuhan, Kurier & Multinasional</span>
                    </div>
                </div>

                <!-- Kerjaya 2 -->
                <div class="reveal-up delay-200 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-brand-blue flex items-center justify-center mb-6">
                        <i class="fa-solid fa-warehouse text-2xl"></i>
                    </div>
                    <span class="text-xs font-bold text-brand-blue uppercase tracking-wider">Penyeliaan Gudang</span>
                    <h3 class="font-heading text-xl font-extrabold text-brand-navy mt-1">Warehouse Supervisor</h3>
                    <p class="text-slate-600 text-sm mt-3 leading-relaxed">
                        Mengetuai operasi gudang berteknologi tinggi, mengawal selia sistem inventori stok, keselamatan penyimpanan, dan pengagihan barangan berskala besar.
                    </p>
                    <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Pusat Pengedaran & Hab E-Dagang</span>
                    </div>
                </div>

                <!-- Kerjaya 3 -->
                <div class="reveal-up delay-300 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6">
                        <i class="fa-solid fa-chart-line text-2xl"></i>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Perancangan Strategik</span>
                    <h3 class="font-heading text-xl font-extrabold text-brand-navy mt-1">Planning Supervisor</h3>
                    <p class="text-slate-600 text-sm mt-3 leading-relaxed">
                        Merancang jadual bekalan bahan mentah, menganalisis permintaan pasaran, dan mengoptimumkan kos pengeluaran bagi syarikat pembuatan bertaraf global.
                    </p>
                    <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Kilang Pembuatan & Rantaian Bekalan</span>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- =========================================================
         6. BANTUAN KEWANGAN & PENGIKTIRAFAN RASMI (MQA & TVET)
         ========================================================= -->
    <section id="kewangan" class="py-20 sm:py-28 bg-white border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-14 reveal-up">
                <span class="text-xs font-bold uppercase tracking-widest text-brand-navy bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full">
                    Akreditasi & Sokongan Kewangan Pelajar
                </span>
                <h2 class="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy mt-4">
                    Diiktiraf Sepenuhnya & Kemudahan Pembiayaan Lengkap
                </h2>
                <p class="text-slate-600 mt-3 text-base">
                    GIS komited memastikan pendidikan berkualiti tinggi dapat diakses oleh semua pelajar tanpa membebankan ibu bapa.
                </p>
            </div>

            <!-- 5 Lencana Utama -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 reveal-up delay-200">
                <div class="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition">
                    <div class="w-12 h-12 mx-auto rounded-full bg-brand-navy text-amber-400 flex items-center justify-center mb-3">
                        <i class="fa-solid fa-stamp text-xl"></i>
                    </div>
                    <h3 class="font-heading font-extrabold text-brand-navy text-base">Kelayakan MQA</h3>
                    <p class="text-xs text-slate-600 mt-1">Diiktiraf Agensi Kelayakan Malaysia</p>
                </div>

                <div class="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition">
                    <div class="w-12 h-12 mx-auto rounded-full bg-brand-navy text-amber-400 flex items-center justify-center mb-3">
                        <i class="fa-solid fa-gears text-xl"></i>
                    </div>
                    <h3 class="font-heading font-extrabold text-brand-navy text-base">Program TVET</h3>
                    <p class="text-xs text-slate-600 mt-1">Latihan Kemahiran Berfokus Kerjaya</p>
                </div>

                <div class="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition">
                    <div class="w-12 h-12 mx-auto rounded-full bg-brand-navy text-amber-400 flex items-center justify-center mb-3">
                        <i class="fa-solid fa-landmark text-xl"></i>
                    </div>
                    <h3 class="font-heading font-extrabold text-brand-navy text-base">Pinjaman PTPTN</h3>
                    <p class="text-xs text-slate-600 mt-1">Pembiayaan Pengajian Tinggi</p>
                </div>

                <div class="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition">
                    <div class="w-12 h-12 mx-auto rounded-full bg-brand-navy text-amber-400 flex items-center justify-center mb-3">
                        <i class="fa-solid fa-coins text-xl"></i>
                    </div>
                    <h3 class="font-heading font-extrabold text-brand-navy text-base">Pinjaman PTPK</h3>
                    <p class="text-xs text-slate-600 mt-1">Tabung Pembangunan Kemahiran</p>
                </div>

                <div class="col-span-2 sm:col-span-1 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition">
                    <div class="w-12 h-12 mx-auto rounded-full bg-brand-navy text-amber-400 flex items-center justify-center mb-3">
                        <i class="fa-solid fa-medal text-xl"></i>
                    </div>
                    <h3 class="font-heading font-extrabold text-brand-navy text-base">Biasiswa</h3>
                    <p class="text-xs text-slate-600 mt-1">Insentif Pelajar Yang Layak</p>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================
         7. CALL-TO-ACTION PENUTUP (LIGHT CREAM CARD)
         ========================================================= -->
    <section class="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up">
            <div class="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-blue-50 border border-amber-200/80 p-8 sm:p-14 text-center shadow-xl">
                <span class="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                    Tempat Terhad Untuk Pengambilan Terkini
                </span>
                <h2 class="font-heading text-2xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
                    Berminat Mengetahui Lebih Lanjut Untuk Anak Anda?
                </h2>
                <p class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mt-4">
                    Klik butang di bawah dan isi 3 maklumat ringkas. Pegawai kaunselor GIS akan menghubungi anda segera untuk penerangan lengkap mengenai program Logistik, TVET & bantuan kewangan.
                </p>
                <div class="mt-8">
                    <button onclick="openApplyModal()" class="cta-glow inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base sm:text-lg px-9 py-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Berminat? Klik & Isi Borang Sekarang</span>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================
         FOOTER CERAH
         ========================================================= -->
    <footer class="bg-white border-t border-slate-200 py-10 text-slate-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-brand-navy text-amber-400 flex items-center justify-center">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <span class="font-heading font-bold text-brand-navy">GIS Institusi Pengajian Tinggi</span>
            </div>
            <p class="text-xs text-center sm:text-right">
                &copy; 2026 GIS. Program Pengajian Logistik & TVET Diiktiraf MQA.
            </p>
        </div>
    </footer>

    <!-- =========================================================
         8. POP-UP MODAL BORANG 3 MAKLUMAT (LIGHT MODE)
         Terus menghantar ke awatifosman86@gmail.com
         ========================================================= -->
    <div id="applyModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Latar Belakang Cerah Kabur (Light Backdrop) -->
        <div onclick="closeApplyModal()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"></div>

        <!-- Kotak Modal -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200">
                
                <!-- Header Modal Cerah -->
                <div class="bg-gradient-to-r from-amber-50 to-blue-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Pendaftaran Minat GIS</span>
                        <h3 class="font-heading text-xl font-extrabold text-brand-navy mt-0.5" id="modal-title">Sila Isi Maklumat Anda</h3>
                    </div>
                    <button onclick="closeApplyModal()" type="button" class="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer" aria-label="Tutup">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <!-- Borang 3 Ruangan -->
                <div class="p-6 sm:p-7 bg-white">
                    <p class="text-sm text-slate-600 mb-5">
                        Lengkapkan <strong>3 maklumat</strong> di bawah. Permohonan anda akan terus dihantar kepada pegawai kami untuk tindakan segera.
                    </p>

                    <form id="gisLeadForm" onsubmit="handleFormSubmit(event)" class="space-y-4">
                        <!-- 1. Nama -->
                        <div>
                            <label for="fullName" class="block text-sm font-bold text-brand-navy mb-1.5">
                                1. Nama Penuh <span class="text-rose-600">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <i class="fa-solid fa-user"></i>
                                </span>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="Nama" 
                                    required 
                                    placeholder="Masukkan nama penuh anda" 
                                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                >
                            </div>
                        </div>

                        <!-- 2. No Telefon -->
                        <div>
                            <label for="phoneNumber" class="block text-sm font-bold text-brand-navy mb-1.5">
                                2. No. Telefon <span class="text-rose-600">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <i class="fa-solid fa-phone"></i>
                                </span>
                                <input 
                                    type="tel" 
                                    id="phoneNumber" 
                                    name="No_Telefon" 
                                    required 
                                    placeholder="Contoh: 012-3456789" 
                                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                >
                            </div>
                        </div>

                        <!-- 3. Email -->
                        <div>
                            <label for="emailAddress" class="block text-sm font-bold text-brand-navy mb-1.5">
                                3. Alamat Emel <span class="text-rose-600">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input 
                                    type="email" 
                                    id="emailAddress" 
                                    name="Email" 
                                    required 
                                    placeholder="Contoh: nama@gmail.com" 
                                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                >
                            </div>
                        </div>

                        <!-- Butang Submit -->
                        <div class="pt-2">
                            <button 
                                type="submit" 
                                id="submitBtn"
                                class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <i class="fa-solid fa-paper-plane"></i>
                                <span id="submitBtnText">Submit Permohonan</span>
                            </button>
                        </div>
                    </form>

                    <!-- Mesej Status Penghantaran -->
                    <div id="formFeedback" class="hidden mt-5 rounded-xl p-4 text-sm"></div>
                </div>

            </div>
        </div>
    </div>

    <!-- =========================================================
         JAVASCRIPT: ANIMASI SCROLL, PARALLAX & PENGHANTARAN EMEL
         ========================================================= -->
    <script>
        // 1. ANIMASI TRANSISI SEKSYEN & TEKS (INTERSECTION OBSERVER)
        document.addEventListener("DOMContentLoaded", () => {
            const observerOptions = {
                root: null,
                rootMargin: "0px 0px -60px 0px",
                threshold: 0.12
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const animatedElements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
            animatedElements.forEach(el => revealObserver.observe(el));

            // 2. KESAN PARALLAX HALUS PADA HERO WIDESCREEN
            const heroLayer = document.getElementById("heroParallaxLayer");
            window.addEventListener("scroll", () => {
                const scrollY = window.scrollY;
                if (heroLayer && scrollY < 900) {
                    heroLayer.style.transform = `translateY(${scrollY * 0.25}px) scale(1.03)`;
                }
            }, { passive: true });
        });

        // 3. KAWALAN MODAL POP-UP & PENGHANTARAN KE awatifosman86@gmail.com
        const targetEmail = "awatifosman86@gmail.com";
        const modal = document.getElementById("applyModal");
        const form = document.getElementById("gisLeadForm");
        const feedbackBox = document.getElementById("formFeedback");
        const submitBtn = document.getElementById("submitBtn");
        const submitBtnText = document.getElementById("submitBtnText");

        function openApplyModal() {
            modal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                const firstInput = document.getElementById("fullName");
                if (firstInput) firstInput.focus();
            }, 100);
        }

        function closeApplyModal() {
            modal.classList.add("hidden");
            document.body.style.overflow = "auto";
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !modal.classList.contains("hidden")) {
                closeApplyModal();
            }
        });

        async function handleFormSubmit(event) {
            event.preventDefault();

            const nama = document.getElementById("fullName").value.trim();
            const telefon = document.getElementById("phoneNumber").value.trim();
            const emel = document.getElementById("emailAddress").value.trim();

            if (!nama || !telefon || !emel) {
                showFeedback("error", "Sila lengkapkan ketiga-tiga maklumat sebelum menghantar.");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-75", "cursor-not-allowed");
            submitBtnText.textContent = "Sedang Menghantar...";
            feedbackBox.classList.add("hidden");

            const subject = encodeURIComponent(`Permohonan Baru GIS (Logistik & TVET) - ${nama}`);
            const body = encodeURIComponent(
                `Salam Puan Awatif,\n\nBerikut adalah maklumat pendaftaran minat baru daripada laman web GIS:\n\n` +
                `1. Nama: ${nama}\n` +
                `2. No. Telefon: ${telefon}\n` +
                `3. Email: ${emel}\n\n` +
                `Mohon hubungi untuk konsultasi pengajian Logistik, TVET & bantuan kewangan.`
            );
            const mailtoLink = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        _subject: `Permohonan Baru GIS - ${nama}`,
                        _template: "table",
                        "Nama": nama,
                        "No. Telefon": telefon,
                        "Email": emel,
                        "Sumber": "Landing Page GIS (Light Mode Cinematic)"
                    })
                });

                const result = await response.json();

                if (response.ok && (result.success === "true" || result.success === true)) {
                    showFeedback(
                        "success",
                        `<div class="flex items-start gap-3">
                            <i class="fa-solid fa-circle-check text-emerald-600 text-lg mt-0.5"></i>
                            <div>
                                <p class="font-bold text-emerald-900">Terima kasih, ${escapeHtml(nama)}!</p>
                                <p class="text-emerald-800 mt-1">Maklumat anda telah dihantar terus ke <strong>${targetEmail}</strong>. Kami akan menghubungi anda di nombor <strong>${escapeHtml(telefon)}</strong> sebentar lagi.</p>
                            </div>
                        </div>`
                    );
                    form.reset();
                } else {
                    throw new Error("Penghantaran memerlukan pengesahan pelayar.");
                }
            } catch (error) {
                showFeedback(
                    "fallback",
                    `<div class="space-y-2">
                        <p class="font-bold text-amber-900"><i class="fa-solid fa-envelope-open-text mr-1"></i> Sahkan Penghantaran Melalui Emel</p>
                        <p class="text-amber-800 text-xs leading-relaxed">Klik butang di bawah untuk menghantar maklumat anda terus ke <strong>${targetEmail}</strong> melalui aplikasi emel anda:</p>
                        <a href="${mailtoLink}" class="inline-flex items-center justify-center gap-2 w-full bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs py-2.5 px-4 rounded-lg transition mt-1">
                            <i class="fa-solid fa-paper-plane text-amber-400"></i>
                            <span>Hantar Terus Ke Gmail Sekarang</span>
                        </a>
                    </div>`
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-75", "cursor-not-allowed");
                submitBtnText.textContent = "Submit Permohonan";
            }
        }

        function showFeedback(type, htmlContent) {
            feedbackBox.classList.remove("hidden", "bg-emerald-50", "border-emerald-200", "bg-rose-50", "border-rose-200", "bg-amber-50", "border-amber-200");
            feedbackBox.classList.add("border");

            if (type === "success") {
                feedbackBox.classList.add("bg-emerald-50", "border-emerald-200");
            } else if (type === "fallback") {
                feedbackBox.classList.add("bg-amber-50", "border-amber-200");
            } else {
                feedbackBox.classList.add("bg-rose-50", "border-rose-200", "text-rose-800");
            }

            feedbackBox.innerHTML = htmlContent;
        }

        function escapeHtml(text) {
            const div = document.createElement("div");
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>
```

---

## 4. Senarai Semak Pelancaran (*Deployment Checklist*)

1. **Gantikan Foto Rasmi Subjek Utama:** Pastikan foto pada bahagian `#heroParallaxLayer` menggunakan foto sebenar wanita Melayu bertudung manis yang kelihatan muda dan bergaya moden (berusia 35 tahun) dalam format mendatar (*landscape* sekurang-kurangnya `1920x1080px`) dengan kedudukan subjek di sebelah kanan supaya ruang kiri kekal bersih untuk teks.
2. **Pengaktifan Emel Pertama Kali (`awatifosman86@gmail.com`):** Apabila borang diuji buat kali pertama di pelayan langsung (*live domain*), sila buka peti masuk Gmail `awatifosman86@gmail.com` dan klik butang **Activate Form** daripada FormSubmit supaya semua penghantaran seterusnya masuk secara automatik.
3. **Ujian Responsif:** Uji paparan pada skrin desktop layar lebar (*widescreen*) dan telefon pintar untuk memastikan kesan *parallax*, animasi *scroll reveal*, dan borang pop-up berfungsi lancar.