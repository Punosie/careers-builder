# FlowHire Careers Builder

Next.js + Supabase app for SaaS teams to build branded careers pages. Full-screen editor with theming, jobs import, and public careers page.

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%2BAuth-blue.svg)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue.svg)](https://tailwindcss.com/)
[![Shadcn](https://img.shields.io/badge/Shadcn-UI-gray.svg)](https://ui.shadcn.com/)

---

## Features

- **Full-screen editor** - Branding, jobs, layout tabs
- **Bulk jobs import** - CSV/XLSX → Supabase (with logo/banner storage)
- **Custom theming** - Colors, logo, banner per company
- **Preview + Live** - `/{slug}/preview` and `/{slug}/careers`
- **Mobile responsive** - Public careers page works on phone
- **Supabase Auth** - Email/password + forgot password

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd frontend
npm install
```


### 2. Supabase Setup

1. Create Supabase project
2. Set schema SQL ([`./schema.sql`](./schema.sql))

### 3. Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Run

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

---

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth + Postgres + Storage)
- **Shadcn/UI + Tailwind**
- **TypeScript**

---

## Docs

- [TechSpec.md](./TechSpec.md) - Full architecture
- [AGENTS.md](./AGENTS.md) - AI build log
- [Schema SQL](./schema.sql) - schema sql query


## Contact

**Shubhankar Kaushik**  
**GitHub**: [Punosie](https://github.com/Punosie)  
**Email**: [shubhankar.kaushik2003@gmail.com](mailto:shubhankar.kaushik2003@gmail.com)  
**Portfolio**: [My Website](https://punosie.vercel.app/)

**Let's collaborate on innovative projects!**
