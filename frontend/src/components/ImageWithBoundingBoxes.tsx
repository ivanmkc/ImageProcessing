import React from "react";
import { ObjectDetectionResult, ObjectDetection } from "queries";
import { Box } from "@mui/material";

const ImageWithBoundingBoxes = ({
  imageUrl,
  objectDetectionResult,
}: {
  imageUrl: string;
  objectDetectionResult?: ObjectDetectionResult;
}) => {
  const boundingBoxes = objectDetectionResult?.objectDetections.map(
    (detection: ObjectDetection) => detection.boundingBox
  );

  const boundingBoxElements = boundingBoxes?.map((box, index) => (
    <Box
      key={index}
      sx={{
        position: "absolute",
        top: `${box.y}px`,
        left: `${box.x}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        border: "3px solid red",
      }}
    />
  ));

  return (
    <Box
      sx={{
        width: "100%",
        paddingTop: "100%",
        position: "relative",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      {boundingBoxElements}
    </Box>
  );
};

export default ImageWithBoundingBoxes;
