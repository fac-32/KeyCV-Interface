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
import supabase from "@/lib/supabaseClient";
// import { analyzeResume } from "@/services/api";

export default function JobForm() {
  const form = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<{
    resume: string;
    jobDescription: string;
    feedback: string;
    cvName?: string
  } | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const API_ENDPOINT = buildApiUrl("api/ai/analyze-resume");

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
      
      // store response
      setAnalysis({
        resume: data.resumeText,
        jobDescription: data.jobDescription,
        feedback: data.feedback,
      });

      // TO DO: display response ///////////////////////////////////////////////

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
    // const { error } = await supabase.auth.signOut() ///////////////////////// debugging command

    // fetch signed in users
    const { data: { user } } = await supabase.auth.getUser();
    if ( !user ) {
      return setSaveMessage("Please sign in to save feedback");
    }

    // check if there is something to save first
    if ( !analysis?.resume || !analysis.jobDescription || !analysis.feedback ) {
      return setSaveMessage("Unable to save as the feedback, job description, or CV is missing");
    }

    // TO DO: fetch cv_id corresponding to cvName
    // const { data: cvID, error: fetchCVError } = await supabase.from("cvs").select("cv_id").eq("user_id", user.id);

    // const cvIDresponse = await supabase.from("cvs").select("cv_id");
    // console.log(cvIDresponse);

    // if it does not exist, insert a new cv with cvName and resume in storage
    const path = `${user.id}/${analysis.cvName}.txt`;
    const blob = new Blob([analysis.resume], { type: "text/plain" });
    const { data: cvStorageInsert, error: cvStorageError } = await supabase.storage.from("cv_files").upload(path, blob, {
      contentType: "text/plain",
    });

    if ( cvStorageError?.name === "StorageApiError" ) {
      setSaveMessage("Upload error -  make sure you are signed in");
    }

    // link storage file to public cv relation
    const { error: insertCVError } = await supabase.from("cvs").insert({ user_id: user.id, name: cvName, cv_storage_id: cvStorageInsert?.id });
    if ( insertCVError ) {
      setSaveMessage("There has been an error while saving your cv");
    } else {
      setSaveMessage("CV saved successfully");
    }


    // then insert a new job for the user

    // TO DO: build two separate API endpoints
    // try {
    //   const res = await fetch(buildApiUrl("api/supabase/save"), {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json"},
    //     body: JSON.stringify({
    //       resume: analysis?.resume,
    //       jobDescription: analysis?.jobDescription,
    //       feedback: analysis?.feedback,
    //       cvName: "placeholder name",
    //     }),
    //   });

    //   const data = await res.json();
    //   console.log(`successful route to save: ${data}`);
    // } catch ( error ) {
    //   console.log(`error when attempting saving: ${error}`)
    // }
    
  }

  return (
    <>
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
                    required
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

      <form onSubmit={saveSubmitHandler}>
        <Input type="text" id="cv-name" value={cvName ?? ""} onChange={(event) => setCvName(event.target.value)} placeholder="cv-fac-dec-2025" required />
        <Button type="submit">Save</Button>
        {saveMessage && (
          <div style={{ marginTop: 12 }}>
            <p>{saveMessage}</p>
          </div>
        )}
        <Button type="button" onClick={() => {
          setAnalysis({
        resume: "cool cv",
        jobDescription: "my job now",
        feedback: "your cv looks great youll definately land this",
        cvName: "best-cv",
    }); 
    setCvName(analysis?.cvName ?? "");
        }}>test button loads details</Button>
      </form>
    </>
  );
}
