# PCEA Welfare Organization - Implementation Workplan

## 📋 Understanding the System

### Core Structure:
1. **Families** (Base Unit) - ✅ Already exists
2. **Annual Recurrent Contribution** - Annual amount, paid monthly
   - Small monthly payments that accumulate to annual total
   - Handle carryover debt/unpaid contributions to new year
3. **Payments** - Actual payment transactions (undistributed)
   - Bulk payments that can cover multiple months
4. **Campaigns** - Distribution mechanism
   - Distributes undistributed payments to individual monthly contributions
5. **Notices & Announcements** - Communication system

---

## 🎯 Current State Analysis

### ✅ What Exists:
**Backend:**
- ✅ Families module (complete)
- ✅ Users module (complete)
- ✅ Regions module (complete)
- ✅ Auth module (complete)
- ⚠️ Contributions module (exists but empty)
- ❌ Campaigns module (doesn't exist)
- ❌ Payments module (doesn't exist)
- ❌ Notices module (doesn't exist)

**Frontend (welfare-frontend):**
- ✅ All UI pages exist (Families, Campaigns, Contributions, Payments)
- ⚠️ All using mock data
- ⚠️ No API integration
- ❌ Notices/Announcements page missing

---

## 📊 Database Schema Design

### 1. **AnnualContribution** Entity
```typescript
{
  id: number;
  familyId: number; // FK to Family
  year: number; // e.g., 2025
  annualAmount: number; // Total annual contribution
  monthlyAmount: number; // annualAmount / 12
  status: 'active' | 'completed' | 'carried_over';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **MonthlyContribution** Entity
```typescript
{
  id: number;
  annualContributionId: number; // FK to AnnualContribution
  month: number; // 1-12
  year: number;
  expectedAmount: number; // Monthly amount
  paidAmount: number; // Amount paid so far
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. **Payment** Entity
```typescript
{
  id: number;
  familyId: number; // FK to Family
  amount: number; // Payment amount
  paymentDate: Date;
  paymentMethod: 'cash' | 'mpesa' | 'bank' | 'cheque';
  reference?: string; // Payment reference
  status: 'undistributed' | 'distributed' | 'partial';
  distributedAmount: number; // How much has been distributed
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. **Campaign** Entity
```typescript
{
  id: number;
  name: string;
  description?: string;
  paymentId: number; // FK to Payment (the payment being distributed)
  familyId: number; // FK to Family
  distributionDate: Date;
  monthlyContributions: MonthlyContribution[]; // Many-to-Many
  totalDistributed: number;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. **CampaignDistribution** Entity (Join Table)
```typescript
{
  id: number;
  campaignId: number; // FK to Campaign
  monthlyContributionId: number; // FK to MonthlyContribution
  amount: number; // Amount distributed to this month
  createdAt: Date;
}
```

### 6. **Notice** Entity
```typescript
{
  id: number;
  title: string;
  content: string;
  type: 'announcement' | 'notice' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'families' | 'specific'; // Can be extended
  targetFamilyIds?: number[]; // If specific
  publishedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Implementation Phases

### **PHASE 1: Database Schema & Backend Entities** (Week 1)

#### Tasks:
1. **Create AnnualContribution Entity**
   - [ ] Create entity file
   - [ ] Add relationships (Family)
   - [ ] Create DTOs (Create, Update)
   - [ ] Add validation

2. **Create MonthlyContribution Entity**
   - [ ] Create entity file
   - [ ] Add relationships (AnnualContribution)
   - [ ] Create DTOs
   - [ ] Add validation

3. **Create Payment Entity**
   - [ ] Create entity file
   - [ ] Add relationships (Family)
   - [ ] Create DTOs
   - [ ] Add validation

4. **Create Campaign Entity**
   - [ ] Create entity file
   - [ ] Add relationships (Payment, Family, MonthlyContributions)
   - [ ] Create DTOs
   - [ ] Add validation

5. **Create CampaignDistribution Entity**
   - [ ] Create join table entity
   - [ ] Add relationships

6. **Create Notice Entity**
   - [ ] Create entity file
   - [ ] Create DTOs
   - [ ] Add validation

7. **Update App Module**
   - [ ] Register all new entities in TypeORM
   - [ ] Update imports

**Deliverables:**
- All entities created
- Database migrations ready
- DTOs defined

---

### **PHASE 2: Backend Services - Core Logic** (Week 2)

#### 2.1 Annual Contribution Service
- [ ] `createAnnualContribution(familyId, year, annualAmount)` - Creates annual contribution and 12 monthly contributions
- [ ] `getAnnualContribution(familyId, year)` - Get contribution for a family/year
- [ ] `getAllAnnualContributions(familyId?)` - List all
- [ ] `carryOverDebt(familyId, fromYear, toYear)` - Carry over unpaid amounts to new year
- [ ] `updateAnnualContribution(id, data)` - Update

#### 2.2 Monthly Contribution Service
- [ ] `getMonthlyContributions(annualContributionId)` - Get all months for an annual contribution
- [ ] `getMonthlyContribution(id)` - Get single month
- [ ] `updateMonthlyContribution(id, paidAmount)` - Update when payment is distributed
- [ ] `getOverdueContributions(familyId?)` - Get overdue months
- [ ] `getPendingContributions(familyId?)` - Get pending months

#### 2.3 Payment Service
- [ ] `createPayment(familyId, amount, paymentDate, method, reference)` - Record payment
- [ ] `getPayments(familyId?, status?)` - List payments (filter by family/status)
- [ ] `getUndistributedPayments(familyId?)` - Get payments not yet distributed
- [ ] `getPayment(id)` - Get single payment
- [ ] `updatePaymentStatus(id, status)` - Update payment status

#### 2.4 Campaign Service (Distribution Logic)
- [ ] `createCampaign(paymentId, familyId, distributionData)` - Create campaign to distribute payment
- [ ] `distributePayment(paymentId, monthlyContributionIds, amounts)` - **CORE LOGIC**
  - Takes undistributed payment
  - Distributes to selected monthly contributions
  - Updates monthly contribution paid amounts
  - Updates payment status
  - Creates campaign record
- [ ] `getCampaigns(familyId?, paymentId?)` - List campaigns
- [ ] `getCampaign(id)` - Get single campaign
- [ ] `autoDistributePayment(paymentId)` - Auto-distribute to oldest unpaid months
- [ ] `undoDistribution(campaignId)` - Undo a distribution (if needed)

#### 2.5 Notice Service
- [ ] `createNotice(data)` - Create notice/announcement
- [ ] `getNotices(familyId?, isActive?)` - Get notices (filter by family, active status)
- [ ] `getNotice(id)` - Get single notice
- [ ] `updateNotice(id, data)` - Update notice
- [ ] `deleteNotice(id)` - Soft delete
- [ ] `publishNotice(id)` - Publish
- [ ] `expireNotice(id)` - Mark as expired

**Deliverables:**
- All services implemented
- Core distribution logic working
- Carryover logic working

---

### **PHASE 3: Backend Controllers & API Endpoints** (Week 2-3)

#### 3.1 Annual Contribution Controller
- [ ] `POST /api/annual-contributions` - Create
- [ ] `GET /api/annual-contributions` - List all
- [ ] `GET /api/annual-contributions/:id` - Get one
- [ ] `GET /api/annual-contributions/family/:familyId` - Get by family
- [ ] `PUT /api/annual-contributions/:id` - Update
- [ ] `POST /api/annual-contributions/carryover` - Carry over debt

#### 3.2 Monthly Contribution Controller
- [ ] `GET /api/monthly-contributions` - List all
- [ ] `GET /api/monthly-contributions/:id` - Get one
- [ ] `GET /api/monthly-contributions/annual/:annualContributionId` - Get by annual
- [ ] `GET /api/monthly-contributions/overdue` - Get overdue
- [ ] `GET /api/monthly-contributions/pending` - Get pending

#### 3.3 Payment Controller
- [ ] `POST /api/payments` - Create payment
- [ ] `GET /api/payments` - List all
- [ ] `GET /api/payments/:id` - Get one
- [ ] `GET /api/payments/family/:familyId` - Get by family
- [ ] `GET /api/payments/undistributed` - Get undistributed
- [ ] `PUT /api/payments/:id` - Update

#### 3.4 Campaign Controller
- [ ] `POST /api/campaigns` - Create campaign (manual distribution)
- [ ] `POST /api/campaigns/auto-distribute/:paymentId` - Auto-distribute payment
- [ ] `GET /api/campaigns` - List all
- [ ] `GET /api/campaigns/:id` - Get one
- [ ] `GET /api/campaigns/payment/:paymentId` - Get by payment
- [ ] `POST /api/campaigns/:id/undo` - Undo distribution

#### 3.5 Notice Controller
- [ ] `POST /api/notices` - Create
- [ ] `GET /api/notices` - List all
- [ ] `GET /api/notices/:id` - Get one
- [ ] `GET /api/notices/active` - Get active notices
- [ ] `GET /api/notices/family/:familyId` - Get for family
- [ ] `PUT /api/notices/:id` - Update
- [ ] `DELETE /api/notices/:id` - Delete
- [ ] `POST /api/notices/:id/publish` - Publish

**Deliverables:**
- All API endpoints working
- Swagger documentation
- Error handling

---

### **PHASE 4: Frontend - API Integration** (Week 3-4)

#### 4.1 Setup API Client
- [ ] Create API service/utility
- [ ] Setup axios/fetch with base URL
- [ ] Add interceptors for auth
- [ ] Error handling

#### 4.2 Families Page
- [ ] Connect to Families API
- [ ] Display families list
- [ ] Create/Edit/Delete functionality
- [ ] Link to annual contributions

#### 4.3 Annual Contributions Page (NEW)
- [ ] Create page component
- [ ] List annual contributions by family
- [ ] Create annual contribution form
- [ ] Display monthly breakdown
- [ ] Carryover debt functionality
- [ ] Year selector

#### 4.4 Monthly Contributions Page (NEW)
- [ ] Create page component
- [ ] Display monthly contributions grid/calendar view
- [ ] Show status (paid/pending/overdue)
- [ ] Filter by family, year, status
- [ ] Visual indicators

#### 4.5 Payments Page
- [ ] Connect to Payments API
- [ ] Display payments list
- [ ] Create payment form
- [ ] Filter by undistributed/distributed
- [ ] Show payment details
- [ ] Link to distribution

#### 4.6 Campaigns Page (Redesign)
- [ ] Connect to Campaigns API
- [ ] Display campaigns list
- [ ] **Distribution Interface** - Key feature:
  - Select undistributed payment
  - Show available monthly contributions
  - Allow manual distribution or auto-distribute
  - Visual distribution flow
- [ ] View distribution history
- [ ] Undo distribution (if needed)

#### 4.7 Notices/Announcements Page (NEW)
- [ ] Create page component
- [ ] Display notices list
- [ ] Create notice form
- [ ] Filter by type, priority, active
- [ ] Publish/Expire functionality
- [ ] Rich text editor for content

**Deliverables:**
- All pages connected to backend
- Forms working
- Data display working

---

### **PHASE 5: Advanced Features & Business Logic** (Week 4-5)

#### 5.1 Distribution Logic Enhancements
- [ ] Smart auto-distribution (oldest first, highest priority)
- [ ] Partial distribution handling
- [ ] Distribution validation (can't over-distribute)
- [ ] Distribution reports

#### 5.2 Debt Management
- [ ] Automatic carryover at year-end
- [ ] Debt calculation per family
- [ ] Debt reports
- [ ] Payment reminders

#### 5.3 Reporting & Analytics
- [ ] Family contribution summary
- [ ] Payment distribution reports
- [ ] Overdue contributions report
- [ ] Annual contribution status
- [ ] Export to PDF/Excel

#### 5.4 Notifications
- [ ] Email/SMS for payment received
- [ ] Reminders for overdue contributions
- [ ] Notice notifications
- [ ] Distribution confirmations

**Deliverables:**
- Advanced features working
- Reports generating
- Notifications sending

---

### **PHASE 6: Testing & Refinement** (Week 5-6)

#### 6.1 Backend Testing
- [ ] Unit tests for services
- [ ] Integration tests for controllers
- [ ] Test distribution logic edge cases
- [ ] Test carryover logic
- [ ] Load testing

#### 6.2 Frontend Testing
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] UI/UX testing

#### 6.3 Bug Fixes & Refinements
- [ ] Fix identified bugs
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Documentation

**Deliverables:**
- Test coverage > 80%
- All bugs fixed
- Performance optimized

---

## 🔧 Technical Implementation Details

### Key Business Rules:

1. **Annual Contribution Creation:**
   - When created, automatically generate 12 MonthlyContributions
   - monthlyAmount = annualAmount / 12
   - Set due dates for each month

2. **Payment Distribution:**
   - Payment starts as "undistributed"
   - Campaign distributes payment to MonthlyContributions
   - Can distribute to multiple months
   - Update MonthlyContribution.paidAmount
   - Update Payment.distributedAmount
   - When fully distributed, mark Payment as "distributed"

3. **Carryover Logic:**
   - At year-end, calculate unpaid amounts
   - Create new AnnualContribution for next year
   - Add carryover amount to new annual amount
   - Mark old contribution as "carried_over"

4. **Monthly Contribution Status:**
   - `pending` - Not yet due
   - `partial` - Partially paid
   - `paid` - Fully paid
   - `overdue` - Past due date and not paid

---

## 📁 File Structure

```
backend/src/modules/
├── annual-contributions/
│   ├── entities/
│   │   └── annual-contribution.entity.ts
│   ├── dto/
│   │   ├── create-annual-contribution.dto.ts
│   │   └── update-annual-contribution.dto.ts
│   ├── annual-contributions.service.ts
│   ├── annual-contributions.controller.ts
│   └── annual-contributions.module.ts
├── monthly-contributions/
│   ├── entities/
│   │   └── monthly-contribution.entity.ts
│   ├── dto/
│   │   └── update-monthly-contribution.dto.ts
│   ├── monthly-contributions.service.ts
│   ├── monthly-contributions.controller.ts
│   └── monthly-contributions.module.ts
├── payments/
│   ├── entities/
│   │   └── payment.entity.ts
│   ├── dto/
│   │   ├── create-payment.dto.ts
│   │   └── update-payment.dto.ts
│   ├── payments.service.ts
│   ├── payments.controller.ts
│   └── payments.module.ts
├── campaigns/
│   ├── entities/
│   │   ├── campaign.entity.ts
│   │   └── campaign-distribution.entity.ts
│   ├── dto/
│   │   ├── create-campaign.dto.ts
│   │   └── distribute-payment.dto.ts
│   ├── campaigns.service.ts
│   ├── campaigns.controller.ts
│   └── campaigns.module.ts
└── notices/
    ├── entities/
    │   └── notice.entity.ts
    ├── dto/
    │   ├── create-notice.dto.ts
    │   └── update-notice.dto.ts
    ├── notices.service.ts
    ├── notices.controller.ts
    └── notices.module.ts
```

---

## 🎯 Success Criteria

- [ ] Families can have annual contributions created
- [ ] Monthly contributions auto-generated from annual
- [ ] Payments can be recorded
- [ ] Payments can be distributed to monthly contributions via campaigns
- [ ] Debt can be carried over to new year
- [ ] Notices can be created and displayed
- [ ] All frontend pages connected to backend
- [ ] Distribution logic works correctly
- [ ] Reports can be generated
- [ ] System handles edge cases

---

## 📝 Next Steps

1. **Start with Phase 1** - Create all entities
2. **Then Phase 2** - Implement core services
3. **Then Phase 3** - Create API endpoints
4. **Then Phase 4** - Connect frontend
5. **Then Phase 5** - Add advanced features
6. **Finally Phase 6** - Test and refine

---

**Ready to start? Let's begin with Phase 1! 🚀**

