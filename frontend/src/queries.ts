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
export interface Poly {
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
export interface ImageAnnotationResult {
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

  error?: string;
}

const ALL_TYPES =
  "CROP_HINTS,DOCUMENT_TEXT_DETECTION,FACE_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION,LANDMARK_DETECTION,LOGO_DETECTION,OBJECT_LOCALIZATION,PRODUCT_SEARCH,SAFE_SEARCH_DETECTION,TEXT_DETECTION,TYPE_UNSPECIFIED,WEB_DETECTION";

const LIMITED_TYPES =
  "FACE_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION,OBJECT_LOCALIZATION,SAFE_SEARCH_DETECTION";

export async function annotateImageByFile(
  file: File
): Promise<ImageAnnotationResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append(
    "features",
    "FACE_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION,OBJECT_LOCALIZATION,SAFE_SEARCH_DETECTION"
  );
  return client
    .post<ImageAnnotationResult>("/", formData)
    .then((response) => response.data);
}

export async function annotateImageByUri(
  imageUri: string
): Promise<ImageAnnotationResult> {
  const formData = new FormData();
  formData.append("image_uri", imageUri);
  formData.append("features", LIMITED_TYPES);
  return client
    .post<ImageAnnotationResult>("/", formData)
    .then((response) => response.data);
}
