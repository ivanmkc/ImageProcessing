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
import { Color, ImagePropertiesAnnotation } from "queries";

const ColorRow = ({
  color,
  score,
  pixelFraction,
}: {
  color: Color;
  score: number;
  pixelFraction: number;
}) => {
  // const confidenceLabel: string =
  //   CONFIDENCE_LEVELS_MAP[confidence.toString()]["label"];
  // const confidencePercent: number =
  //   CONFIDENCE_LEVELS_MAP[confidence.toString()]["confidencePercent"];
  const background = `rgb(${color.red}, ${color.green}, ${color.blue})`;

  return (
    <TableCell align="right" sx={{ backgroundColor: background }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" style={{ alignSelf: "flex-start" }}>
          {`r:${color.red}, g:${color.green}, b:${color.blue}`}
        </Typography>
        <Typography variant="caption" style={{ alignSelf: "flex-end" }}>
          {pixelFraction * 100}%
        </Typography>
      </div>
      <LinearProgress variant="determinate" value={pixelFraction * 100} />
    </TableCell>
  );
};

export default ({ annotation }: { annotation: ImagePropertiesAnnotation }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {annotation.dominantColors.map(
            ({ color, score, pixelFraction }, index) => (
              <TableRow key={index}>
                <ColorRow
                  color={color}
                  score={score}
                  pixelFraction={pixelFraction}
                />
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
