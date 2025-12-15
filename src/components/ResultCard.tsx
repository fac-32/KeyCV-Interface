type generatedFeedback = {
    matchScore: number;
    presentKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
}

type FeedbackElement = {
    jobDescription: string | null;
    feedback: generatedFeedback | null;
}

export default function ResultCard ({ jobDescription, feedback }: FeedbackElement) {

    return (
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
                  {jobDescription?.trim() || "—"}
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
                  {feedback?.presentKeywords.length ? (
                    <ul>
                      {feedback.presentKeywords.map((item, idx) => (
                        <li key={`${item}-${idx}`}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="result-muted">No matches found.</p>
                  )}
                </div>

                <div className="result-panel">
                  <h4>Missing keywords</h4>
                  {feedback?.missingKeywords.length ? (
                    <ul>
                      {feedback.missingKeywords.map((item, idx) => (
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
                  {feedback?.recommendations.length ? (
                    <ul>
                      {feedback.recommendations.map((item, idx) => (
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
    );
}