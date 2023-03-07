/**
 * Copyright 2022 Google LLC
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

import axios from "axios";

const client = axios.create({ baseURL: import.meta.env.API_SERVER });

export type LabelDetectionResult = {
  [key: string]: number;
};

export interface ObjectDetection {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ObjectDetectionResult {
  objectDetections: ObjectDetection[];
}

export interface SegmentationLayer {
  label: string;
  confidence: number;
  mask: number[][];
}
export interface SegmentationResult {
  segmentationLayers: SegmentationLayer[];
}

export interface ImageUploadResult {
  imageUrl: string;
  objectDetectionResult?: ObjectDetectionResult;
  labelDetectionResult?: LabelDetectionResult;
}

const objectDetectionResult: ObjectDetectionResult = {
  objectDetections: [
    {
      label: "cat",
      confidence: 0.92,
      boundingBox: {
        x: 100,
        y: 200,
        width: 50,
        height: 100,
      },
    },
    {
      label: "dog",
      confidence: 0.85,
      boundingBox: {
        x: 300,
        y: 150,
        width: 70,
        height: 70,
      },
    },
  ],
};

export async function uploadImage(file: File): Promise<ImageUploadResult> {
  // const formData = new FormData();
  // formData.append("image", file);
  // return client
  //   .post<ImageUploadResult>("/upload-image", formData)
  //   .then((response) => response.data);

  return Promise.resolve({
    imageUrl: "http://placekitten.com/600/600",
    objectDetectionResult: objectDetectionResult,
    labelDetectionResult: { burger: 0.2, cat: 0.7, "hot dog": 0.1 },
  });
}
