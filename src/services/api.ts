import supabase from "@/lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signUpUser = (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signInUser = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const insertUser = (userId: string) => {
  return supabase.from("users").insert({ user_id: userId });
};

/**
 * ============================================================================
 * API Functions
 * ============================================================================
 */

async function post(endpoint: string, body: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    ...body, // body will be FormData or a JSON stringified object
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`,
    }));
    throw new Error(errorData.message || "An API error occurred");
  }

  return response.json();
}

export const analyzeResume = (formData: FormData) => {
  // The browser will set the correct Content-Type for FormData
  return post("/analyze-resume", { body: formData });
};

export const uploadCv = (formData: FormData) => {
  // The browser will set the correct Content-Type for FormData
  return post("/upload-cv", { body: formData });
};
