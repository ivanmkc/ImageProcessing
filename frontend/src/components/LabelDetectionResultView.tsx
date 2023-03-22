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
import { Annotation } from "queries";

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

export default ({ annotations }: { annotations: Annotation[] }) => {
  if (annotations.length == 0) {
    return (
      <Alert severity="info">
        <Typography variant="body1" sx={{ ml: 2 }}>
          No labels detected.
        </Typography>
      </Alert>
    );
  }

  // Sort rows by confidence
  const rows = annotations.sort((a, b) => b.score - a.score);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {rows.map(({ description, score }) => (
            <TableRow key={description}>
              <LabelRow label={description} confidence={score} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
