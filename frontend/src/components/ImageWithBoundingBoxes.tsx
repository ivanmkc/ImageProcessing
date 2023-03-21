import React, { useEffect, useState } from "react";
import { LocalizedObjectAnnotation } from "queries";
import { Box } from "@mui/material";

const ImageWithBoundingBoxes = ({
  imageUrl,
  objectAnnotations,
}: {
  imageUrl: string;
  objectAnnotations?: LocalizedObjectAnnotation[];
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
    };
    image.src = imageUrl;
  }, [imageUrl]);

  const boundingBoxes = objectAnnotations?.map(
    (annotation: LocalizedObjectAnnotation) => annotation.boundingPoly
  );

  const boundingBoxElements = boundingBoxes?.map((box, index) => {
    const { width, height } = imageSize;
    const percentX = (box.x / width) * 100;
    const percentY = (box.y / height) * 100;
    const percentWidth = (box.width / width) * 100;
    const percentHeight = (box.height / height) * 100;

    return (
      <Box
        key={index}
        sx={{
          position: "absolute",
          top: `${percentY}%`,
          left: `${percentX}%`,
          width: `${percentWidth}%`,
          height: `${percentHeight}%`,
          border: "2px solid red",
        }}
      />
    );
  });

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
