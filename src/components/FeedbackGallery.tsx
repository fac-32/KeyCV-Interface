import supabase from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import ResultCard from "./ResultCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FeedbackElement = {
  job_description: string | null;
  job_name: string | null;
  gen_feedback: {
    matchScore: number;
    presentKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  } | null;
};

export default function Feedback() {
  const [message, setMessage] = useState<string | null>(null);
  const [allFeedback, setAllFeedback] = useState<FeedbackElement[]>([]);

  useEffect(() => {
    async function fetchFeedback() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return setMessage("You must log in to view saved feedback");
      }

      const { data: feedback, error: feedbackError } = await supabase
        .from("jobs")
        .select("job_description, gen_feedback, name");
      if (feedbackError) {
        return setMessage(
          "There has been an error while retrieving feedback records",
        );
      }

      const parsed = feedback.map((item) => ({
        job_description: item.job_description,
        job_name: item.name,
        gen_feedback: JSON.parse(item.gen_feedback ?? ""),
      }));
      setAllFeedback(parsed);
    }
    fetchFeedback();
  }, []);

  return (
    <>
      {message && <p>{message}</p>}
      {allFeedback.length > 0 ? (
        <Accordion type="single" className="w-full" collapsible>
          {allFeedback.map((item, index) => (
            <AccordionItem
              key={`feedback-${index}`}
              value={`feedback-${index}`}
            >
              <AccordionTrigger>
                {item.job_name} | {item.gen_feedback?.matchScore}
              </AccordionTrigger>
              <AccordionContent>
                <ResultCard
                  jobDescription={item.job_description}
                  feedback={item.gen_feedback}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p>You don't have any saved feedback yet...</p>
      )}
    </>
  );
}
