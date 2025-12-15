/* eslint-disable linebreak-style */

import supabase from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

type FeedbackElement = {
    job_description: string | null;
    gen_feedback: {
        matchScore: number;
        presentKeywords: string[];
        missingKeywords: string[];
        recommendations: string[];
    } | null;
}

export default function Feedback() {
    const [message, setMessage] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackElement[]>([]);

    useEffect(() => {
        async function fetchFeedback() {
            const { data: { user }, } = await supabase.auth.getUser();
            if ( !user ) {
                return setMessage("You must log in to view saved feedback");
            }

            const { data: allFeedback, error: feedbackError } = await supabase.from("jobs").select("job_description, gen_feedback");
            if ( feedbackError ) {
                return setMessage("There has been an error while retrieving feedback records");
            }

            const parsed = allFeedback.map(feedback => ({job_description: feedback.job_description, gen_feedback: JSON.parse(feedback.gen_feedback ?? ""),}));
            setFeedback(parsed);

            console.log(feedback);

            // let feed = JSON.parse(feedback[1].gen_feedback);
            // console.log(feed);
            // console.log(feedback[1].job_description);
        }
        fetchFeedback();
    }, []);
    

    return (
        <></>
    );
}
