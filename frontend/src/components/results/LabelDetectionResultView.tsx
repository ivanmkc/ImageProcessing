import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableBody,
  Typography,
  Alert,
} from "@mui/material";
import { Annotation } from "queries";
import ConfidenceLabelRow from "components/ConfidenceLabelRow";

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
          {rows.map(({ description, score }, index) => (
            <TableRow key={index}>
              <ConfidenceLabelRow
                index={index}
                label={description}
                confidence={score}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
