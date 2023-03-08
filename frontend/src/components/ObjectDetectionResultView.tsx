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
import { ObjectDetectionResult } from "queries";

const LabelRow = ({
  label,
  confidence,
}: {
  label: string;
  confidence: number;
}) => {
  const confidencePercent = confidence * 100;

  return (
    <TableCell align="right">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" style={{ alignSelf: "flex-start" }}>
          {label}
        </Typography>
        <Typography variant="caption" style={{ alignSelf: "flex-end" }}>
          {confidence.toFixed(2)}
        </Typography>
      </div>
      <LinearProgress variant="determinate" value={confidencePercent} />
    </TableCell>
  );
};

export default ({
  result,
  showTopResult,
}: {
  result: ObjectDetectionResult;
  showTopResult: boolean;
}) => {
  // Sort rows by confidence
  const objectDetections = result.objectDetections.sort((a, b) =>
    a.confidence < b.confidence ? 1 : -1
  );

  // Get highest confidence label and percentage
  const highestConfidence = objectDetections[0];
  const label = highestConfidence.label;
  const confidencePercentage = (highestConfidence.confidence * 100).toFixed(0);

  return (
    <>
      {showTopResult ? (
        <Alert severity="success">
          <Typography variant="body1" sx={{ ml: 2 }}>
            Image is classified as '{label}' with {confidencePercentage}%
            confidence.
          </Typography>
        </Alert>
      ) : null}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {objectDetections.map(({ label, confidence }) => (
              <TableRow key={label}>
                <LabelRow label={label} confidence={confidence} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
