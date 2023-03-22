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

import axios from "axios";
import sampleQuery from "mocks/sampleQueryResponse.json";

const client = axios.create({ baseURL: import.meta.env.VITE_API_SERVER });

// export type LabelDetectionResult = {
//   [key: string]: number;
// };

// export interface ObjectDetection {
//   label: string;
//   confidence: number;
//   boundingBox: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   };
// }

// export interface ObjectDetectionResult {
//   objectDetections: ObjectDetection[];
// }

export interface Color {
  red: number;
  green: number;
  blue: number;
}
export interface ImagePropertiesAnnotation {
  dominantColors: {
    colors: { color: Color; score: number; pixelFraction: number }[];
  };
}

interface Vertex {
  x: number;
  y: number;
}
interface Poly {
  vertices: Vertex[];
  normalizedVertices: Vertex[]; // What is this?
}

export interface Annotation {
  mid: string;
  description: string;
  score: number;
  locale: string;
  confidence: number;
  topicality: number;
  properties: any[]; // What is this?
}

interface Landmark {
  type: number;
  position: { x: number; y: number; z: number };
}

export interface FaceAnnotation {
  boundingPoly: Poly;
  fdBoundingPoly: Poly;
  landmarks: Landmark[];
  rollAngle: number;
  panAngle: number;
  tiltAngle: number;
  detectionConfidence: number;
  landmarkingConfidence: number;
  joyLikelihood: number;
  sorrowLikelihood: number;
  angerLikelihood: number;
  surpriseLikelihood: number;
  underExposedLikelihood: number;
  blurredLikelihood: number;
  headwearLikelihood: number;
}

export interface LocalizedObjectAnnotation {
  name: string;
  mid: string;
  score: number;
  boundingPoly: Poly;
  languageCode: string;
}
interface Location {
  latLng: { latitude: number; longitude: number };
}

export interface LandmarkAnnotation extends Annotation {
  boundingPoly: Poly;
  locations: Location[];
}

export interface SafeSearchAnnotation {
  adult: number;
  spoof: number;
  medical: number;
  violence: number;
  racy: number;
}
export interface ImageUploadResult {
  // imageUrl: string;
  // objectDetectionResult?: ObjectDetectionResult;

  faceAnnotations?: FaceAnnotation[];
  landmarkAnnotations?: LandmarkAnnotation[];
  labelAnnotations?: Annotation[];
  textAnnotations?: LandmarkAnnotation[];
  safeSearchAnnotation?: SafeSearchAnnotation;
  imagePropertiesAnnotation?: ImagePropertiesAnnotation;
  localizedObjectAnnotations?: LocalizedObjectAnnotation[];

  cropHintsAnnotation?: any;
  fullTextAnnotation?: any;
  webDetection?: any;
  logoAnnotations?: any;
}

// const objectDetectionResult: ObjectDetectionResult = {
//   objectDetections: [
//     {
//       label: "cat",
//       confidence: 0.92,
//       boundingBox: {
//         x: 100,
//         y: 200,
//         width: 50,
//         height: 100,
//       },
//     },
//     {
//       label: "dog",
//       confidence: 0.85,
//       boundingBox: {
//         x: 300,
//         y: 150,
//         width: 70,
//         height: 70,
//       },
//     },
//   ],
// };

const ALL_TYPES =
  "CROP_HINTS,DOCUMENT_TEXT_DETECTION,FACE_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION,LANDMARK_DETECTION,LOGO_DETECTION,OBJECT_LOCALIZATION,PRODUCT_SEARCH,SAFE_SEARCH_DETECTION,TEXT_DETECTION,TYPE_UNSPECIFIED,WEB_DETECTION";

export async function uploadImage(file: File): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append(
    "features",
    "FACE_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION,OBJECT_LOCALIZATION,SAFE_SEARCH_DETECTION"
  );
  return client
    .post<ImageUploadResult>("/", formData)
    .then((response) => response.data);

  // return Promise.resolve(sampleQuery);
}
