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

const client = axios.create({ baseURL: 'api' });


export interface Annotation {
  mid: string;
  description: string;
  score: number;
  locale: string;
  confidence: number;
  topicality: number;
  properties: any[]; // What is this?
}

export interface LocalizedObjectAnnotation {
  class: string;
  score: number;
  box: number[];
}
export interface ImageAnnotationResult {
  annotations?: LocalizedObjectAnnotation[];
  error?: string;
}

export async function annotateImageByFile(
  file: File,
): Promise<ImageAnnotationResult> {
  const formData = new FormData();
  formData.append("image", file);
  return client
    .post<ImageAnnotationResult>("/annotate", formData)
    .then((response) => response.data);
}

export async function annotateImageByUri(
  imageUri: string,
): Promise<ImageAnnotationResult> {
  throw Error("Not supported");
}

export async function annotateImageByCloudImageInfo(
  info: CloudImageInfo
): Promise<ImageAnnotationResult> {
  const annotation = info.annotation;

  if (annotation != null) {
    return client
      .get<ImageAnnotationResult>(`/bucket/annotation/${annotation}`, {
        params: { image_uri: info.annotation },
      })
      .then((response) => response.data);
  } else {
    throw Error("No annotation exists for this image");
  }
}

export interface ListInfoDictionary {
  [key: string]: { annotation?: string; image: string };
}
export interface CloudImageInfo {
  imageId: string;
  annotation?: string;
}

export async function getImageInfo(
  start?: number,
  end?: number
): Promise<CloudImageInfo[]> {
  return client
    .get<ListInfoDictionary>("/bucket/list", {
      params: { start, end },
    })
    .then((response) => response.data)
    .then((listInfoDict) =>
      Object.entries(listInfoDict).map(([key, value]) => {
        return {
          ...value,
          imageId: key,
        };
      })
    );
}

export function getImageDataURL(info: CloudImageInfo): string {
  return `api/bucket/imagedata/${info.imageId}`;
}
