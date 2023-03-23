import { Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import GCSFileSelector from "components/GCSFileSelector";

export enum ImageSource {
  Upload,
  URL,
  CloudStorage,
}

type ImageSelectorProps = {
  isLoading: boolean;
  imageSource: ImageSource;
  handleFileChange: (file: File | null) => void;
  handleAnnotateByUri: (uri: string) => void;
  handleAnnotateByGcsUri: () => void;
};

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
          onKeyUp={(event) => {
            if (event.key === "Enter" && onConfirmClicked != null) {
              onConfirmClicked();
            }
          }}
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

export const UnifiedImageSelector = ({
  isLoading,
  imageSource,
  handleFileChange,
  handleAnnotateByUri,
  handleAnnotateByGcsUri,
}: ImageSelectorProps) => {
  const [imageUri, setImageUri] = useState("");
  const [gcsUri, setGCSUri] = useState("");

  const renderUpload = () => (
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2">Choose a file</Typography>
      <TextField
        type="file"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            handleFileChange(files[0]);
          } else {
            handleFileChange(null);
          }
        }}
        fullWidth
      />
    </Box>
  );

  const renderURL = () => (
    <AnnotateByUri
      imageUri={imageUri}
      onImageUriChanged={(text) => setImageUri(text)}
      isButtonDisabled={imageUri.length == 0 || isLoading}
      onConfirmClicked={() => handleAnnotateByUri(imageUri)}
    />
  );

  const renderCloudStorage = () => (
    <GCSFileSelector
      gcsUri={gcsUri}
      onUriChanged={(text) => setGCSUri(text)}
      isButtonDisabled={gcsUri.length == 0 || isLoading}
      onConfirmClicked={handleAnnotateByGcsUri}
    />
  );

  switch (imageSource) {
    case ImageSource.Upload:
      return renderUpload();
    case ImageSource.URL:
      return renderURL();
    case ImageSource.CloudStorage:
      return renderCloudStorage();
    default:
      return null;
  }
};
