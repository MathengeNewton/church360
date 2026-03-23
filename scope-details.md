# Church360 — Scope & Product Details

**Document:** Scope details (Church vs Welfare, module-by-module)  
**Version:** Draft

---

## Platform overview

**Church360** is one platform with **one shared backend** and **two complementary experiences**:

| Experience | Role in the church | Focus |
|------------|-------------------|--------|
| **Main church (Church frontend)** | The whole congregation and general church operations | Information, worship life, structure, and **broad data collection** — who we are, where we meet, what we publish (sermons, events, announcements), and how the church is organised. |
| **Welfare (Welfare frontend)** | A **grouping inside the church** — like an umbrella ministry within the same body | **Collections and welfare-specific stewardship**: families, monthly and annual giving, payments, welfare notices, and reporting that ties money to members and households. |

Both apps use the **same identity, users, and core data** where it overlaps. Welfare does not replace the main church; it **specialises** a slice of church life (especially **money in** and **household-level membership** for the welfare) while the main church carries **church-wide** communication and operations.

---

## How it fits together

- **Main church** = public-facing and admin-facing **general church** work: districts, sermons, calendar, announcements, settings, and user records as the wider organisation sees them.
- **Welfare** = the **welfare ministry’s workspace** for **collections** (monthly/annual contributions, payments, campaigns) and **welfare families**, plus **notices** aimed at welfare members.
- Data flows conceptually: **church identity and structure** support **welfare operations**; **welfare families and giving** can inform leadership and treasury **inside** the welfare’s remit, while the main church remains the home for **whole-church** messaging and life.

---

## Module-by-module overview

**Shared** = both surfaces use the same backend module. **Church-primary** / **Welfare-primary** = where the product intent and primary UI lean.

### 1. Authentication (`auth`)

Secure sign-in, sessions, and password flows for everyone using either app. **Shared.** One account can access the right areas according to role.

### 2. Users & roles (`users`, `roles`)

People on the system and permissions (e.g. admin vs member). **Shared.** User records underpin both church-wide and welfare workflows.

### 3. Regions & districts (`regions`, `districts`)

Geographic or organisational structure of the church. **Shared.** Reporting and data collection by area work for church planning and welfare context.

### 4. Families (`families`)

Households: members linked as families — the unit welfare uses for giving and eligibility. **Welfare-primary.** Treasury and leadership see family-level and member-level views.

### 5. Monthly contributions (`monthly-contributions`)

Periodic **monthly** welfare giving, tracked over time. **Welfare-primary** — core to collections inside the welfare umbrella.

### 6. Annual contributions (`annual-contributions`)

**Annual** welfare commitments or yearly patterns, per member/family. **Welfare-primary.** Supports annual stewardship, planning, and reports.

### 7. Payments (`payments`)

Recording and tracking **money movement** (incoming/outgoing) in line with contributions and welfare operations. **Welfare-primary.**

### 8. Campaigns (`campaigns`)

Targeted **collection drives** or giving campaigns. **Welfare-primary** for welfare-specific drives; usable wherever the church runs structured campaigns.

### 9. Notices (`notices`)

**Welfare-focused communications** for welfare participants. **Welfare-primary.**

### 10. Announcements (`announcements`)

**Church-wide** news and updates. **Church-primary.**

### 11. Sermons (`sermons`)

Sermon content for the **main church** worship life. **Church-primary.**

### 12. Events (`events`)

Church **calendar** — services, meetings, activities. **Church-primary.**

### 13. Settings & configuration (church admin)

**Main church** administration and configuration. **Church-primary.**

### 14. Messaging & engagement (planned: SMS)

**Future SMS integration** for reminders, alerts, notices. **Cross-cutting** — welfare reminders and wider church communication.

---

## Summary paragraph

**Church360** unites **main church operations** (structure, sermons, events, announcements, settings, broad user data) with a **welfare umbrella** inside the same church that focuses on **families and collections** — monthly and annual contributions, payments, campaigns, and welfare notices — all on **one backend** so identity and structure stay consistent while each ministry gets the right tools.

---

## Quick reference: who uses what

| Module | Main church | Welfare |
|--------|-------------|---------|
| Auth, users, roles, regions/districts | Yes | Yes |
| Families | Shared | Primary |
| Monthly & annual contributions | Supporting | Primary |
| Payments, campaigns | Supporting | Primary |
| Notices | — | Primary |
| Announcements, sermons, events, settings | Primary | — |
| SMS (planned) | Yes | Yes |

---

## Original welfare product pitch (congregation-facing)

**Church360 Welfare** is a digital platform for welfare ministries: member records, family registrations, contributions, and communications in one place.

- **Treasury:** Record and retrieve member and family information; family and individual contribution visibility (monthly and annual); reports; incoming and outgoing money in context of annual and family contributions.
- **Leadership:** Straightforward welfare data aligned with the **main church**; welfare membership feeds the broader church for benefits, programmes, and support.
- **Members:** Organised information; welfare communications; contribution tracking; planned SMS for more efficient, inclusive communication.

**One sentence:** Church360 Welfare connects welfare membership, giving, and communication in one system — so treasury can account with confidence, leadership can serve with clarity, and members stay informed and engaged.

---

*End of scope details — draft for internal and stakeholder use.*
