import {
  LinearProgress,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableBody,
  Typography,
  Alert,
} from "@mui/material";
import { FaceAnnotation } from "queries";
import ConfidenceLabelRow from "components/ConfidenceLabelRow";

export default ({
  annotations,
  onIndexSelected,
}: {
  annotations: FaceAnnotation[];
  onIndexSelected?: (index?: number) => void;
}) => {
  if (annotations.length == 0) {
    return (
      <Alert severity="info">
        <Typography variant="body1" sx={{ ml: 2 }}>
          No faces detected.
        </Typography>
      </Alert>
    );
  }

  // Sort rows by confidence
  const faces = annotations.sort(
    (a, b) => b.detectionConfidence - a.detectionConfidence
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {faces.map(({ detectionConfidence }, index) => (
            <TableRow
              key={index}
              onMouseEnter={() => {
                if (onIndexSelected) {
                  onIndexSelected(index);
                }
              }}
              onMouseLeave={() => {
                if (onIndexSelected) {
                  onIndexSelected(undefined);
                }
              }}
            >
              <ConfidenceLabelRow
                index={index}
                label={`Face ${index + 1}`}
                confidence={detectionConfidence}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
