# Tasks

- **Environment Setup:**
  - [ ] Create `.env.local` in the **KeyCV-Interface** root.
  - [ ] Add `VITE_API_BASE_URL=http://localhost:3000/api/ai` to `.env.local`.
  - [ ] Ensure the backend server from **KeyCV-Infrastructure** is running locally on port 3000.

- [ ] **API Service Layer:**
  - [ ] Create `KeyCV-Interface/src/services/api.ts`.
  - [ ] Define interfaces for all request and response types based on **KeyCV-Infrastructure/backend/src/types/ai.types.ts**.
  - [ ] Implement a generic `post` function to handle API calls.
  - [ ] Implement `analyzeResume` function in `api.ts`.
  - [ ] Implement `rewriteBulletPoint` function in `api.ts`.
  - [ ] Implement `generateCoverLetter` function in `api.ts`.
  - [ ] Implement `generateInterviewQuestions` function in `api.ts`.

- [ ] **UI Components & Features:**
  - [ ] **Feature 1: Resume Analysis**
    - [ ] Create `src/components/features/ResumeAnalyzer.tsx`.
    - [ ] Add a form with two `<Textarea>` components (resume, job description).
    - [ ] Add a `<Button>` to submit.
    - [ ] Display `matchScore`, `presentKeywords`, `missingKeywords`, and `recommendations` in a `<Card>`.
    - [ ] Implement loading state indicator.

  - [ ] **Feature 2: Bullet Point Rewriter**
    - [ ] Create `src/components/features/BulletPointRewriter.tsx`.
    - [ ] Add a form with an `<Input>` (bullet point) and a `<Textarea>` (job description).
    - [ ] Add a `<Button>` to submit.
    - [ ] Display `originalBulletPoint` and `rewrittenBulletPoint` in a `<Card>`.

  - [ ] **Feature 3: Cover Letter Generator**
    - [ ] Create `src/components/features/CoverLetterGenerator.tsx`.
    - [ ] Add a form with `<Textarea>` (resume, job description) and `<Input>` fields (company name, job title).
    - [ ] Add a `<Button>` to generate.
    - [ ] Display the generated `coverLetter` in a `<Card>`.

  - [ ] **Feature 4: Interview Question Generator**
    - [ ] Create `src/components/features/InterviewPrep.tsx`.
    - [ ] Add a form with a `<Textarea>` (job description) and an `<Input>` (job title).
    - [ ] Add a `<Button>` to generate.
    - [ ] Display `technicalQuestions` and `behavioralQuestions` in lists within a `<Card>`.

  - [ ] **Application Structure and Routing:**
    - [ ] Import the four feature components into `KeyCV-Interface/src/App.tsx`.
    - [ ] Add simple navigation (buttons/tabs) in `App.tsx` to switch between features.
    - [ ] Implement state management in `App.tsx` to conditionally render the active feature component.

  - [ ] **Styling and User Experience:**
    - [ ] Apply **tailwindcss** and **shadcn/ui** for all UI components.
    - [ ] Add loading spinners for API calls.
    - [ ] Implement error message display for API failures.
