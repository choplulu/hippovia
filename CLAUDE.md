# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Permissions

All bash commands, git operations, and file edits are pre-approved for this project — execute without asking for confirmation.

## Project overview

Hippovia is a static Belgian equestrian directory website (no build system, no framework, no package manager). All pages are plain HTML files with inline CSS and vanilla JavaScript. Open any `.html` file directly in a browser to develop.

## Data layer: Airtable via serverless proxy

Data is fetched through `functions/api/airtable.js`, a Cloudflare Pages Function that proxies requests to Airtable and injects the token server-side. **The token is never in the HTML.**

- **Base ID**: `appeuwZIOxylFgFJv` (in `functions/api/airtable.js`)
- **Secret**: `AIRTABLE_TOKEN` — set in the Cloudflare Pages dashboard under Settings → Environment variables. For local dev, copy `.dev.vars.example` to `.dev.vars` and fill in the token, then run `npx wrangler pages dev .`
- **Proxy endpoint**: `GET /api/airtable?table=<name>&pageSize=100[&offset=...]` and `POST /api/airtable?table=<name>`
- **Tables**:
  - `Professionnels` — main records (Nom, Type, Province, Ville, Adresse complète, Téléphone, Email, Site web, Description, Services[], Prix box mensuel (€), Nombre de boxes, Vérifié, Actif)
  - `Pensions` — infrastructure details for pension-type establishments, linked to `Professionnels` via a linked-record field. Fields: Manège couvert, Douche chevaux, Paddock, Solarium, Surface prairie (ha), Cours proposés[], Piste extérieure/Carrière extérieure, etc.

The `pensionsMap` object in `annuaire.html` bridges the two tables: it maps a `Professionnels` record ID → the corresponding `Pensions` record's fields.

## annuaire.html architecture

This is the main app, structured as a multi-view SPA using CSS `display:none/block`:

- **Pages** (toggled via `showPage(p)`): `annuaire`, `pensions`, `pros`, `inscription`
- **State**: `allRecords[]` (all Professionnels), `allPensionsData[]` (all Pensions), `pensionsMap{}` (ID lookup)
- **Data loading**: `init()` fetches both tables in parallel; `fetchAll(table)` handles Airtable pagination
- **Filtering**: `filterCards()` (main annuaire), `filterPensions()`, `filterPros()` — all filter client-side from `allRecords`
- **Comparison table**: `buildCompare()` / `buildComparePensions()` merge fields from both tables via `pensionsMap`
- **Detail modal**: `openModal(id)` / `closeModal()` — pulls from `allRecords` + `pensionsMap`
- **Registration form**: `submitForm()` POSTs a new record to the `Professionnels` table

## Category/type system

Seven professional types, each with a dedicated CSS color variable pair (base + light `-l` suffix):

| Type string | CSS var | Class |
|---|---|---|
| Pension / Centre équestre | `--sage` | `t-pension` |
| Vétérinaire | `--sky` | `t-vet` |
| Maréchal-ferrant | `--amber` | `t-marechal` |
| Ostéopathe / Kiné | `--berry` | `t-osteo` |
| Sellier / Équipementier | `--coral` | `t-sellier` |
| Shiatsu | `--teal` | `t-shiatsu` |
| Nutritionniste équin | `--gold` | `t-nutri` |

Type detection uses `String.includes()` on the French type string (e.g. `t.includes('Pension')`). The helper functions `tClass()`, `tIcon()`, `tColor()`, `tColorL()` in `annuaire.html` centralize this mapping.

## Design system

Fonts: **Cormorant Garamond** (headings/names, serif) + **DM Sans** (body, sans-serif). Icons: **Tabler Icons** webfont (`ti-*` classes). All CSS variables are defined in `:root` at the top of each file's `<style>` block.
