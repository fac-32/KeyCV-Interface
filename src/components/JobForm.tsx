import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function JobForm() {
  const form = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Replace with your real API endpoint
  // const API_ENDPOINT = "https://keycv.onrender.com/submit-info";
  const API_ENDPOINT = "/analyze-resume";

  // eslint-disable-next-line
  async function onSubmit(values: any) {
    setResponseMessage(null);

    const formData = new FormData();
    // job-description uses the existing form field name
    formData.append("job_description", values["job-description"] || "");

    // file input registered as "cv"
    const fileList = form.getValues("cv") as FileList | undefined;
    const file = fileList?.[0] ?? (values.cv && values.cv[0]);

    if (!file) {
      setResponseMessage("Please attach a CV file.");
      return;
    }

    formData.append("cv_file", file);
    // console.log(formData);

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
      // console.log(data);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div style={{ marginTop: 12 }}>
          <FormLabel>Attach CV</FormLabel>
          <Input
            type="file"
            accept=".doc,.docx,.pdf"
            {...form.register("cv")}
          />
        </div>

        <FormField
          control={form.control}
          name="job-description"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ marginTop: 12 }}>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please paste job description here"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        {responseMessage && (
          <div style={{ marginTop: 12 }}>
            <p>{responseMessage}</p>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
