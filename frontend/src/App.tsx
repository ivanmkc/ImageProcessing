import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { uploadImage, ImageUploadResult } from "queries";
import { Stack } from "@mui/system";
import ResultContainer from "components/ResultsContainer";

const ObjectDetectionResult = () => (
  <Alert severity="success">
    <Typography variant="body1" sx={{ ml: 2 }}>
      Image is classified as a "cat" with 94% confidence.
    </Typography>
  </Alert>
);

const SegmentationResult = () => (
  <Alert severity="success">
    <Typography variant="body1" sx={{ ml: 2 }}>
      Image is classified as a "cat" with 94% confidence.
    </Typography>
  </Alert>
);

const ErrorAlert = ({ error }: { error: Error }) => (
  <Alert severity="error">Error: {error.message}</Alert>
);

const LoadingAlert = () => (
  <Alert severity="info" icon={<CircularProgress size={24} />}>
    <Typography variant="body1" sx={{ ml: 2 }}>
      Uploading image...
    </Typography>
  </Alert>
);

const ImageUploadPage = () => {
  const [selectedFile, setFile] = useState<File | null>(null);
  const [imageUrl, setImageSrc] = useState<string>("");

  const {
    isLoading,
    error,
    reset,
    mutate: performUpload,
    data: uploadResult,
  } = useMutation<ImageUploadResult, Error>(
    ["uploadFile", selectedFile],
    () => {
      if (selectedFile != null) {
        return uploadImage(selectedFile);
      } else {
        throw new Error("No file selected for upload");
      }
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);

      // Reset upload results
      reset();

      // Get the file url and save it to state
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result != null) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
    }
  };

  return (
    <Box sx={{ paddingTop: 8 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Upload Image
          </Typography>
          <Stack spacing={2}>
            <TextField type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              onClick={() => {
                performUpload();
              }}
              disabled={!selectedFile || isLoading}
              sx={{ maxWidth: "200px" }}
            >
              Upload
            </Button>
            {selectedFile ? (
              <>
                {error && <ErrorAlert error={error} />}
                {isLoading && <LoadingAlert />}
                {uploadResult != null && (
                  <ResultContainer imageUrl={imageUrl} result={uploadResult} />
                )}
              </>
            ) : null}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageUploadPage />
    </QueryClientProvider>
  );
};
