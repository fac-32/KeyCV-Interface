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
      <Accordion type="single" className="w-full" collapsible>
        {allFeedback.map((item, index) => (
          <AccordionItem value={`feedback-${index}`}>
            <AccordionTrigger>{item.job_name}</AccordionTrigger>
            <AccordionContent>
              <ResultCard
                jobDescription={item.job_description}
                feedback={item.gen_feedback}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* {allFeedback.length > 0 && (
        <ul>
          {allFeedback.map((item, index) => (
            <li key={index}>{item.job_name}
              <ResultCard
                jobDescription={item.job_description}
                feedback={item.gen_feedback}
              />
            </li>
          ))}

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ul>
      )} */}
    </>
  );
}
