# 🚀 Rintis — AI Business Opportunity Advisor

> **COMPFEST 18 AI Innovation Competition (AIC)**  
> **Tema**: AI for the Backbone of the Economy — *Smart Commerce*  
> **Tim**: `sakading kading kadung` | **Institusi**: Universitas Diponegoro  

---

## 📌 Ringkasan Solusi

**Rintis** (*AI Business Opportunity Advisor*) adalah *Explainable Decision Support System* (EDSS) berbasis AI yang dirancang untuk membantu calon UMKM dan penjual baru (*new sellers*) mengidentifikasi celah pasar (*market gap* & *micro-niche*), mensimulasikan skenario harga (*what-if analysis*), serta memahami alasan di balik rekomendasi bisnis secara transparan menggunakan **Explainable AI (TreeSHAP)**.

Sistem fokus pada 3 kategori utama: **Fashion**, **Makanan**, dan **Minuman**.

```
[ User Input ]  ──( Keyword )──>  [ Next.js Frontend ]
                                          │
                                   ( POST /api/analyze )
                                          │
                                          ▼
                                 [ FastAPI Backend ]
                                          │
                                ( Feature Engineering )
                                          │
                                          ▼
                                [ XGBoost + TreeSHAP ]
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
            ( Demand Prediction )                    ( SHAP Feature Values )
                     │                                         │
                     └────────────────────┬────────────────────┘
                                          │
                                ( Opportunity Score )
                                          │
                                          ▼
                                [ JSON Response to FE ]
```

---

## ✨ Fitur Utama MVP

1. **Opportunity Discovery Engine**: Menghitung *Opportunity Score* (0–100) berdasarkan estimasi permintaan (*Predicted Demand*) dan kerapatan persaingan (*Competition Density*).
2. **Tri-Level Opportunity Classification**:
   - 🟢 **High Opportunity (Enter Market)**: Permintaan tinggi, persaingan rendah.
   - 🟡 **Niche Differentiation Required**: Permintaan tinggi, persaingan sedang, butuh diferensiasi.
   - 🔴 **High Risk / Red Ocean**: Pasar jenuh, persaingan ketat, margin tipis.
3. **Explainable AI (XAI / SHAP)**: Memberikan penjelasan transparan berbasis bahasa alami dan *feature importance* tentang faktor utama yang memengaruhi skor.
4. **What-If Price Simulator**: Simulasi penyesuaian harga jual ($\pm 20\%$) secara interaktif untuk melihat proyeksi perubahan *demand*.

---

## 🏗️ Arsitektur Modular (Modular System Architecture)

Aplikasi dibangun secara **modular 3-layer terpisah bersih** (*decoupled architecture*) sesuai standar penilaian COMPFEST 18 AIC:

```
rintis-ai/
├── frontend/                  # 🖥️ Layer 1: User Interface (Next.js 16 + TS + Tailwind v4)
│   ├── src/
│   │   ├── app/               # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   │   └── ...
│   ├── public/                # Static Assets (logo.png, bg-hero.png)
│   ├── package.json
│   └── Dockerfile
│
├── backend/                   # ⚙️ Layer 2: API Server (FastAPI + Pydantic)
│   ├── app/
│   │   ├── main.py            # Entry point FastAPI & CORS Configuration
│   │   ├── routes/
│   │   │   └── advisor.py     # REST Endpoint /api/analyze
│   │   ├── models/
│   │   │   └── schemas.py     # Data Schemas & API Contract
│   │   └── services/
│   │       └── opportunity.py # Business Logic & Scoring Formula
│   ├── ml/                    # 🤖 Layer 3: Machine Learning & XAI Engine
│   │   ├── inference.py       # Model Inference Pipeline (XGBoost / LightGBM)
│   │   └── explainer.py       # SHAP Explanation Generator
│   ├── data/                  # Dataset Storage (Tokopedia Dataset Snapshot)
│   │   └── .gitkeep
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml         # 🐳 Container Orchestration
├── .gitignore
└── README.md
```

