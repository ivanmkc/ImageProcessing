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
  Divider,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  annotateImageByFile,
  annotateImageByUri,
  ImageUploadResult,
} from "queries";
import { Stack } from "@mui/system";
import ResultContainer from "components/ResultsContainer";

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

enum ImageSource {
  Upload,
  URL,
}

const AnnotateByUri = ({
  imageUri,
  isButtonDisabled,
  onImageUriChanged,
  onConfirmClicked,
}: {
  imageUri: string;
  isButtonDisabled: boolean;
  onImageUriChanged: (text: string) => void;
  onConfirmClicked?: () => void;
}) => {
  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">Paste an image URL</Typography>
        <TextField
          id="outlined-controlled"
          value={imageUri}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onImageUriChanged(event.target.value);
          }}
          fullWidth
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          if (onConfirmClicked != null) {
            onConfirmClicked();
          }
        }}
        disabled={isButtonDisabled}
      >
        Annotate
      </Button>
    </>
  );
};

const ImageUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileURL, setSelectedFileURL] = useState<string>();
  const [imageUri, setImageUri] = useState<string>(
    "https://cdn.arstechnica.net/wp-content/uploads/2023/03/GettyImages-865691398-800x533.jpg"
  );
  const [imageSource, setImageSource] = useState<ImageSource>(
    ImageSource.Upload
  );

  const annotateImageByFileMutation = useMutation<
    ImageUploadResult,
    Error,
    File
  >(["uploadFile", selectedFile], (file: File) => {
    return annotateImageByFile(file);
  });

  const annotateImageByUriMutation = useMutation<
    ImageUploadResult,
    Error,
    string
  >(["uploadFile", selectedFile], (imageUri: string) => {
    return annotateImageByUri(imageUri);
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
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

  const handleImageSourceChange = (
    event: React.MouseEvent<HTMLElement>,
    imageSource: string
  ) => {
    setImageSource(ImageSource[imageSource as keyof typeof ImageSource]);
  };

  const isLoading =
    annotateImageByFileMutation.isLoading ||
    annotateImageByUriMutation.isLoading;
  const error =
    annotateImageByFileMutation.error || annotateImageByUriMutation.error;
  const annotationResult =
    annotateImageByFileMutation.data || annotateImageByUriMutation.data;
  const imageURL = selectedFileURL || imageUri;

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
                  value="ImageUrl"
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  <Typography variant="overline">Image URL</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              {imageSource == ImageSource.Upload ? (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Choose a file</Typography>
                  <TextField
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                  />
                </Box>
              ) : (
                <AnnotateByUri
                  imageUri={imageUri}
                  onImageUriChanged={(text) => setImageUri(text)}
                  isButtonDisabled={imageUri.length == 0 || isLoading}
                  onConfirmClicked={() => {
                    if (imageUri != null) {
                      annotateImageByFileMutation.reset();
                      annotateImageByUriMutation.reset();
                      annotateImageByUriMutation.mutate(imageUri);
                    }
                  }}
                />
              )}
            </Stack>

            {error || isLoading || annotationResult ? (
              <>
                <Divider />
                <Typography variant="h5">Results</Typography>
                {error && <ErrorAlert error={error} />}
                {isLoading && <LoadingAlert />}
                {annotationResult != null && imageURL != null ? (
                  <ResultContainer
                    imageUrl={imageURL}
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
      <ImageUploadPage />
    </QueryClientProvider>
  );
};
