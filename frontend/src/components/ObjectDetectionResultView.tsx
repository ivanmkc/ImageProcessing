/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  if (result.objectDetections.length == 0) {
    return (
      <Alert severity="info">
        <Typography variant="body1" sx={{ ml: 2 }}>
          No objects detected.
        </Typography>
      </Alert>
    );
  }

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
