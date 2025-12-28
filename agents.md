# AGENTS.md

## How AI Helped Build FlowHire Careers Builder

This doc tracks the AI prompts and fixes that got us from idea to working spec. Real talk on what worked, what needed manual cleanup.

---

## Key Prompts & Results

### 1. Full-Height Editor Layout

**Prompt**: "Next.js full-screen editor with sidebar + scrollable content, Tailwind + Shadcn"  
**AI**: Perplexity  
**AI gave**: `h-[calc(100vh-5rem)] flex overflow-hidden` pattern  
**Manual fix**: Adjusted for app header spacing, added `scrollbar-none` class  
**Result**: Editor fills viewport perfectly

### 2. Supabase Schema Tables

**Prompt**: "Convert this schema list to markdown tables"  
**AI**: Perplexity  
**AI gave**: Perfect tables with constraints/examples  
**Manual fix**: Stripped constraints, added Schema.png reference  
**Result**: Clean schema section ready for spec

### 3. Interface creation for the tables

**Prompt**: "TypeScript interfaces for company/jobs/pageLayout tables"  
**AI**: GitHub Copilot  
**AI gave**: Full `Company`, `Job`, `PageLayout` interfaces with proper typing  
**Manual fix**: Added optional fields for incomplete imports  
**Result**: Type-safe data fetching everywhere

### 4. Supabase RLS Policy creation

**Prompt**: "RLS policies for company/jobs/pageLayout with company ownership"  
**AI**: Perplexity  
**AI gave**: `company`/`jobs`/`page_layout` table + RLS policies for read/write/update by ownership  
**Manual fix**: Simplified to single-user-per-company assumption  
**Result**: Secure data access with minimal tables

### 5. Quick setup theme samples generation

**Prompt**: "Sample theme JSON for company table with Tailwind color palette"  
**AI**: Perplexity  
**AI gave**: 5 branded theme presets (SaaS-blue, fintech-green, etc.)  
**Manual fix**: None, perfect drop-in values  
**Result**: One-click theme switching in editor

### 6. Minor syntactical errors fixed using GitHub Copilot

**Usage**: Auto-complete + quick fixes  
**Examples**: Form event types, missing imports, Tailwind class conflicts  
**Result**: Clean TypeScript build, no red squiggles

---

## AI Tools Used

- **Perplexity** - Specs, prompts, architecture patterns, finding sources for generated answers
- **GitHub Copilot** - Code autocomplete, syntax fixes, interfaces  
- **ChatGPT** - Database Schema Validation, logical questions
