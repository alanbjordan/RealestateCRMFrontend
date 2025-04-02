// src/hooks/useBulkUpload.js
import { useState } from "react";
import API_URLS from "../utilities/apiConfig";

const useBulkUpload = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const submitBulkProperties = async (bulkProperties) => {
    setSubmitting(true);
    setSubmitMessage("");
    try {
      const response = await fetch(`${API_URLS.PROPERTIES}/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bulkProperties),
      });
      if (!response.ok) {
        throw new Error("Bulk upload failed");
      }
      const result = await response.json();
      setSubmitMessage(result.message || "Bulk upload successful!");
    } catch (error) {
      console.error("Error submitting bulk data:", error);
      setSubmitMessage("Error submitting bulk data.");
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, submitMessage, submitBulkProperties };
};

export default useBulkUpload;
