import supabase from "@/lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ============================================================================
 * Auth Functions
 * ============================================================================
 */

export const signUpUser = (email, password) => {
  return supabase.auth.signUp({ email, password });
};

export const signInUser = (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const insertUser = (userId) => {
  return supabase.from("users").insert({ user_id: userId });
};

/**
 * ============================================================================
 * API Functions
 * ============================================================================
 */

async function post(endpoint, body) {
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

export const analyzeResume = (formData) => {
  // The browser will set the correct Content-Type for FormData
  return post("/analyze-resume", { body: formData });
};

export const uploadCv = (formData) => {
  // The browser will set the correct Content-Type for FormData
  return post("/upload-cv", { body: formData });
};
