# KeyCV-Interface: Next Steps for Backend Integration

This document outlines the steps to connect the **KeyCV-Interface** (React frontend) with the already deployed **KeyCV-Infrastructure** (Node.js backend). The goal is to build a user interface that consumes the AI-powered API endpoints provided by the backend.

## 1. Environment Setup

To ensure the frontend can communicate with the backend, we need to configure the API's base URL.

1.Create a new file named `.env.local` in the root of the `KeyCV-Interface` project.
2.Add the following environment variable to the `.env.local` file. This points to the locally running backend service.

        VITE_API_BASE_URL=http://localhost:3000/api/ai

3.Make sure the backend server from `KeyCV-Infrastructure` is running locally on port 3000.

## 2. API Service Layer

To keep our code clean and maintainable, we will create a dedicated service layer to handle all API communication.

1.Create a new file at `KeyCV-Interface/src/services/api.ts`.
2.This file will contain functions for making `fetch` requests to each of the backend's endpoints. These functions will take the required data, construct the request, and return the JSON response.

    // src/services/api.ts
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    // Define interfaces for request and response types
    based on the backend's ai.types.ts
    // For example:
    export interface AnalyzeResumeRequest {
        resumeText: string;
        jobDescription: string;
    }

    export interface AnalyzeResumeResponse {
        matchScore: number;
        presentKeywords: string[];
        missingKeywords: string[];
        recommendations: string[];
    }

    // ... other interfaces for rewriteBulletPoint,
    generateCoverLetter, etc.

    async function post<T, R>(endpoint: string, data: T):
    Promise<R> {
        const response = await
    fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An API
    error occurred');
        }

        return response.json();
    }

    export const analyzeResume = (data:
    AnalyzeResumeRequest) => {
      r eturn post<AnalyzeResumeRequest,
    AnalyzeResumeResponse>('/analyze-resume', data);
    }

## 3. UI Components & Features

We will create a component for each of the four features provided by the backend API. We should leverage `shadcn/ui` components (**Button**, **Input**, **Textarea**, **Card**) as the project is already configured for it.

### Feature 1: Resume Analysis

- **Component:** `src/components/features/ResumeAnalyzer.tsx`
- **UI:**
  - A form with two `<Textarea>` components: one for the resume text and one for the job description.
  - A `<Button>` to submit the form.
  - A results section to display the `matchScore`, `presentKeywords`, `missingKeywords`, and `recommendations` in a `<Card>` component.
  - A loading state indicator while the API call is in progress.

### Feature 2: Bullet Point Rewriter

- **Component:** `src/components/features/BulletPointRewriter.tsx`
- **UI:**
  - A form with an `<Input>` for the bullet point and a `<Textarea>` for the job description.
  - A `<Button>` to submit.
  - A `<Card>` to display the `originalBulletPoint` and the `rewrittenBulletPoint`.

### Feature 3: Cover Letter Generator

- **Component:** `src/components/features/CoverLetterGenerator.tsx`
- **UI:**
  - A form with `<Textarea>` for the resume and job description, and `<Input>` fields for company name, and job title.
  - A `<Button>` to generate the cover letter.
  - A `<Card>` to display the generated `coverLetter`.

### Feature 4: Interview Question Generator

- **Component:** `src/components/features/InterviewPrep.tsx`
- **UI:**
  - A form with a `<Textarea>` for the job description and an `<Input>` for the job title.
  - A `<Button>` to generate questions.
  - Two lists within a `<Card>` to display the `technicalQuestions` and `behavioralQuestions`.

## 4. Application Structure and Routing

To organize the UI, we'll update the main `App.tsx` to allow navigation between the different features.

1. **Component Imports:** Import the four feature components into `App.tsx`.
2. **Navigation:** Add a simple navigation bar or a set of tabs at the top of the page. Each tab/link will render the corresponding feature component.
3. **State Management:** Use a state variable (e.g., `useState`) to manage which feature component is currently active and visible.

typescript
import { useState } from 'react';
import { ResumeAnalyzer } from './components/features/ResumeAnalyzer';
function App() {
const [activeFeature, setActiveFeature] = useState('resume-analyzer');
return (

<div>
<nav>
<button onClick={() => setActiveFeature('resume-analyzer')}>Resume Analyzer</button>
{/_...other buttons_/}
</nav>
{activeFeature === 'resume-analyzer' && <ResumeAnalyzer />}
{/_...other conditional renders_/}
</div>
);
}

## 5. Development Roadmap

The following is a suggested order of implementation:

1. **Setup:** Create the `.env.local` file and the `api.ts` service layer with all the endpoint functions and type definitions.
2. **Implement Resume Analyzer:** Build the `ResumeAnalyzer.tsx` component. This is the core feature and a good starting point. Ensure it correctly calls the API and displays the results.
3. **Implement Remaining Features:** Implement the other three feature components one by one.
   - `BulletPointRewriter.tsx`
   - `CoverLetterGenerator.tsx`
   - `InterviewPrep.tsx`
4. **Update App.tsx:** Refactor `App.tsx` to include the navigation and conditionally render the feature components.
5. **Styling:** Use **tailwindcss** and **shadcn/ui** to create a clean and user-friendly interface. Add loading spinners and error messages for a better user experience.
