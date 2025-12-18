# PCEA Church Admin Phase - Implementation Plan

## 📋 Overview

This phase focuses on implementing core admin functionalities for the church-frontend, including:
- **Districts Management** (renamed from Regions)
- **User Registration** with district enforcement
- **District Leadership** assignment
- **Sermons Management**
- **Announcements** for mobile app consumption

---

## 🎯 Phase Goals

1. **Rename Regions → Districts** across backend and frontend
2. **Enforce District Membership** - Every user must belong to a district
3. **District Leadership** - Assign one or multiple users as district leaders
4. **Sermons Management** - Create, manage sermons with notes, bible verses, stories, lessons
5. **Announcements System** - Create announcements for mobile app consumption

---

## 📊 Database Schema Changes

### 1. **Region → District Migration**

**Backend Changes:**
- Rename `Region` entity to `District`
- Update all references (controllers, services, modules)
- Add new fields:
  - `leaderIds: number[]` - Array of user IDs who are district leaders
  - `memberCount: number` - Count of users in district (computed or cached)

**Entity Structure:**
```typescript
@Entity('districts') // Keep table name as 'regions' initially or migrate
export class District {
  id: number;
  name: string;
  code?: string;
  description?: string;
  coordinates?: string[];
  leaderIds: number[]; // NEW: Array of user IDs
  memberCount?: number; // NEW: Cached count
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  @OneToMany(() => User, (user) => user.district)
  members: User[];
}
```

### 2. **User Entity Updates**

**Add District Relationship:**
```typescript
@Entity()
export class User {
  // ... existing fields ...
  
  @ManyToOne(() => District, (district) => district.members, { nullable: false })
  @JoinColumn({ name: 'districtId' })
  district: District; // REQUIRED - Every user must have a district
  
  @Column()
  districtId: number; // REQUIRED - Foreign key
  
  // ... rest of fields ...
}
```

### 3. **Sermon Entity** (NEW)

```typescript
@Entity('sermons')
export class Sermon {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;
  
  @Column({ type: 'text' })
  notes: string; // Main sermon notes/content
  
  @Column('text', { array: true })
  bibleVerses: string[]; // Array of bible verse references, e.g., ["John 3:16", "Romans 8:28"]
  
  @Column({ type: 'text', nullable: true })
  stories: string; // Stories shared in the sermon
  
  @Column({ type: 'text', nullable: true })
  lessons: string; // Lessons learned/teachings
  
  @Column({ type: 'date' })
  sermonDate: Date; // Date when sermon was delivered
  
  @Column({ nullable: true })
  preacher: string; // Name of the preacher
  
  @Column({ nullable: true })
  location: string; // Where sermon was delivered
  
  @Column({ default: true })
  isPublished: boolean; // Whether sermon is published for viewing
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### 4. **Announcement Entity** (NEW)

```typescript
@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;
  
  @Column({ type: 'text' })
  content: string;
  
  @Column({ type: 'enum', enum: AnnouncementType, default: AnnouncementType.GENERAL })
  type: AnnouncementType; // 'general' | 'event' | 'prayer' | 'ministry'
  
  @Column({ type: 'enum', enum: AnnouncementPriority, default: AnnouncementPriority.MEDIUM })
  priority: AnnouncementPriority; // 'low' | 'medium' | 'high'
  
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date; // When announcement was published
  
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // When announcement expires (optional)
  
  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: false })
  isMobileAppVisible: boolean; // Flag for mobile app consumption
  
  @Column({ type: 'json', nullable: true })
  metadata: {
    imageUrl?: string;
    eventDate?: Date;
    location?: string;
    contactPerson?: string;
    contactPhone?: string;
  };
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

enum AnnouncementType {
  GENERAL = 'general',
  EVENT = 'event',
  PRAYER = 'prayer',
  MINISTRY = 'ministry',
}

enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
```

---

## 🚀 Implementation Phases

### **PHASE 1: Backend - Districts Migration & User Updates** (Week 1)

#### 1.1 Rename Region → District
- [ ] Create new `District` entity (or rename existing)
- [ ] Update `RegionsModule` → `DistrictsModule`
- [ ] Update `RegionsService` → `DistrictsService`
- [ ] Update `RegionsController` → `DistrictsController`
- [ ] Update all route paths: `/regions` → `/districts`
- [ ] Add `leaderIds` field to District entity
- [ ] Add `memberCount` field (computed or cached)

#### 1.2 Update User Entity
- [ ] Add `districtId` column (required, not nullable)
- [ ] Add `@ManyToOne` relationship to District
- [ ] Update `CreateUserDto` to require `districtId`
- [ ] Update `UpdateUserDto` to allow `districtId` updates
- [ ] Add validation: district must exist before user creation

#### 1.3 District Leadership
- [ ] Add endpoint: `POST /api/districts/:id/assign-leaders` - Assign leaders
- [ ] Add endpoint: `POST /api/districts/:id/remove-leader/:userId` - Remove leader
- [ ] Add endpoint: `GET /api/districts/:id/leaders` - Get district leaders
- [ ] Add service method: `assignLeaders(districtId, userIds[])`
- [ ] Add service method: `getLeaders(districtId)`
- [ ] Validation: Users must exist and belong to the district

#### 1.4 Update User Service
- [ ] Enforce district requirement in `create()` method
- [ ] Add validation: district must exist
- [ ] Update `findAll()` to include district relationship
- [ ] Add method: `getUsersByDistrict(districtId)`

**Deliverables:**
- District entity with leadership support
- User entity with required district relationship
- All API endpoints updated
- District leadership endpoints working

---

### **PHASE 2: Backend - Sermons Module** (Week 1-2)

#### 2.1 Create Sermons Module
- [ ] Create `Sermon` entity with all fields
- [ ] Create `CreateSermonDto` with validation
- [ ] Create `UpdateSermonDto`
- [ ] Create `SermonsService` with CRUD operations
- [ ] Create `SermonsController` with endpoints:
  - `POST /api/sermons` - Create sermon
  - `GET /api/sermons` - List all (with filters: date, preacher, published)
  - `GET /api/sermons/:id` - Get one
  - `PUT /api/sermons/:id` - Update
  - `DELETE /api/sermons/:id` - Delete
  - `POST /api/sermons/:id/publish` - Publish sermon
  - `POST /api/sermons/:id/unpublish` - Unpublish sermon
- [ ] Register module in `AppModule`

#### 2.2 Sermon Features
- [ ] Bible verse parsing/validation (optional)
- [ ] Search functionality (by title, preacher, date, bible verses)
- [ ] Filter by published/unpublished
- [ ] Filter by date range

**Deliverables:**
- Complete Sermons module
- All CRUD operations
- Publish/unpublish functionality
- Search and filter capabilities

---

### **PHASE 3: Backend - Announcements Module** (Week 2)

#### 3.1 Create Announcements Module
- [ ] Create `Announcement` entity with all fields
- [ ] Create `CreateAnnouncementDto` with validation
- [ ] Create `UpdateAnnouncementDto`
- [ ] Create `AnnouncementsService` with CRUD operations
- [ ] Create `AnnouncementsController` with endpoints:
  - `POST /api/announcements` - Create announcement
  - `GET /api/announcements` - List all (with filters)
  - `GET /api/announcements/active` - Get active announcements
  - `GET /api/announcements/mobile` - Get mobile app visible announcements
  - `GET /api/announcements/:id` - Get one
  - `PUT /api/announcements/:id` - Update
  - `DELETE /api/announcements/:id` - Delete
  - `POST /api/announcements/:id/publish` - Publish
  - `POST /api/announcements/:id/expire` - Expire
- [ ] Register module in `AppModule`

#### 3.2 Announcement Features
- [ ] Filter by type (general, event, prayer, ministry)
- [ ] Filter by priority
- [ ] Filter by active/expired
- [ ] Mobile app visibility flag
- [ ] Metadata support (image, event date, location, contact)

**Deliverables:**
- Complete Announcements module
- All CRUD operations
- Mobile app visibility support
- Publish/expire functionality

---

### **PHASE 4: Frontend - Districts Management** (Week 2-3)

#### 4.1 Update Districts Page
- [ ] Rename "Regions" to "Districts" in UI
- [ ] Update route: `/admin/regions` → `/admin/districts` (or keep route, update labels)
- [ ] Connect to `/api/districts` endpoints
- [ ] Display district list with:
  - Name, Code, Description
  - Member Count
  - Leaders (list of leader names)
  - Actions (Edit, Delete, Manage Leaders)
- [ ] Create/Edit district modal
- [ ] Delete confirmation

#### 4.2 District Leadership Management
- [ ] Create "Manage Leaders" modal/page
- [ ] Display current leaders
- [ ] Search/select users to add as leaders
- [ ] Remove leader functionality
- [ ] Validation: Only users in the district can be leaders
- [ ] Display leader count

**Deliverables:**
- Districts page fully functional
- Leadership management interface
- All CRUD operations working

---

### **PHASE 5: Frontend - User Registration with Districts** (Week 3)

#### 5.1 Update User Registration/Creation
- [ ] Update user creation form to include district dropdown
- [ ] Fetch districts on form load
- [ ] Make district selection **required**
- [ ] Display district name in user list
- [ ] Add filter: "Filter by District"
- [ ] Update user edit form to allow district change
- [ ] Show district info in user details

#### 5.2 User-District Relationship Display
- [ ] Show district name in user table
- [ ] Add "View District" link from user
- [ ] Show district members count
- [ ] Display if user is a district leader (badge/indicator)

**Deliverables:**
- User registration with district enforcement
- District selection in all user forms
- District information displayed throughout

---

### **PHASE 6: Frontend - Sermons Management** (Week 3-4)

#### 6.1 Create Sermons Page
- [ ] Create `/admin/sermons` page
- [ ] Display sermons list with:
  - Title, Preacher, Date
  - Bible Verses (display as tags)
  - Published status
  - Actions (View, Edit, Delete, Publish/Unpublish)
- [ ] Search functionality (title, preacher, bible verses)
- [ ] Filter by: Date range, Preacher, Published status

#### 6.2 Sermon Creation/Edit Form
- [ ] Create sermon form with fields:
  - Title (required)
  - Sermon Date (required)
  - Preacher (optional)
  - Location (optional)
  - Notes (rich text editor or textarea)
  - Bible Verses (multi-input, add multiple verses)
  - Stories (textarea)
  - Lessons (textarea)
  - Published checkbox
- [ ] Form validation
- [ ] Preview functionality
- [ ] Save as draft / Publish options

#### 6.3 Sermon View/Details
- [ ] Sermon detail page/modal
- [ ] Display all sermon information
- [ ] Format bible verses nicely
- [ ] Print-friendly view (optional)

**Deliverables:**
- Complete Sermons management page
- Create/Edit/Delete functionality
- Search and filters
- Publish/unpublish functionality

---

### **PHASE 7: Frontend - Announcements Management** (Week 4)

#### 7.1 Create Announcements Page
- [ ] Create `/admin/announcements` page
- [ ] Display announcements list with:
  - Title, Type, Priority
  - Published Date, Expires Date
  - Active status
  - Mobile App Visible indicator
  - Actions (View, Edit, Delete, Publish, Expire)
- [ ] Filter by: Type, Priority, Active/Expired, Mobile App Visible
- [ ] Search functionality

#### 7.2 Announcement Creation/Edit Form
- [ ] Create announcement form with fields:
  - Title (required)
  - Content (rich text editor)
  - Type (dropdown: general, event, prayer, ministry)
  - Priority (dropdown: low, medium, high)
  - Published Date (optional, auto-set on publish)
  - Expires Date (optional)
  - Mobile App Visible (checkbox)
  - Metadata (conditional based on type):
    - Image URL (for events)
    - Event Date (for events)
    - Location (for events)
    - Contact Person (for events/ministry)
    - Contact Phone (for events/ministry)
- [ ] Form validation
- [ ] Preview functionality

#### 7.3 Announcement View/Details
- [ ] Announcement detail page/modal
- [ ] Display all announcement information
- [ ] Show metadata if available
- [ ] Mobile app preview (optional)

**Deliverables:**
- Complete Announcements management page
- Create/Edit/Delete functionality
- Mobile app visibility support
- Publish/expire functionality

---

### **PHASE 8: Frontend - Dashboard Updates** (Week 4-5)

#### 8.1 Update Admin Dashboard
- [ ] Add "Districts" card with count
- [ ] Add "Sermons" card with count (published/unpublished)
- [ ] Add "Announcements" card with count (active/expired)
- [ ] Add "Recent Sermons" section
- [ ] Add "Active Announcements" section
- [ ] Add quick actions: Create Sermon, Create Announcement

#### 8.2 Update Sidebar Menu
- [ ] Rename "Regions" to "Districts"
- [ ] Add "Sermons" menu item
- [ ] Add "Announcements" menu item
- [ ] Update menu order

**Deliverables:**
- Updated dashboard with new metrics
- Updated sidebar menu
- Quick access to new features

---

## 🔧 Technical Implementation Details

### API Endpoints Summary

#### Districts
- `GET /api/districts` - List all districts
- `GET /api/districts/:id` - Get district
- `POST /api/districts` - Create district
- `PUT /api/districts/:id` - Update district
- `DELETE /api/districts/:id` - Delete district
- `POST /api/districts/:id/assign-leaders` - Assign leaders
- `GET /api/districts/:id/leaders` - Get leaders
- `POST /api/districts/:id/remove-leader/:userId` - Remove leader
- `GET /api/districts/:id/members` - Get district members

#### Users (Updated)
- `POST /api/users` - Create user (requires `districtId`)
- `GET /api/users?districtId=1` - Filter users by district
- `PUT /api/users/:id` - Update user (can update `districtId`)

#### Sermons
- `POST /api/sermons` - Create sermon
- `GET /api/sermons` - List all (with filters)
- `GET /api/sermons/:id` - Get sermon
- `PUT /api/sermons/:id` - Update sermon
- `DELETE /api/sermons/:id` - Delete sermon
- `POST /api/sermons/:id/publish` - Publish
- `POST /api/sermons/:id/unpublish` - Unpublish

#### Announcements
- `POST /api/announcements` - Create announcement
- `GET /api/announcements` - List all (with filters)
- `GET /api/announcements/active` - Get active
- `GET /api/announcements/mobile` - Get mobile app visible
- `GET /api/announcements/:id` - Get announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement
- `POST /api/announcements/:id/publish` - Publish
- `POST /api/announcements/:id/expire` - Expire

---

## 📁 File Structure

### Backend
```
backend/src/modules/
├── districts/ (renamed from regions)
│   ├── entities/
│   │   └── district.entity.ts
│   ├── dto/
│   │   ├── create-district.dto.ts
│   │   ├── update-district.dto.ts
│   │   └── assign-leaders.dto.ts
│   ├── districts.service.ts
│   ├── districts.controller.ts
│   └── districts.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts (updated with districtId)
│   ├── dto/
│   │   ├── create-user.dto.ts (updated with districtId)
│   │   └── update-user.dto.ts
│   └── ...
├── sermons/ (NEW)
│   ├── entities/
│   │   └── sermon.entity.ts
│   ├── dto/
│   │   ├── create-sermon.dto.ts
│   │   └── update-sermon.dto.ts
│   ├── sermons.service.ts
│   ├── sermons.controller.ts
│   └── sermons.module.ts
└── announcements/ (NEW)
    ├── entities/
    │   └── announcement.entity.ts
    ├── dto/
    │   ├── create-announcement.dto.ts
    │   └── update-announcement.dto.ts
    ├── announcements.service.ts
    ├── announcements.controller.ts
    └── announcements.module.ts
