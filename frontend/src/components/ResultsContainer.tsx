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
import ObjectDetectionResultView from "components/results/ObjectDetectionResultView";

const ResultContainer = ({
  result,
  imageUrl,
}: {
  imageUrl: string;
  result: ImageAnnotationResult;
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <div className="bg-gray-50 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
        <div>
          <ImageWithBoundingBoxes
            objectAnnotations={result.annotations}
            imageUrl={imageUrl}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="p-2 flex-grow">
            {result.annotations != null && (
              <ObjectDetectionResultView
                annotations={result.annotations}
                showTopResult={true}
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
