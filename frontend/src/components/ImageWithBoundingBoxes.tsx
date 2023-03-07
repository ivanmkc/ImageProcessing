import React from "react";
import { ObjectDetectionResult, ObjectDetection } from "queries";

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

  return (
    <div style={{ position: "relative" }}>
      <img src={imageUrl} alt="object detection" />

      {boundingBoxes?.map((box, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: box.y,
            left: box.x,
            width: box.width,
            height: box.height,
            border: "2px solid red",
          }}
        />
      ))}
    </div>
  );
};

export default ImageWithBoundingBoxes;
