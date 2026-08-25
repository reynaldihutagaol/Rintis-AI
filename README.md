# 🚀 Rintis AI — Explainable Decision Support System untuk Identifikasi Peluang Pasar pada E-Commerce di Indonesia

> **COMPFEST 18 AI Innovation Competition (AIC)**  
> **Tema**: AI for the Backbone of the Economy — *Smart Commerce*  
> **Tim**: `sakading kading kadung` 

---

## 📌 Ringkasan Solusi

**Rintis AI** adalah *Explainable Decision Support System* (DSS) berbasis AI yang dirancang untuk membantu calon penjual baru (*new sellers*) dan UMKM di Indonesia melakukan analisis pasar awal secara otomatis sebelum memasuki pasar *e-commerce*. 

Sistem mengintegrasikan analisis permintaan (*Predicted Demand*) berbasis **XGBoost** dan kerapatan persaingan (*Competition Density* berbasis *Herfindahl-Hirschman Index* / HHI), penjelasan transparan berbasis **SHAP (SHapley Additive exPlanations)**, serta modul simulasi harga interaktif (*what-if analysis*).

Fokus pengembangan pada tahap ini mencakup kategori produk utama seperti **Fashion**, **Makanan**, dan **Minuman** (F&B) sebagai representasi sektor UMKM di Indonesia.

```
[ Input Keyword / Kategori ]  ──( User Search )──>  [ Next.js Frontend ]
                                                             │
                                                      ( POST /api/analyze )
                                                             │
                                                             ▼
                                                    [ FastAPI Backend ]
                                                             │
                                                   ( Feature Engineering )
                                                             │
                                                             ▼
                                                   [ Model AI XGBoost ]
                                                             │
                         ┌───────────────────────────────────┴───────────────────────────────────┐
                         ▼                                                                       ▼
             ( Predicted Demand )                                                   ( SHAP Feature Values )
                         │                                                                       │
                         └───────────────────────────────────┬───────────────────────────────────┘
                                                             │
                                                  [ Business Logic Engine ]
                                                             │
                                          ( Multi-Criteria Decision Support )
                                                             │
                                                             ▼
                                                   [ Next.js Results View ]
                                        ( Produk Potensial, SHAP & Price Simulator )
```

---

## ✨ Fitur Utama MVP (Sesuai Proposal COMPFEST 18)

1. **Otomatisasi Analisis Data E-Commerce**:
   Mengolah 15.190 baris data produk Tokopedia (harga, ulasan, rating, jumlah penjualan `sold_count`, wishlist, toko, dan kota/wilayah) secara otomatis untuk mengeliminasi proses riset manual yang memakan waktu.

2. **Opportunity Discovery berdasarkan Demand & Competition Density**:
   Menganalisis kondisi permintaan (*Predicted Demand*) dan tingkat konsentrasi persaingan pasar (*Competition Density* berbasis HHI). Produk dengan penjualan tinggi namun persaingan sangat ketat tidak secara otomatis dianggap sebagai peluang terbaik.

3. **Pengolahan Multi-Kriteria (Business Logic Engine)**:
   Memproses kombinasi permintaan dan persaingan untuk mengklasifikasikan hasil menjadi:
   - **Daftar Produk Potensial (*Micro-Niche*)**: Kombinasi permintaan yang menarik dengan tingkat persaingan yang lebih rasional untuk dimasuki.
   - **Daftar Produk Favorit**: Produk dengan indikator permintaan historis yang paling menonjol.

4. **Explainable Recommendation (SHAP)**:
   Mengatasi sifat *black-box* model AI menggunakan **SHAP (SHapley Additive exPlanations)**. Sistem menampilkan faktor-faktor utama yang mendorong atau menekan estimasi permintaan (seperti rasio ulasan positif eWOM, harga relatif dibanding median pasar, *wishlist*, dan karakteristik *niche keyword*).

5. **Business Simulation (Skenario Perubahan Harga)**:
   Pada versi MVP, kami menyediakan fitur *Estimated Price* yang akan dikembangkan menjadi fitur ini yaitu modul *what-if analysis* interaktif yang memungkinkan calon penjual menguji skenario perubahan harga jual dan melihat proyeksi estimasi tingkat permintaan sebelum mengambil keputusan di pasar nyata.

---

## 🏗️ Arsitektur & Struktur File Proyek (Current Repository Tree)

```
rintis-ai/
├── backend/                           # ⚙️ Layer 2 & 3: FastAPI Backend & Machine Learning Engine
│   ├── app/
│   │   ├── main.py                    # Entry point FastAPI & konfigurasi CORS
│   │   ├── models/
│   │   │   └── schemas.py             # Data schemas Pydantic & API Contract
│   │   ├── routes/
│   │   │   └── advisor.py             # Router REST Endpoint /api/analyze
│   │   └── services/
│   │       └── opportunity.py         # Business Logic Engine, Model XGBoost & SHAP Inference
│   ├── data/
│   │   └── data_final.csv             # Dataset Tokopedia (15.190 baris data produk)
│   ├── ml/
│   │   ├── xgb_model.json             # Trained XGBoost Regressor Model
│   │   ├── target_encoder.pkl         # Target Encoder (category_encoders)
│   │   ├── market_reference.pkl       # Statistik referensi pasar per keyword
│   │   └── shap_explainer.pkl         # SHAP Explainer object
│   └── requirements.txt               # Dependensi Python Backend (FastAPI, XGBoost, SHAP, etc.)
│
├── frontend/                          # 🖥️ Layer 1: User Interface (Next.js 16 + TypeScript + Tailwind v4)
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── AnimatedLoadingLogo.tsx  # Frame-by-frame 8-step loading animation
│   │       │   ├── ResultsView.tsx          # Tampilan hasil analisis, kartu metrik & SHAP
│   │       │   └── SearchBar.tsx            # Search bar komponen liquid glassmorphism
│   │       ├── api.ts                       # Service Client HTTP ke FastAPI backend
│   │       ├── globals.css                  # Custom styling & background global
│   │       ├── keywords.ts                  # Referensi daftar kata kunci populer
│   │       ├── mockData.ts                  # Mock data fallback client
│   │       ├── page.tsx                     # Landing page Rintis AI
│   │       └── result/page.tsx              # Halaman hasil analisis
│   └── public/
│       ├── bg-main.png                      # Global pastel background asset
│       ├── loading/                         # Frame-by-frame logo animation assets (1-8.png)
│       └── logo.png                         # Logo Rintis AI
│
├── docker-compose.yml                 # 🐳 Container Orchestration (Multi-container setup)
├── .gitignore
└── README.md
```

