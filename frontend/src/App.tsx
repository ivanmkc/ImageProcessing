import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { uploadImage, ImageUploadResult } from "queries";
import { Stack } from "@mui/system";
import LabelDetectionResultView from "components/LabelDetectionResultView";
import ObjectDetectionResultView from "components/ObjectDetectionResultView";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && <div>{children}</div>}
    </div>
  );
};

const ResultContainer = ({ result }: { result: ImageUploadResult }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Paper variant="outlined">
        <img src={result.imageUrl} alt="Uploaded Image" />
      </Paper>
      <div>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Objects" />
          <Tab label="Labels" />
          <Tab label="Properties" />
          <Tab label="Safe Search" />
        </Tabs>
        <TabPanel value={value} index={0}>
          {result.objectDetectionResult != null ? (
            <ObjectDetectionResultView
              result={result.objectDetectionResult}
              showTopResult={true}
            />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {result.labelDetectionResult != null ? (
            <LabelDetectionResultView
              result={result.labelDetectionResult}
              showTopResult={false}
            />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>TODO: Properties</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>TODO: Safe Search</Typography>
        </TabPanel>
      </div>
    </Box>
  );
};

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
