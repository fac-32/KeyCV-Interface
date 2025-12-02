import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CVUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {};

  return (
    <div>
      <div>
        <div>Attach your CV</div>
        <Input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
        />
        <Button onClick={handleUpload}>Analize CV</Button>
      </div>
    </div>
  );
};

export default CVUpload;
