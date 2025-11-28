# Database Entity Relationship Diagram

## Visa Application System - Database Schema

### Tables Overview

#### Application Table
The main table storing visa application data with all form fields and metadata.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Application                             │
├─────────────────────────────────────────────────────────────────┤
│ PK  id: String (UUID) @id @default(uuid())                     │
│     status: ApplicationStatus @default(DRAFT)                   │
│                                                                 │
│ -- Service Type Information --                                  │
│     numberOfApplicants: Int?                                    │
│     visaType: String?                                          │
│     visaDuration: String?                                       │
│     purposeOfVisit: String?                                     │
│     entryDate: DateTime?                                        │
│     exitDate: DateTime?                                         │
│     processingTime: String?                                     │
│                                                                 │
│ -- Personal Information --                                      │
│     fullName: String?                                          │
│     dateOfBirth: DateTime?                                      │
│     nationality: String?                                        │
│     passportNumber: String?                                     │
│     passportIssueDate: DateTime?                               │
│     passportExpiryDate: DateTime?                              │
│     passportIssuingCountry: String?                            │
│                                                                 │
│ -- Contact Information --                                       │
│     contactFullName: String?                                   │
│     phoneNumber: String?                                        │
│     emailAddress: String?                                       │
│     currentAddress: String?                                     │
│     vietnamAddress: String?                                     │
│                                                                 │
│ -- Emergency Contact --                                         │
│     emergencyContactName: String?                              │
│     emergencyContactPhone: String?                             │
│     emergencyContactEmail: String?                             │
│     emergencyRelationship: String?                             │
│                                                                 │
│ -- File Uploads --                                              │
│     passportScanUrl: String?                                   │
│     portraitPhotoUrl: String?                                  │
│                                                                 │
│ -- Agreements --                                                │
│     informationConfirmation: Boolean @default(false)           │
│     termsAndConditions: Boolean @default(false)                │
│                                                                 │
│ -- Metadata --                                                  │
│     createdAt: DateTime @default(now())                        │
│     updatedAt: DateTime @updatedAt                             │
│     submittedAt: DateTime?                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### ApplicationStatus Enum
Tracks the status of visa applications through their lifecycle.

```
┌─────────────────────────────────────────┐
│            ApplicationStatus             │
├─────────────────────────────────────────┤
│  DRAFT          - Initial state         │
│  SUBMITTED      - Form completed        │
│  UNDER_REVIEW   - Being processed       │
│  APPROVED       - Application approved  │
│  REJECTED       - Application rejected  │
└─────────────────────────────────────────┘
```

#### Post Table (Existing)
Legacy table for blog posts or content management.

```
┌─────────────────────────────────────────┐
│                 Post                    │
├─────────────────────────────────────────┤
│ PK  id: Int @id @default(autoincrement()) │
│     name: String                        │
│     createdAt: DateTime @default(now()) │
│     updatedAt: DateTime @updatedAt      │
└─────────────────────────────────────────┘
```

### Indexes

#### Application Table Indexes
- `@@index([status])` - Fast queries by application status
- `@@index([createdAt])` - Chronological sorting and pagination
- `@@index([submittedAt])` - Query by submission date

#### Post Table Indexes
- `@@index([name])` - Search by post name

### Data Types and Constraints

#### Visa Types
- `"tourist"` - Tourism visa
- `"business"` - Business visa  
- `"transit"` - Transit visa
- `"diplomatic"` - Diplomatic visa

#### Visa Duration Options
- `"single"` - Single entry
- `"multiple-1month"` - Multiple entry, 1 month validity
- `"multiple-3months"` - Multiple entry, 3 months validity
- `"multiple-6months"` - Multiple entry, 6 months validity
- `"multiple-1year"` - Multiple entry, 1 year validity
- `"multiple-2years"` - Multiple entry, 2 years validity
- `"multiple-3years"` - Multiple entry, 3 years validity

#### Processing Time Options
- `"normal"` - Standard processing
- `"urgent"` - Expedited processing
- `"super-urgent"` - Super expedited processing
- `"express"` - Express processing
- `"emergency"` - Emergency processing
- `"weekend-holiday"` - Weekend/holiday processing

### Business Rules

#### Data Validation Rules
1. **Passport Validity**: `passportExpiryDate` must be at least 6 months from `entryDate`
2. **Age Restrictions**: Minors (calculated from `dateOfBirth`) cannot apply alone
3. **Date Consistency**: `exitDate` must be after `entryDate`
4. **File Requirements**: Both `passportScanUrl` and `portraitPhotoUrl` required for submission
5. **Agreements**: Both `informationConfirmation` and `termsAndConditions` must be true for submission

#### Status Flow
```
DRAFT → SUBMITTED → UNDER_REVIEW → (APPROVED | REJECTED)
```

#### Draft Persistence
- Applications can be saved in DRAFT status at any time
- All fields are optional until submission (`status` = SUBMITTED)
- Auto-save occurs during step navigation

### File Storage Strategy

#### Development Environment
- Files stored locally in `public/uploads/` directory
- URLs format: `/uploads/{applicationId}/{filename}`

#### Production Environment (Vercel)
- Files stored in Vercel Blob storage
- URLs provided by Vercel Blob service
- Automatic CDN delivery

### Security Considerations

#### File Upload Security
- Accepted formats: .jpg, .jpeg, .png only
- Maximum file size: 5MB per file
- Unique filename generation to prevent conflicts
- Secure, non-executable storage directories

#### Data Protection
- All fields except `id`, `status`, `createdAt`, `updatedAt` are nullable for draft persistence
- No sensitive data stored in client-side storage
- Server-side validation for all inputs
- Proper sanitization of user inputs

### Future Enhancements

#### Potential Schema Extensions
1. **User Authentication**: Add `userId` foreign key when auth is implemented
2. **Document Management**: Separate table for multiple document types per application
3. **Payment Processing**: Payment tracking and invoice management
4. **Audit Trail**: Track all changes to applications with timestamps
5. **Notifications**: Email and SMS notification preferences and history

#### Scalability Considerations
- Application table designed for horizontal scaling
- Indexes optimized for common query patterns
- File storage abstracted for easy migration between providers
- Status-based partitioning potential for large datasets