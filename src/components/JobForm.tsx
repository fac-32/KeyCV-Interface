import { useState } from "react";
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

// Define the shape of the form values
type FormValues = {
  "job-description": string;
  cv: FileList | null;
};

export default function JobForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      "job-description": "",
      cv: null,
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const API_ENDPOINT = buildApiUrl("api/ai/analyze-resume");

  async function onSubmit(values: FormValues) {
    setResponseMessage(null);

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
      if (!res.ok) {
        throw new Error(`Submission failed with status ${res.status}`);
      }
      const data = await res.json().catch(() => null);
      setResponseMessage(data?.message || "Submitted successfully.");
      form.reset();
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
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
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
    </div>
  );
}