---

## 🛠️ Justifikasi Teknologi & Metodologi Pemodelan

| Komponen | Teknologi / Metode | Alasan & Justifikasi Pemilihan |
|---|---|---|
| **Model AI** | **XGBoost (Gradient Boosting Decision Tree)** | Terbukti secara komputasional paling efisien dan akurat dalam menangani data tabular *e-commerce* berskala besar dengan interaksi non-linear yang kompleks. |
| **Explainable AI (XAI)** | **SHAP (SHapley Additive exPlanations)** | Berbasis *game theory*, memberikan skor interpretabilitas kontribusi fitur (harga, ulasan, wishlist, dll.) yang konsisten dan deterministik untuk mengatasi sifat *black-box* AI. |
| **Business Logic Engine** | **Multi-Criteria DSS & HHI Index** | Menggabungkan *Predicted Demand* dan *Herfindahl-Hirschman Index* (HHI) untuk mencegah bias rekomendasi produk yang sekadar ramai tapi jenuh persaingan. |
| **Backend API** | **FastAPI + Python 3.10+** | Performa tinggi, asinkron, serta terintegrasi mulus dengan ekosistem Machine Learning Python. |
| **Frontend UI** | **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** | *Type-safe*, responsif, dan menyajikan antarmuka *Liquid Glassmorphism* modern bagi pengguna non-teknis. |

---

## 🔌 API Contract (Core Inference Parameter)

### Endpoint: `POST /api/analyze`

#### **Request Body**:
```json
{
  "keyword": "baju batik"
}
```

#### **Response Body**:
```json
{
  "keyword": "baju batik",
  "matched_keyword": "baju batik",
  "category": "Fashion",
  "opportunity_score": 42,
  "opportunity_level": "medium",
  "opportunity_label": "Medium Opportunity",
  "metrics": {
    "predicted_demand": 2094,
    "competition_density": 430.37,
    "competition_label": "Rendah",
    "avg_price": 88500
  },
  "explanations": [
    {
      "icon": "✅",
      "text": "Sentimen ulasan positif (eWOM) mendorong naik estimasi penjualan (kontribusi SHAP: +0.721)."
    },
    {
      "icon": "⚠️",
      "text": "Minat pasar (wishlist) menekan estimasi penjualan (kontribusi SHAP: -0.642)."
    },
    {
      "icon": "⚠️",
      "text": "Karakteristik niche keyword menekan estimasi penjualan (kontribusi SHAP: -0.434)."
    }
  ],
  "shap_features": [
    { "name": "keyword_encoded", "value": -0.4338 },
    { "name": "log_price", "value": -0.0142 },
    { "name": "price_relative_to_median", "value": 0.0212 },
    { "name": "hhi_market_concentration", "value": 0.0301 },
    { "name": "log_wishlist_count", "value": -0.6424 },
    { "name": "positive_eWOM_ratio", "value": 0.7211 }
  ],
  "whatif": {
    "current_price": 88500,
    "min_price": 61949,
    "max_price": 115050,
    "current_demand": 2094
  }
}
```

---

## 📦 Panduan Menjalankan Aplikasi Secara Lokal (Setup Guide)

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan untuk Juri)

1. **Clone Repository**:
   ```bash
   git clone https://github.com/sleepyashell/rintis-ai.git
   cd rintis-ai
   ```

2. **Jalankan Aplikasi via Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Akses Aplikasi**:
   - 🖥️ **Frontend**: [http://localhost:3000](http://localhost:3000)
   - ⚙️ **Backend API**: [http://localhost:8000](http://localhost:8000)
   - 📑 **Dokumentasi Swagger API**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Opsi 2: Menjalankan Secara Manual (Development Mode)

#### Prasyarat:
- **Node.js** v18+
- **Python** v3.10+

#### Step 1: Jalankan Backend (FastAPI)
```bash
cd backend

# Install dependensi Python
pip install -r requirements.txt

# Jalankan server FastAPI
python -m uvicorn app.main:app --reload --port 8000
```
*Backend API akan berjalan di `http://localhost:8000`.*

#### Step 2: Jalankan Frontend (Next.js)
```bash
cd frontend

# Install dependensi Node.js
npm install

# Jalankan dev server
npm run dev
```
*Frontend akan berjalan di `http://localhost:3000`.*

---

## 👥 Tim Pengembang

**Tim `sakading kading kadung`**  
COMPFEST 18 (2026)

- **Raffie Aditya Akbar**
- **Reynaldi Bertinus Hutagaol** 
- **Saburo Rafqi Hidayat** 
- **Syuraih Umar Khotthob** 
- **Yuma Hazza Yuditama** 
