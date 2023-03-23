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
  CircularProgress,
  Container,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  annotateImageByFile,
  annotateImageByUri,
  ImageAnnotationResult,
} from "queries";
import { Stack } from "@mui/system";
import ResultContainer from "components/ResultsContainer";
import {
  ImageSource,
  UnifiedImageSelector,
} from "components/UnifiedImageSelector";

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

const ImageAnnotationPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // The URL to the image to be displayed
  const [selectedFileUrl, setSelectedFileURL] = useState<string>("");
  const [imageSource, setImageSource] = useState<ImageSource>(
    ImageSource.Upload
  );
  const [gcsUri, setGCSUri] = useState<string>("");

  const annotateImageByFileMutation = useMutation<
    ImageAnnotationResult,
    Error,
    File
  >(["annotateImageByFile", selectedFile], (file: File) => {
    return annotateImageByFile(file);
  });

  const annotateImageByUriMutation = useMutation<
    ImageAnnotationResult,
    Error,
    string
  >(["annotateImageByUri", selectedFile], (imageUri: string) => {
    return annotateImageByUri(imageUri);
  });

  const handleFileChange = (file: File | null) => {
    if (file != null) {
      setSelectedFile(file);

      // Reset upload results
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();

      // Get the file url and save it to state
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result != null) {
          setSelectedFileURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      annotateImageByFileMutation.mutate(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAnnotateByUri = (uri: string) => {
    annotateImageByFileMutation.reset();
    annotateImageByUriMutation.reset();
    setSelectedFileURL(uri);
    annotateImageByUriMutation.mutate(uri);
  };

  const handleImageSourceChange = (
    event: React.MouseEvent<HTMLElement>,
    imageSource: string
  ) => {
    setImageSource(ImageSource[imageSource as keyof typeof ImageSource]);
  };

  let isLoading: boolean =
    annotateImageByFileMutation.isLoading ||
    annotateImageByUriMutation.isLoading;
  let error: Error | null =
    annotateImageByFileMutation.error || annotateImageByUriMutation.error;
  let annotationResult: ImageAnnotationResult | undefined =
    annotateImageByFileMutation.data || annotateImageByUriMutation.data;

  return (
    <Box sx={{ paddingTop: 8 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Annotate Image
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={4} height={80}>
              <ToggleButtonGroup
                orientation="horizontal"
                value={imageSource}
                exclusive
                onChange={handleImageSourceChange}
              >
                <ToggleButton
                  value="Upload"
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                    "&:hover": {
                      outline: "none",
                    },
                  }}
                >
                  <Typography variant="overline">File upload</Typography>
                </ToggleButton>
                <ToggleButton
                  value="URL"
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  <Typography variant="overline">Image URL</Typography>
                </ToggleButton>
                <ToggleButton
                  value="CloudStorage"
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  <Typography variant="overline">Cloud Storage</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              <UnifiedImageSelector
                isLoading={isLoading}
                imageSource={imageSource}
                handleFileChange={handleFileChange}
                handleAnnotateByUri={handleAnnotateByUri}
                handleAnnotateByGcsUri={() => {}}
              />
            </Stack>

            {error || isLoading || annotationResult ? (
              <>
                <Divider />
                <Typography variant="h5">Results</Typography>
                {error && <ErrorAlert error={error} />}
                {isLoading && <LoadingAlert />}
                {annotationResult != null && selectedFileUrl != null ? (
                  <ResultContainer
                    imageUrl={selectedFileUrl}
                    result={annotationResult}
                  />
                ) : null}
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
      <ImageAnnotationPage />
    </QueryClientProvider>
  );
};
