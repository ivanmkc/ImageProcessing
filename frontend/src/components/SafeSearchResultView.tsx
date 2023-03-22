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
import { SafeSearchAnnotation } from "queries";

const CONFIDENCE_LEVELS_MAP: {
  [key: string]: { label: string; confidencePercent: number };
} = {
  "0": { label: "UNKNOWN", confidencePercent: 0 },
  "1": { label: "VERY UNLIKELY", confidencePercent: 0 },
  "2": { label: "UNLIKELY", confidencePercent: 1 / 4 },
  "3": { label: "POSSIBLE", confidencePercent: 2 / 4 },
  "4": { label: "LIKELY", confidencePercent: 3 / 4 },
  "5": { label: "VERY LIKELY", confidencePercent: 4 / 4 },
};

const LabelRow = ({
  label,
  confidence,
}: {
  label: string;
  confidence: number;
}) => {
  const confidenceLabel: string =
    CONFIDENCE_LEVELS_MAP[confidence.toString()]["label"];
  const confidencePercent: number =
    CONFIDENCE_LEVELS_MAP[confidence.toString()]["confidencePercent"];

  return (
    <TableCell align="right">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" style={{ alignSelf: "flex-start" }}>
          {label}
        </Typography>
        <Typography variant="caption" style={{ alignSelf: "flex-end" }}>
          {confidenceLabel}
        </Typography>
      </div>
      <LinearProgress variant="determinate" value={confidencePercent} />
    </TableCell>
  );
};

export default ({ annotation }: { annotation: SafeSearchAnnotation }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow key={"Adult"}>
            <LabelRow label="Adult" confidence={annotation.adult} />
          </TableRow>
          <TableRow key={"Spoof"}>
            <LabelRow label="Spoof" confidence={annotation.spoof} />
          </TableRow>
          <TableRow key={"Medical"}>
            <LabelRow label="Medical" confidence={annotation.medical} />
          </TableRow>
          <TableRow key={"Violence"}>
            <LabelRow label="Violence" confidence={annotation.violence} />
          </TableRow>
          <TableRow key={"Racy"}>
            <LabelRow label="Racy" confidence={annotation.racy} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
