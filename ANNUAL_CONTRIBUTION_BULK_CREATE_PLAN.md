# Annual Contribution Bulk Create Feature - Implementation Plan

## Overview
Add a button to the annual contributions page that creates annual contribution records for all families for a selected year, skipping families that already have records for that year.

## Requirements
1. **New Button**: Add a "Create for All Families" button on the annual contributions page
2. **User Input**: Prompt user for:
   - Year (default: current year)
   - Annual Amount (required)
3. **Logic**:
   - Fetch all families
   - Fetch all annual contributions for the selected year
   - Identify families without annual contributions for that year
   - Create annual contribution records for those families only
   - Skip families that already have records
4. **Post-Creation**: After bulk creation, refresh the page to show new records (normal process)

## Implementation Steps

### Step 1: Backend - Create Bulk Create Endpoint
**File**: `backend/src/modules/annual-contributions/annual-contributions.service.ts`
- Add method: `createBulkForAllFamilies(year: number, annualAmount: number)`
- Logic:
  1. Get all families
  2. Get all annual contributions for the year
  3. Filter families that don't have annual contributions for that year
  4. Create annual contributions for those families (reuse existing `create` logic)
  5. Return summary: { created: number, skipped: number, families: [...] }

**File**: `backend/src/modules/annual-contributions/annual-contributions.controller.ts`
- Add endpoint: `POST /annual-contributions/bulk-create`
- Accept: `{ year: number, annualAmount: number }`
- Return summary of created/skipped records

**File**: `backend/src/modules/annual-contributions/dto/create-annual-contribution.dto.ts`
- Create new DTO: `BulkCreateAnnualContributionDto` (optional, or reuse existing)

### Step 2: Frontend - Add API Client Method
**File**: `welfare-frontend/lib/api.js`
- Add method to `annualContributions` object:
  ```javascript
  bulkCreate: (data) => api.post('/annual-contributions/bulk-create', data)
  ```

### Step 3: Frontend - Add UI Components
**File**: `welfare-frontend/app/(dashboard)/admin/annual-contributions/page.jsx`
- Add new button: "Create for All Families" next to existing buttons
- Add modal for bulk create:
  - Year input (default: current year)
  - Annual Amount input (required)
  - Show confirmation with preview of how many families will be affected
- Add handler function:
  - Fetch families and existing contributions
  - Calculate which families need records
  - Call bulk create API
  - Show success message with summary
  - Refresh data (call `loadData()`)

## Technical Details

### Backend Service Method Signature
```typescript
async createBulkForAllFamilies(
  year: number,
  annualAmount: number,
): Promise<{
  created: number;
  skipped: number;
  createdFamilies: number[];
  skippedFamilies: number[];
}>
```

### Frontend Modal State
```javascript
const [showBulkModal, setShowBulkModal] = useState(false);
const [bulkFormData, setBulkFormData] = useState({
  year: new Date().getFullYear(),
  annualAmount: "",
});
```

### Error Handling
- Handle cases where no families exist
- Handle API errors gracefully
- Show appropriate toast messages

## Testing Considerations
1. Test with families that already have contributions (should skip)
2. Test with families without contributions (should create)
3. Test with empty family list
4. Test with invalid annual amount
5. Test with different years

## Files to Modify
1. `backend/src/modules/annual-contributions/annual-contributions.service.ts`
2. `backend/src/modules/annual-contributions/annual-contributions.controller.ts`
3. `welfare-frontend/lib/api.js`
4. `welfare-frontend/app/(dashboard)/admin/annual-contributions/page.jsx`

## Notes
- The existing `create` method already handles:
  - Checking for duplicates (throws error if exists)
  - Creating monthly contributions automatically
  - Setting status to ACTIVE
- We'll need to inject FamilyService or FamilyRepository to get all families
- The bulk create should be transactional (all or nothing, or handle partial failures gracefully)

