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
  annotateImageByCloudImageInfo,
  annotateImageByFile,
  annotateImageByUri,
  CloudImageInfo,
  getImageDataURL,
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

  const annotateImageByFileMutation = useMutation<
    ImageAnnotationResult,
    Error,
    File
  >((file: File) => {
    return annotateImageByFile(file, selectedFeatures);
  });

  const annotateImageByUriMutation = useMutation<
    ImageAnnotationResult,
    Error,
    string
  >((imageUri: string) => {
    return annotateImageByUri(imageUri, selectedFeatures);
  });

  const annotateImageByCloudImageMutation = useMutation<
    ImageAnnotationResult,
    Error,
    CloudImageInfo
  >((info: CloudImageInfo) => {
    return annotateImageByCloudImageInfo(info);
  });

  const handleFileChange = (file: File | null) => {
    console.log("handleFileChange");
    if (file != null) {
      setSelectedFile(file);

      // Reset upload results
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

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
    console.log("handleAnnotateByUri");

    if (uri.length > 0) {
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

      setSelectedFileURL(uri);
      annotateImageByUriMutation.mutate(uri);
    }
  };

  const handleCloudImageInfoSelected = (info: CloudImageInfo | null) => {
    console.log("handleCloudImageInfoSelected");
    if (info != null) {
      // Reset upload results
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

      // Get the image url
      setSelectedFileURL(getImageDataURL(info));

      annotateImageByCloudImageMutation.mutate(info);
    } else {
      setSelectedFile(null);
    }
  };

  // Redo annotation when features list changes
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

  // Clear results and file URL
  useEffect(() => {
    console.log("imageSource changed");
    setSelectedFileURL("");

    // Reset upload results
    annotateImageByFileMutation.reset();
    annotateImageByUriMutation.reset();
    annotateImageByCloudImageMutation.reset();
  }, [imageSource]);

  const handleImageSourceChange = (imageSource: ImageSource) => {
    setImageSource(imageSource);
  };

  let isLoading: boolean =
    annotateImageByFileMutation.isLoading ||
    annotateImageByUriMutation.isLoading ||
    annotateImageByCloudImageMutation.isLoading;
  let error: Error | null =
    annotateImageByFileMutation.error ||
    annotateImageByUriMutation.error ||
    annotateImageByCloudImageMutation.error;
  let annotationResult: ImageAnnotationResult | undefined =
    annotateImageByFileMutation.data ||
    annotateImageByUriMutation.data ||
    annotateImageByCloudImageMutation.data;

  const renderImageSourceSelection = () => {
    return (
      <Box sx={{ borderLeft: 4, padding: 2, borderColor: blueGrey[200] }}>
        <Typography variant="subtitle1">Image source</Typography>
        <Typography variant="subtitle2">
          Choose the image you want to annotate
        </Typography>
        <Stack direction="row" spacing={4}>
          <ImageSourceToggleSelection onChange={handleImageSourceChange} />
          <UnifiedImageSelector
            isLoading={isLoading}
            imageSource={imageSource}
            handleFileChange={handleFileChange}
            handleAnnotateByUri={handleAnnotateByUri}
            handleAnnotateByImageInfo={handleCloudImageInfoSelected}
          />
        </Stack>
      </Box>
    );
  };

  const renderImageFeatureSelection = () => {
    return (
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
    );
  };

  const showImageFeatureSelection = imageSource != ImageSource.CloudStorage;

  return (
    <Box sx={{ paddingTop: 8 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Annotate Image
          </Typography>
          <Stack spacing={2}>
            {renderImageSourceSelection()}
            {showImageFeatureSelection ? renderImageFeatureSelection() : null}
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
