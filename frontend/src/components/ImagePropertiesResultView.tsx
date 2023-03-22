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
  const colorString = `${color.red},${color.green},${color.blue}`;

  return (
    <TableCell align="right">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" style={{ alignSelf: "flex-start" }}>
          {`RGB = (${color.red}, ${color.green}, ${color.blue})`}
        </Typography>
        <Typography variant="caption" style={{ alignSelf: "flex-end" }}>
          {(pixelFraction * 100).toFixed(0)}%
        </Typography>
      </div>
      <LinearProgress
        sx={{
          backgroundColor: `rgb(${colorString}, 0.4)`,
          "& .MuiLinearProgress-bar": {
            backgroundColor: `rgb(${colorString})`,
          },
          height: "20px",
        }}
        variant="determinate"
        value={pixelFraction * 100}
      />
    </TableCell>
  );
};

export default ({ annotation }: { annotation: ImagePropertiesAnnotation }) => {
  console.log(annotation);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {annotation.dominantColors.colors
            .sort((a, b) => b.pixelFraction - a.pixelFraction)
            .map(({ color, score, pixelFraction }, index) => (
              <TableRow key={index}>
                <ColorRow
                  color={color}
                  score={score}
                  pixelFraction={pixelFraction}
                />
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
