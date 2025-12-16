import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
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
import supabase from "@/lib/supabaseClient";
// import { analyzeResume } from "@/services/api";
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

  const [analysis, setAnalysis] = useState<{
    resume: string;
    jobDescription: string;
    feedback: string;
    cvName: string;
  } | null>(null);

  const [applicationName, setApplicationName] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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
        matchScore: Number(data?.feedback.matchScore) || 0,
        presentKeywords: Array.isArray(data?.feedback.presentKeywords)
          ? data.feedback.presentKeywords
          : [],
        missingKeywords: Array.isArray(data?.feedback.missingKeywords)
          ? data.feedback.missingKeywords
          : [],
        recommendations: Array.isArray(data?.feedback.recommendations)
          ? data.feedback.recommendations
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

      // store response for saving to supabase
      setAnalysis({
        resume: data.resumeText,
        jobDescription: data.jobDescription,
        feedback: data.feedback,
        cvName: data.cvName,
      });

      // check if user is signed in to display save form if they are
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsSignedIn(false);
      } else {
        setIsSignedIn(true);
      }

      setResponseMessage(data?.message || "Submitted successfully.");
      // optionally reset the form
      form.reset();
    } catch (error) {
      setResponseMessage(
        error instanceof Error ? error.message : "Submission failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const saveSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const { error } = await supabase.auth.signOut()//////////////////////////

    // fetch signed in users
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return setSaveMessage("Please sign in to save feedback");
    }

    // check if there is something to save first
    if (!analysis?.resume || !analysis.jobDescription || !analysis.feedback || !analysis.cvName) {
      return setSaveMessage(
        "Unable to save as the feedback, job description, or CV is missing",
      );
    }

    // fetch cv_id corresponding to cvName
    const { data: fetchCV, error: fetchCVError } = await supabase
      .from("cvs")
      .select("cv_id")
      .eq("name", analysis.cvName);
    let FK_CV_ID: string;

    if (fetchCVError) {
      return setSaveMessage(
        "There has been an error fetching your previously saved CV",
      );
    }

    if (fetchCV.length !== 0) {
      FK_CV_ID = fetchCV[0].cv_id;
    } else {
      // if it does not exist, insert a new cv with cvName and resume in storage
      const path = `${user.id}/${analysis.cvName}.txt`;
      const blob = new Blob([analysis.resume], { type: "text/plain" });
      const { data: cvStorageInsert, error: cvStorageError } =
        await supabase.storage.from("cv_files").upload(path, blob, {
          contentType: "text/plain",
        });

      if (cvStorageError) {
        return setSaveMessage("Upload error -  make sure you are signed in");
      }

      // link storage file to public cv relation
      const { error: insertCVError } = await supabase.from("cvs").insert({
        user_id: user.id,
        name: analysis.cvName,
        cv_storage_id: cvStorageInsert?.id,
      });
      if (insertCVError) {
        return setSaveMessage("There has been an error while saving your CV");
      }

      // get the cv_id of the newly created/inserted cv
      const { data: newFetchCV, error: newFetchCVError } = await supabase
        .from("cvs")
        .select("cv_id")
        .eq("name", analysis.cvName);
      if (newFetchCVError) {
        return setSaveMessage("There has been an error while saving your CV");
      }

      FK_CV_ID = newFetchCV[0].cv_id;
    }

    // then insert a new job/feedback for the user
    const { error: insertJobError } = await supabase.from("jobs").insert({
      user_id: user.id,
      job_description: analysis.jobDescription,
      gen_feedback: analysis.feedback,
      cv_id: FK_CV_ID,
      name: applicationName,
    });
    if (insertJobError) {
      return setSaveMessage(
        "There has been an error while saving your feedbck",
      );
    }

    setSaveMessage("CV saved successfully");
  };

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
                <div>{responseMessage}</div>
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

      {isSignedIn && (
        <form className="cv-save" onSubmit={saveSubmitHandler}>
          <div className="cv-save__field">
            {/* <Label htmlFor="application-name">Application name</Label> please style my label*/} 
            <Input
              type="text"
              id="application-name"
              value={applicationName ?? ""}
              onChange={(event) => setApplicationName(event.target.value)}
              placeholder="Application name"
              required
            />
          </div>
          <div className="cv-save__actions">
            <Button type="submit">Save</Button>
          </div>
          <div>
            {saveMessage && <p className="cv-save__message">{saveMessage}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
