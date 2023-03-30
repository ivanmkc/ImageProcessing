import { useEffect, useState } from "react";
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
import FeatureToggleSelection from "components/FeatureToggleSelection";
import { blueGrey, grey } from "@mui/material/colors";
import ImageSourceToggleSelection from "components/ImageSourceToggleSelection";

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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [imageSource, setImageSource] = useState<ImageSource>(
    ImageSource.Upload
  );
  const [gcsUri, setGCSUri] = useState<string>("");

  const annotateImageByFileMutation = useMutation<
    ImageAnnotationResult,
    Error,
    File
  >(["annotateImageByFile", selectedFile], (file: File) => {
    return annotateImageByFile(file, selectedFeatures);
  });

  const annotateImageByUriMutation = useMutation<
    ImageAnnotationResult,
    Error,
    string
  >(["annotateImageByUri", selectedFile], (imageUri: string) => {
    return annotateImageByUri(imageUri, selectedFeatures);
  });

  const handleFileChange = (file: File | null) => {
    console.log("handleFileChange");
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

  useEffect(() => {
    console.log("selectedFeatures changed");
    switch (imageSource) {
      case ImageSource.Upload:
        handleFileChange(selectedFile);
        break;
      case ImageSource.URL:
        handleAnnotateByUri(selectedFileUrl);
        break;
      case ImageSource.CloudStorage:
        break;
    }
  }, [selectedFeatures]);

  const handleAnnotateByUri = (uri: string) => {
    console.log("handleAnnotateByUri");

    annotateImageByFileMutation.reset();
    annotateImageByUriMutation.reset();
    setSelectedFileURL(uri);
    annotateImageByUriMutation.mutate(uri);
  };
  const handleImageSourceChange = (imageSource: ImageSource) => {
    setImageSource(imageSource);
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
            <Box sx={{ borderLeft: 4, padding: 2, borderColor: blueGrey[200] }}>
              <Typography variant="subtitle1">Image source</Typography>
              <Typography variant="subtitle2">
                Choose the image you want to annotate
              </Typography>
              <Stack direction="row" spacing={4} height={80}>
                <ImageSourceToggleSelection
                  onChange={handleImageSourceChange}
                />
                <UnifiedImageSelector
                  isLoading={isLoading}
                  imageSource={imageSource}
                  handleFileChange={handleFileChange}
                  handleAnnotateByUri={handleAnnotateByUri}
                  handleAnnotateByGcsUri={() => {}}
                />
              </Stack>
            </Box>
            <Box sx={{ borderLeft: 4, padding: 2, borderColor: blueGrey[200] }}>
              <Typography variant="subtitle1">Features</Typography>
              <Typography variant="subtitle2">
                Choose the image features you want to detect
              </Typography>{" "}
              <FeatureToggleSelection
                onChange={(features) => {
                  setSelectedFeatures(features);
                }}
              />
            </Box>

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
