/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from "react";
import { LocalizedObjectAnnotation } from "queries";
import clsx from "clsx";

const BoundingBox = ({
  index,
  normalizedVertices,
  selectedIndex,
}: {
  index: number;
  normalizedVertices: number[];
  imageWidth: number;
  imageHeight: number;
  selectedIndex?: number;
}) => {
  let percentX: number;
  let percentY: number;
  let percentWidth: number;
  let percentHeight: number;

  if (normalizedVertices.length == 4) {
    percentX = normalizedVertices[0];
    percentY = normalizedVertices[1];
    percentWidth = normalizedVertices[2] - percentX;
    percentHeight = normalizedVertices[3] - percentY;
  } else {
    return null;
  }

  return (
    <div
      className={clsx(
        "absolute border-solid border-green-500",
        index === selectedIndex ? "border-4" : "border-2"
      )}
      style={{
        top: `${percentY * 100}%`,
        left: `${percentX * 100}%`,
        width: `${percentWidth * 100}%`,
        height: `${percentHeight * 100}%`,
      }}
    />
  );
};

const ImageWithBoundingBoxes = ({
  imageUrl,
  objectAnnotations,
  selectedIndex,
}: {
  imageUrl: string;
  objectAnnotations?: LocalizedObjectAnnotation[];
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
      const box = annotation.box;

      return (
        <BoundingBox
          key={index}
          index={index}
          normalizedVertices={box}
          selectedIndex={selectedIndex}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
        />
      );
    });
  }
  const aspectRatio = imageSize.width / imageSize.height;
  const boxClasses = clsx(
    "w-full",
    "relative",
    "bg-no-repeat",
    "bg-contain",
    "bg-center",
    "object-cover"
    // Add custom classes or other conditional classes here
  );

  return (
    <div
      className={boxClasses}
      style={{
        paddingTop: "0%",
        backgroundImage: `url(${imageUrl})`,
        aspectRatio: aspectRatio,
      }}
    >
      {boundingBoxElements}
    </div>
  );
};

export default ImageWithBoundingBoxes;
