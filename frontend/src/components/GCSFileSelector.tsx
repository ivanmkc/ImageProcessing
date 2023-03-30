import { Box, Typography, TextField, Button } from "@mui/material";
import { listGCSFolder } from "queries";
import { useEffect } from "react";
import { useMutation } from "react-query";

export default ({
  gcsUri,
  isButtonDisabled,
  onUriChanged,
  onConfirmClicked,
}: {
  gcsUri: string;
  isButtonDisabled: boolean;
  onUriChanged: (text: string) => void;
  onConfirmClicked?: () => void;
}) => {
  const listGCSFolderMutation = useMutation<
    { [key: string]: { name: string; content: any[] } }[],
    Error
  >(["listGCSFolderMutation", gcsUri], () => {
    return listGCSFolder();
  });

  useEffect(() => {
    listGCSFolderMutation.mutate();
  }, []);

  return (
    <>
      <Box sx={{ flex: 1 }}>
        {/* {listGCSFolderMutation.data?.map((imageInfo) => {
          <Typography>{imageInfo}</Typography>;
        })} */}
        <Typography variant="subtitle2">TODO:Paste a GCS URI</Typography>
        <TextField
          id="outlined-controlled"
          value={gcsUri}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onUriChanged(event.target.value);
          }}
          fullWidth
          onKeyUp={(event) => {
            // if (event.key === "Enter" && onConfirmClicked != null) {
            //   onConfirmClicked();
            listGCSFolderMutation.mutate();
            // }
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
