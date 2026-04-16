# AI-Powered Compliance Analysis System

A modern, full-stack digital compliance auditor built to analyze business documents (Invoices and Bills of Lading), detect discrepancies, and provide actionable AI-reasoned solutions.

## ⚠️ Problem Statement
Global logistics and modern accounting rely heavily on precise documentation. However, the verification process between complex documents like GST Invoices and customs Bills of Lading is predominantly manual. Discrepancies such as mismatched item quantities, missing HS codes, malformed Tax IDs (GSTIN), or simple mathematical errors commonly slip past human review. These mistakes lead to severe consequences:
- Rejection of tax filings or GST claims.
- Lengthy customs delays and port holding fees.
- Suspicions of fraudulent activity.

## 💡 The Solution
This application acts as a tireless **Digital Compliance Auditor**. Using advanced AI extraction alongside strict, deterministic business rule validation, the system guarantees documents are compliant before submission.
1. **Intelligent Extraction**: Uses OpenAI's Vision capabilities to extract perfectly structured payload data directly from raw images/scans of Invoices and Bills of Lading.
2. **Rule-Based Validation**: Applies strict mathematics and logic checks (e.g., Subtotal + Tax = Grand Total). 
3. **Cross-Document Check**: Validates that quantities and parties listed on the commercial Invoice identically match the logistics Bill of Lading.
4. **AI Reasoning**: For any failed validation, an AI agent highlights the exact problem, explains the real-world consequence (e.g. "Tax Rejection"), and gives the user an actionable fix.

## 🛠 Tech Stack
- **Frontend**: React, Next.js (App Router), Tailwind CSS, Lucide React (Icons)
- **Backend / Routing**: Next.js Server API Routes
- **Data Extractor & Reasoning Layer**: OpenAI SDK (`gpt-4o`, `gpt-4o-mini`), `pdf-parse`
- **Language**: TypeScript throughout the entire stack

---

## 🏗 System Architecture (MVC Pattern)
Even though Next.js utilizes a modern App Router ecosystem, the application conforms cleanly to an MVC-like architecture pattern:

- **Model (Data Structures)**: Handled in `src/types/index.ts`. Defines strictly typed TypeScript interfaces for the application context (`Invoice`, `BillOfLading`, `ComplianceReport`). By establishing the schema, the models dictate the contract our AI Extractors must adhere to.
- **View (User Interface)**: Governed by `src/app/page.tsx` and the `src/components/` directory (`UploadZone`, `DashboardScore`, `IssuesList`). These React Client Components purely handle state bindings (uploading state, parsing results) and use Tailwind CSS for the aesthetic dashboard representation.
- **Controller (Routing & Business Logic)**: Handled primarily by the Next.js API Route handler at `src/app/api/analyze/route.ts` which receives upload payloads. Rather than dumping all logic in the controller, it delegates tasks intelligently to specialized Service classes:
   - `aiExtractionService.ts`: Extracts data payload.
   - `validationEngine.ts`: Processes rule-based algorithms.
   - `aiReasoningService.ts`: Final AI enrichment for errors.

### ✨ Maintainability and Design Patterns
- **Singleton Pattern**: The OpenAI client connection is instantiated strictly following the Singleton structural pattern (`src/lib/openai.ts`). This ensures memory stability, prevents API connection leaks, and ensures the DB/API instance is shared.
- **Centralized Error Logging**: Advanced diagnostic logging is cleanly decoupled through a global logger (`src/lib/logger.ts`), replacing standard console dumps for clean maintainability.
- **REST API Principles**: The primary controller functions statelessly using correctly verified payload parsing, adhering to standard REST operational structures.

---

## 📂 Project Structure

```text
prototype/
├── public/                       # Static web assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts      # (CONTROLLER) Document ingestion & routing logic
│   │   ├── globals.css           # Global Tailwind directives
│   │   ├── layout.tsx            # Next.js App layout
│   │   └── page.tsx              # (VIEW) Main dashboard interface
│   ├── components/               # (VIEW) Reusable UI Components
│   │   ├── DashboardScore.tsx    # Visual score dial
│   │   ├── IssuesList.tsx        # Accordion containing AI fixes
│   │   └── UploadZone.tsx        # Drag & Drop file handler
│   ├── services/                 # (BUSINESS LOGIC)
│   │   ├── aiExtractionService.ts# OpenAI JSON Extractor
│   │   ├── aiReasoningService.ts # Contextual Explanations
│   │   └── validationEngine.ts   # Deterministic Math & Compliance rules
│   └── types/
│       └── index.ts              # (MODEL) Typescript interfaces & definitions
├── .env                          # Local secrets (OPENAI_API_KEY)
├── tailwind.config.ts            # CSS styling configuration
├── tsconfig.json                 # Typescript rules
└── package.json                  # Dependencies
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- An active OpenAI API Key.

### Development Steps
1. **Clone/Navigate to the directory**:
   ```bash
   cd prototype
   ```
2. **Install all dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Be sure the `.env` file exists at the root of the project with your API key:
   ```env
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open the Application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📸 Screenshots

*(Replace these blocks with actual screenshots once you use the tool)*

**Dashboard Upload Screen**
> *Screenshot of the dual drag-and-drop zones showing a premium dark-themed layout.*
`![Upload Dashboard](./path-to-upload.png)`

**Validation and Reasoning Engine**
> *Screenshot showcasing the interactive dial highlighting the Compliance Score alongside the color-coded issues list detailing exactly what went wrong and how to fix it.*
`![Compliance Results](./path-to-results.png)`
