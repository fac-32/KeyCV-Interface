import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CVUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Replace with your real API endpoint once it is available.
  const API_ENDPOINT = "https://api.example.com/upload-cv";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setResponseMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("choose the file");
      return;
    }

    const formData = new FormData();
    formData.append("cv_file", selectedFile);

    try {
      setIsUploading(true);
      setResponseMessage(null);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      const messageFromApi =
        data?.message ||
        "CV sent successfully. Replace API_ENDPOINT with your real backend URL.";
      setResponseMessage(messageFromApi);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not upload the file. Please try again.";
      setResponseMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div>
        <div>Attach your CV</div>
        <Input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
        />
        <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
          {isUploading ? "Uploading..." : "Analyze CV"}
        </Button>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default CVUpload;
