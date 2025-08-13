

// // src/services/api.ts

import axios from "axios"; // Import Axios for making HTTP requests

// ✅ Define your backend URL
const BASE_URL = "https://solapay-backend.onrender.com/auth"; // Use your production backend
//const BASE_URL = "http://localhost:5000/auth"; // Use this during local dev

// ✅ Create an Axios instance with default headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 👈 this is essential
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Utility function for reusable API calls
const apiRequest = async ({
  url,
  method = "GET",
  data = null,

  headers = {},
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown; // ✅ safest generic alternative
  headers?: Record<string, string>;
}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient({
      baseURL: BASE_URL,
      url,
      method,
      data,
      headers: isFormData
        ? headers
        : { "Content-Type": "application/json", ...headers },
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Unexpected error occurred.";
    throw new Error(message);
  }
};



export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return await apiRequest({
    url: "/register",
    method: "POST",
    data,
  });
};
  

// POST - Login user
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  return apiRequest({
    url: "/login",
    method: "POST",
    data: credentials,
  });
};


// GET - Start Google auth flow
export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/google`;
};

// GET - Start Discord auth flow
export const loginWithDiscord = () => {
  window.location.href = `${BASE_URL}/discord`;
};

// src/services/api.ts
export const logOut = async () => {
  return apiRequest({
    url: "/logout",
    method: "GET",
    //withCredentials: true, // <-- this is required for cookies
  });
};


export const deleteInvoiceById = async (invoiceId: string) => {
  const res = await axios.delete(
    `https://solapay-backend.onrender.com/invoice/deleteinvoice`,
    {
      params: { invoiceId },
    }
  );
  return res.data;
};
