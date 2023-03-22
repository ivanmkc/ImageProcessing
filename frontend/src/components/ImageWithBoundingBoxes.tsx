import React, { useEffect, useState } from "react";
import { FaceAnnotation, LocalizedObjectAnnotation, Poly } from "queries";
import { Box } from "@mui/material";

const BoundingBox = ({
  index,
  box,
  selectedIndex,
  imageWidth,
  imageHeight,
}: {
  index: number;
  box: Poly;
  imageWidth: number;
  imageHeight: number;
  selectedIndex?: number;
}) => {
  let percentX: number;
  let percentY: number;
  let percentWidth: number;
  let percentHeight: number;

  if (box.vertices.length == 4) {
    percentX = box.vertices[0].x / imageWidth;
    percentY = box.vertices[0].y / imageHeight;
    percentWidth = (box.vertices[2].x - box.vertices[0].x) / imageWidth;
    percentHeight = (box.vertices[2].y - box.vertices[0].y) / imageHeight;
  } else if (box.normalizedVertices.length == 4) {
    percentX = box.normalizedVertices[0].x;
    percentY = box.normalizedVertices[0].y;
    percentWidth = box.normalizedVertices[2].x - box.normalizedVertices[0].x;
    percentHeight = box.normalizedVertices[2].y - box.normalizedVertices[0].y;
  } else {
    return null;
  }

  return (
    <Box
      key={index}
      sx={{
        position: "absolute",
        top: `${percentY * 100}%`,
        left: `${percentX * 100}%`,
        width: `${percentWidth * 100}%`,
        height: `${percentHeight * 100}%`,
        border: `${index == selectedIndex ? "4px" : "2px"} solid green`,
      }}
    />
  );
};

const ImageWithBoundingBoxes = ({
  imageUrl,
  objectAnnotations,
  faceAnnotations,
  selectedIndex,
}: {
  imageUrl: string;
  objectAnnotations?: LocalizedObjectAnnotation[];
  faceAnnotations?: FaceAnnotation[];
  selectedIndex?: number;
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
    };
    image.src = imageUrl;
  }, [imageUrl]);

  let boundingBoxElements: React.ReactNode[] = [];

  if (objectAnnotations != null) {
    boundingBoxElements = objectAnnotations.map((annotation, index) => {
      const box = annotation.boundingPoly;

      return (
        <BoundingBox
          index={index}
          box={box}
          selectedIndex={selectedIndex}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
        />
      );
    });
  } else if (faceAnnotations != null) {
    boundingBoxElements = faceAnnotations.map((annotation, index) => {
      const box = annotation.fdBoundingPoly;

      return (
        <BoundingBox
          index={index}
          box={box}
          selectedIndex={selectedIndex}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
        />
      );
    });
  }

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: `${imageSize.width / imageSize.height}`,
        paddingTop: "0%",
        position: "relative",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        objectFit: "cover",
      }}
    >
      {boundingBoxElements}
    </Box>
  );
};

export default ImageWithBoundingBoxes;
