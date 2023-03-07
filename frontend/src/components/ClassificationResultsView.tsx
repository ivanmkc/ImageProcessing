import {
  LinearProgress,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Alert,
} from "@mui/material";
import { ClassificationResult } from "queries";

const ClassificationRow = ({
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
  classificationResult,
}: {
  classificationResult: ClassificationResult;
}) => {
  // Sort rows by confidence
  const rows = Object.entries(classificationResult)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);

  // Get highest confidence label and percentage
  const highestConfidence = rows[0];
  const label = highestConfidence.key;
  const confidencePercentage = (highestConfidence.value * 100).toFixed(0);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {rows.map(({ key, value }) => (
              <TableRow key={key}>
                <ClassificationRow label={key} confidence={value} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert severity="success">
        <Typography variant="body1" sx={{ ml: 2 }}>
          Image is classified as '{label}' with {confidencePercentage}%
          confidence.
        </Typography>
      </Alert>
    </>
  );
};
