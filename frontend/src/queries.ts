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

import axios from 'axios';

const client = axios.create({ baseURL: import.meta.env.API_SERVER });

export interface ImageUploadResult {
    imageUrl: string;
}

export async function uploadImage(file: File): Promise<ImageUploadResult> {
    const formData = new FormData();
    formData.append("image", file);
    return client.post<ImageUploadResult>("/upload-image", formData).then((response) => response.data);
}
