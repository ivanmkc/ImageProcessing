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

import React, { useState } from "react";
import clsx from "clsx";
import { ImageAnnotationResult } from "queries";
import ImageWithBoundingBoxes from "components/ImageWithBoundingBoxes";
import LabelDetectionResultView from "components/results/LabelDetectionResultView";
import ObjectDetectionResultView from "components/results/ObjectDetectionResultView";
import SafeSearchResultView from "components/results/SafeSearchResultView";
import ImagePropertiesResultView from "components/results/ImagePropertiesResultView";
import FaceAnnotationsResultView from "components/results/FaceAnnotationsResultView";

const tabLabels: { [key: string]: keyof ImageAnnotationResult } = {
  Objects: "localizedObjectAnnotations",
  Labels: "labelAnnotations",
  Properties: "imagePropertiesAnnotation",
  "Safe Search": "safeSearchAnnotation",
  Faces: "faceAnnotations",
};

const ResultContainer = ({
  result,
  imageUrl,
}: {
  imageUrl: string;
  result: ImageAnnotationResult;
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handleChange = (newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="bg-gray-50 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
        <div>
          <ImageWithBoundingBoxes
            objectAnnotations={
              selectedTab === 0 ? result.localizedObjectAnnotations : undefined
            }
            faceAnnotations={
              selectedTab === 4 ? result.faceAnnotations : undefined
            }
            imageUrl={imageUrl}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="tabs">
            {Object.keys(tabLabels).map((label, index) => (
              <button
                key={index}
                className={clsx(
                  "tab tab-bordered",
                  selectedTab === index && "tab-active",
                  result[tabLabels[label]] == null
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                )}
                disabled={result[tabLabels[label]] == null}
                onClick={() => handleChange(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-2 flex-grow">
            {selectedTab === 0 && result.localizedObjectAnnotations != null && (
              <ObjectDetectionResultView
                annotations={result.localizedObjectAnnotations}
                showTopResult={true}
                onIndexSelected={(index) => setSelectedIndex(index)}
              />
            )}
            {selectedTab === 1 && result.labelAnnotations != null && (
              <LabelDetectionResultView annotations={result.labelAnnotations} />
            )}
            {selectedTab === 2 && result.imagePropertiesAnnotation != null && (
              <ImagePropertiesResultView
                annotation={result.imagePropertiesAnnotation}
              />
            )}
            {selectedTab === 3 && result.safeSearchAnnotation != null && (
              <SafeSearchResultView annotation={result.safeSearchAnnotation} />
            )}
            {selectedTab === 4 && result.faceAnnotations != null && (
              <FaceAnnotationsResultView
                annotations={result.faceAnnotations}
                onIndexSelected={(index) => setSelectedIndex(index)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultContainer;
