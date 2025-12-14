import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import "./JobForm.css";
import "./loader.css";

// Define the shape of the form values
type FormValues = {
  "job-description": string;
  cv: FileList | null;
};

type AnalyzeResumeResponse = {
  matchScore: number;
  presentKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
};

export default function JobForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      "job-description": "",
      cv: null,
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeResponse | null>(null);
  const [submittedJobDescription, setSubmittedJobDescription] = useState<
    string | null
  >(null);

  const API_ENDPOINT = buildApiUrl("api/ai/analyze-resume");

  const resetFormState = () => {
    form.reset({
      "job-description": "",
      cv: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: FormValues) {
    setResponseMessage(null);
    setAnalysisResult(null);
    setSubmittedJobDescription(null);

    const formData = new FormData();
    formData.append("job_description", values["job-description"] || "");

    const file = values.cv?.[0];

    if (!file) {
      setResponseMessage("Please attach a CV file.");
      return;
    }

    formData.append("cv_file", file);

    try {
      setIsUploading(true);
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const data =
        typeof res.json === "function"
          ? await res.json().catch(() => null)
          : null;

      if (!res.ok) {
        const message =
          (data && typeof data.error === "string" && data.error) ||
          `Submission failed with status ${res.status}`;
        throw new Error(message);
      }

      const parsed: AnalyzeResumeResponse = {
        matchScore: Number(data?.matchScore) || 0,
        presentKeywords: Array.isArray(data?.presentKeywords)
          ? data.presentKeywords
          : [],
        missingKeywords: Array.isArray(data?.missingKeywords)
          ? data.missingKeywords
          : [],
        recommendations: Array.isArray(data?.recommendations)
          ? data.recommendations
          : [],
      };

      const successMessage =
        typeof data?.message === "string" && data.message.trim().length
          ? data.message
          : "";

      setResponseMessage(successMessage);
      setSubmittedJobDescription(values["job-description"] || "");
      setAnalysisResult(parsed);
      resetFormState();
    } catch (error) {
      setResponseMessage(
        error instanceof Error ? error.message : "Submission failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="job-form__shell">
      {isUploading && (
        <div className="loading-overlay" aria-live="polite" aria-busy="true">
          <div className="loader loader--large" role="status" />
          <p className="loading-overlay__text">AI is analyzing your resume…</p>
        </div>
      )}
      <div className="job-form__card">
        <Form {...form}>
          <form
            className="job-form"
            onSubmit={form.handleSubmit(onSubmit)}
            aria-label="Job Application Form"
          >
            <FormField
              control={form.control}
              name="cv"
              render={({ field }) => (
                <FormItem className="job-form__field">
                  <FormLabel>Attach CV</FormLabel>
                  <FormControl>
                    <Input
                      ref={(element) => {
                        field.ref(element);
                        fileInputRef.current = element;
                      }}
                      name={field.name}
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const files = e.target.files;
                        const nextValue =
                          files && files.length > 0 ? files : null;
                        field.onChange(nextValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job-description"
              render={({ field }) => (
                <FormItem className="job-form__field">
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please paste job description here"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {responseMessage && (
              <div className="job-form__message">
                <p>{responseMessage}</p>
              </div>
            )}

            <div className="job-form__actions">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {analysisResult && (
        <div className="result-summary" aria-live="polite">
          <div className="result-summary__label">Match score</div>
          <div className="result-summary__value">
            {Math.round(analysisResult.matchScore)}%
          </div>
        </div>
      )}
      {analysisResult && (
        <div className="result-grid">
          <div className="result-card">
            <section
              className="result-jobdesc"
              aria-label="Submitted job details"
            >
              <header className="result-section__header">
                <p className="result-section__label">Job description</p>
              </header>
              <div className="result-jobdesc__body">
                <div className="result-jobdesc__text">
                  {submittedJobDescription?.trim() || "—"}
                </div>
              </div>
            </section>
          </div>

          <div className="result-card">
            <section
              className="result-analysis"
              aria-label="AI analysis result"
            >
              <div className="result-analysis__header">
                <p className="result-section__label">AI insights</p>
              </div>

              <div className="result-analysis__grid">
                <div className="result-panel">
                  <h4>Keywords found in resume</h4>
                  {analysisResult.presentKeywords.length ? (
                    <ul>
                      {analysisResult.presentKeywords.map((item, idx) => (
                        <li key={`${item}-${idx}`}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="result-muted">No matches found.</p>
                  )}
                </div>

                <div className="result-panel">
                  <h4>Missing keywords</h4>
                  {analysisResult.missingKeywords.length ? (
                    <ul>
                      {analysisResult.missingKeywords.map((item, idx) => (
                        <li key={`${item}-${idx}`}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="result-muted">
                      No missing keywords returned by backend.
                    </p>
                  )}
                </div>

                <div className="result-panel result-panel--full">
                  <h4>Recommendations</h4>
                  {analysisResult.recommendations.length ? (
                    <ul>
                      {analysisResult.recommendations.map((item, idx) => (
                        <li key={`${item}-${idx}`}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="result-muted">No recommendations received.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
