import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { uploadImage, ImageUploadResult } from "queries";
import { Stack } from "@mui/system";
import ClassificationResultView from "components/ClassificationResultsView";

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

const ResultContainer = ({ result }: { result: ImageUploadResult }) => (
  <Box>
    <Paper variant="outlined">
      <img src={result.imageUrl} alt="Uploaded Image" />
    </Paper>
    {result.classificationResult != null ? (
      <ClassificationResultView
        classificationResult={result.classificationResult}
      />
    ) : null}
    {result.segmentationResult != null ? <SegmentationResult /> : null}
    {result.objectDetectionResult != null ? <ObjectDetectionResult /> : null}
  </Box>
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
    ["uploadFile", selectedFile],
    () => {
      if (selectedFile != null) {
        return uploadImage(selectedFile);
      } else {
        throw new Error("No file selected for upload");
      }
    },
    {
      enabled: false,
    }
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Upload Image
        </Typography>
        <Stack spacing={2}>
          <TextField type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            onClick={() => {
              refetch();
            }}
            disabled={!selectedFile || isLoading}
          >
            Upload
          </Button>
          {selectedFile ? (
            <>
              {error && <ErrorAlert error={error} />}
              {isLoading && <LoadingAlert />}
              {uploadResult != null && (
                <ResultContainer result={uploadResult} />
              )}
            </>
          ) : null}
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
  );
};