---

## 🛠️ Justifikasi Stack & Teknologi

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Frontend** | **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** | Performa tinggi, *type safety*, pengembangan UI instan & estetik dengan prinsip *Liquid Glassmorphism*. |
| **Backend** | **FastAPI (Python 3.10+)** | *Framework* REST API mikro yang sangat cepat, *lightweight*, dan kompatibel penuh dengan ekosistem data science Python. |
| **Model AI** | **XGBoost / LightGBM** | Terbukti secara akademis paling akurat untuk pemodelan data terstruktur/tabular komersial e-commerce. |
| **Explainable AI** | **TreeSHAP (SHapley Additive exPlanations)** | Memberikan kontribusi nilai marginal (*Shapley values*) secara presisi dan deterministik untuk konsistensi penjelasan. |
| **Container** | **Docker Compose** | Memastikan *reproducibility* instan di lingkungan juri tanpa kendala dependensi lokal. |

---

## 🔌 API Contract (Core Inference Parameter)

### Endpoint: `POST /api/analyze`

#### **Request Body**:
```json
{
  "keyword": "gamis syar'i premium"
}
```

#### **Response Body**:
```json
{
  "keyword": "gamis syar'i premium",
  "category": "Fashion",
  "opportunity_score": 81,
  "opportunity_level": "high",
  "opportunity_label": "High Opportunity — Enter Market",
  "metrics": {
    "predicted_demand": 920,
    "competition_density": 0.12,
    "competition_label": "Rendah",
    "avg_price": 185000
  },
  "explanations": [
    {
      "icon": "✅",
      "text": "Persaingan sangat rendah (0.12) — sedikit seller di niche ini"
    },
    {
      "icon": "✅",
      "text": "Demand tinggi (920 unit) — tren modest fashion terus naik"
    },
    {
      "icon": "✅",
      "text": "Harga tinggi (Rp 185.000) — margin besar per unit"
    }
  ],
  "shap_features": [
    { "name": "Competition", "value": 0.35 },
    { "name": "Demand", "value": 0.28 },
    { "name": "Price", "value": 0.18 },
    { "name": "Rating", "value": 0.09 }
  ],
  "whatif": {
    "current_price": 185000,
    "min_price": 148000,
    "max_price": 222000,
    "current_demand": 920
  }
}
```

---

## 📦 Panduan Menjalankan Aplikasi Secara Lokal (Setup Guide)

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan untuk Juri)

Pastikan **Docker Desktop** sudah terinstall dan berjalan di komputer Anda.

1. **Clone repository**:
   ```bash
   git clone https://github.com/sleepyashell/rintis-ai.git
   cd rintis-ai
   ```

2. **Jalankan aplikasi via Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Akses aplikasi**:
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
# Buka terminal 1 (folder backend)
cd backend

# Buat virtual environment (opsional tapi disarankan)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Jalankan server FastAPI
uvicorn app.main:app --reload --port 8000
```
*Backend akan berjalan di `http://localhost:8000`.*

#### Step 2: Jalankan Frontend (Next.js)
```bash
# Buka terminal 2 (folder frontend)
cd frontend

# Install dependensi Node.js
npm install

# Jalankan dev server
npm run dev
```
*Frontend akan berjalan di ``.*

---

## 👥 Tim Pengembang

**Tim `sakading kading kadung`**  
*Universitas Diponegoro*

- **Raffie Aditya Akbar** (NIM: 24060124130054)
- **Reynaldi Bertinus Hutagaol** (NIM: 24060124140157)
- **Saburo Rafqi Hidayat** (NIM: 24060124140196)
- **Syuraih Umar Khotthob** (NIM: 24060124130092)
- **Yuma Hazza Yuditama** (NIM: 24060124120035)

---

## 📄 Lisensi
Hak Cipta © 2026 Tim `sakading kading kadung`. Dikembangkan khusus untuk COMPFEST 18 AI Innovation Competition (AIC).
http://localhost:3000