```

### Frontend
```
church-frontend/app/(dashboard)/admin/
├── districts/ (renamed from regions)
│   └── page.jsx
├── users/
│   └── page.jsx (updated with district selection)
├── sermons/ (NEW)
│   └── page.jsx
└── announcements/ (NEW)
    └── page.jsx
```

---

## ✅ Success Criteria

- [ ] All regions renamed to districts in backend and frontend
- [ ] Every user must have a district (enforced at creation)
- [ ] District leadership assignment working (one or multiple leaders)
- [ ] Sermons can be created with notes, bible verses, stories, lessons
- [ ] Sermons can be published/unpublished
- [ ] Announcements can be created with all metadata
- [ ] Announcements have mobile app visibility flag
- [ ] All frontend pages connected to backend APIs
- [ ] Dashboard updated with new metrics
- [ ] All CRUD operations working

---

## 🎯 Next Steps

1. **Start with Phase 1** - Backend districts migration and user updates
2. **Then Phase 2** - Backend sermons module
3. **Then Phase 3** - Backend announcements module
4. **Then Phase 4-7** - Frontend implementation
5. **Finally Phase 8** - Dashboard updates

---

## 📝 Notes

- **Database Migration**: Consider creating a migration script to rename `regions` table to `districts` or keep table name as `regions` and just rename the entity
- **Backward Compatibility**: If there are existing regions, ensure migration handles them
- **Validation**: District must exist before user creation - add proper error handling
- **Leadership Validation**: Users must belong to district before being assigned as leaders
- **Mobile App API**: The `/api/announcements/mobile` endpoint will be consumed by mobile app later

---

**Ready to start? Let's begin with Phase 1! 🚀**

