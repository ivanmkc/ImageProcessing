import clsx from "clsx";
import { useEffect, useState } from "react";
import CloudImageInfoSelector from "components/CloudImageSelector";
import { CloudImageInfo as CloudImageInfo } from "queries";

export enum ImageSource {
  Upload,
  URL,
  CloudStorage,
}

type ImageSelectorProps = {
  isLoading: boolean;
  imageSource: ImageSource;
  handleFileChange: (file: File | null) => void;
  handleAnnotateByUri: (uri: string) => void;
  handleAnnotateByImageInfo: (info: CloudImageInfo) => void;
};

const AnnotateByUri = ({
  imageUri,
  isButtonDisabled,
  onImageUriChanged,
  onConfirmClicked,
}: {
  imageUri: string;
  isButtonDisabled: boolean;
  onImageUriChanged: (text: string) => void;
  onConfirmClicked?: () => void;
}) => {
  return (
    <div className="flex items-end space-x-4">
      <div className="flex-1 flex-col items-baseline space-y-2">
        <label className="font-extralight">Paste an image URL</label>
        <input
          id="outlined-controlled"
          value={imageUri}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onImageUriChanged(event.target.value);
          }}
          className="w-full mb-2 input input-bordered"
          onKeyUp={(event) => {
            if (event.key === "Enter" && onConfirmClicked != null) {
              onConfirmClicked();
            }
          }}
        />
      </div>
      <button
        onClick={() => {
          if (onConfirmClicked != null) {
            onConfirmClicked();
          }
        }}
        className={clsx(
          "btn",
          "btn-primary",
          isButtonDisabled && "btn-disabled cursor-not-allowed"
        )}
        disabled={isButtonDisabled}
      >
        Annotate
      </button>
    </div>
  );
};

export const UnifiedImageSelector = ({
  isLoading,
  imageSource,
  handleFileChange,
  handleAnnotateByUri,
  handleAnnotateByImageInfo,
}: ImageSelectorProps) => {
  const [imageUri, setImageUri] = useState("");

  const renderUpload = () => (
    <div className="flex items-end space-x-4">
      <div className="flex-1 flex-col items-baseline space-y-2">
        <label className="font-extralight">Choose a file</label>
        <input
          type="file"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              handleFileChange(files[0]);
            } else {
              handleFileChange(null);
            }
          }}
          className="w-full file-input input-bordered max-w-md"
        />
      </div>
    </div>
  );

  const renderURL = () => (
    <AnnotateByUri
      imageUri={imageUri}
      onImageUriChanged={(text) => setImageUri(text)}
      isButtonDisabled={imageUri.length == 0 || isLoading}
      onConfirmClicked={() => handleAnnotateByUri(imageUri)}
    />
  );

  const renderCloudStorage = () => (
    <CloudImageInfoSelector onImageInfoSelected={handleAnnotateByImageInfo} />
  );

  // Fetch info on init
  useEffect(() => {
    console.log(`UnifiedImageSelector init: imageSource = ${imageSource}`);
  }, []);

  useEffect(() => {
    console.log(`UnifiedImageSelector:imageSource changed to ${imageSource}`);
  }, [imageSource]);

  switch (imageSource) {
    case ImageSource.Upload:
      return renderUpload();
    case ImageSource.URL:
      return renderURL();
    case ImageSource.CloudStorage:
      return renderCloudStorage();
    default:
      return null;
  }
};
