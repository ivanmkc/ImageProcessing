import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { uploadImage, ImageUploadResult } from "./queries";
import { Stack } from "@mui/system";

const ErrorAlert = ({ error }: { error: Error }) => (
  <Alert severity="error">
    Error: {error.message}
  </Alert>
);

const ResultContainer = ({ imageUrl }: { imageUrl: string }) => (
  <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: "100%", marginTop: 16 }} />
);

const LoadingAlert = () => (
  <Alert severity="info" icon={<CircularProgress size={24} />} >
    <Typography variant="body1" sx={{ ml: 2 }}>
      Uploading image...
    </Typography>
  </Alert >
);

const ImageUploadPage = () => {
  const [selectedFile, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const {
    isLoading,
    error,
    refetch,
    data: uploadResult,
  } = useQuery<ImageUploadResult, Error>(
    ['uploadFile', selectedFile],
    () => {
      if (selectedFile != null) {
        return uploadImage(selectedFile);
      } else {
        throw new Error('No file selected for upload');
      }
    },
    {
      enabled: false,
    }
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Upload Image
        </Typography>
        <Stack spacing={2}>
          <TextField type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={() => { refetch() }} disabled={!selectedFile || isLoading}>
            Upload
          </Button>
          {selectedFile ?
            <>
              {error && <ErrorAlert error={error} />}
              {isLoading && <LoadingAlert />}
              {uploadResult != null && <ResultContainer imageUrl={uploadResult.imageUrl} />}
            </> : null}
        </Stack>
      </Paper>
    </Box>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageUploadPage />
    </QueryClientProvider>
  )
}
