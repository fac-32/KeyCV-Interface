// src/components/JobForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import JobForm from "./JobForm";

// Mock global fetch
const mockFetch = vi.spyOn(global, "fetch");

describe("JobForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset(); // Reset fetch mock before each test
  });

  test("renders the form elements correctly", () => {
    render(<JobForm />);
    expect(screen.getByLabelText(/Attach CV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Description/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Please paste job description here/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("displays error message when no CV file is attached", async () => {
    render(<JobForm />);
    const form = screen.getByRole("form");

    // Fill in job description because it's required, but not the file
    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "A job description." },
    });

    // Submit the form without a file
    fireEvent.submit(form);

    const errorMessage = await screen.findByText(/Please attach a CV file./i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("successfully submits form with CV and job description", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Analysis complete." }),
    } as Response);

    render(<JobForm />);
    const form = screen.getByRole("form");
    const file = new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: {
        value: "Software Engineer position requiring strong React skills.",
      },
    });
    const fileInput = screen.getByLabelText(/Attach CV/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const formData = mockFetch.mock.calls[0][1]?.body as FormData;
      expect(formData).toBeDefined();
      expect(formData.get("job_description")).toBe(
        "Software Engineer position requiring strong React skills.",
      );
      const submittedFile = formData.get("cv_file") as File;
      expect(submittedFile).toBeInstanceOf(File);
      expect(submittedFile.name).toBe(file.name);
    });

    expect(await screen.findByText(/Analysis complete./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/Job Description/i)).toHaveValue("");
    });
  });

  test("displays error message on failed API submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    render(<JobForm />);
    const form = screen.getByRole("form");
    const file = new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Some job description." },
    });
    fireEvent.change(screen.getByLabelText(/Attach CV/i), {
      target: { files: [file] },
    });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const errorMessage = await screen.findByText(
      /Submission failed with status 400/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays network error message when fetch throws an error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network connection lost."));

    render(<JobForm />);
    const form = screen.getByRole("form");
    const file = new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Some job description." },
    });
    fireEvent.change(screen.getByLabelText(/Attach CV/i), {
      target: { files: [file] },
    });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const errorMessage = await screen.findByText(/Network connection lost./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("submit button shows loading state and is disabled during submission", async () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {}));

    render(<JobForm />);
    const form = screen.getByRole("form");
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    const file = new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Some job description." },
    });
    fireEvent.change(screen.getByLabelText(/Attach CV/i), {
      target: { files: [file] },
    });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Submitting...");
    });
  });
});
