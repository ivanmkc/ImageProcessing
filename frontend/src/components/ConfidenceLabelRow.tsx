import { LinearProgress, TableCell, Typography } from "@mui/material";

export default ({
  index,
  label,
  confidence,
}: {
  index: number;
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
          {index == 0 ? "Confidence = " : null}
          {confidence.toFixed(2)}
        </Typography>
      </div>
      <LinearProgress variant="determinate" value={confidencePercent} />
    </TableCell>
  );
};
