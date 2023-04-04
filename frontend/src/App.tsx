import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import {
  annotateImageByCloudImageInfo,
  annotateImageByFile,
  annotateImageByUri,
  CloudImageInfo,
  getImageDataURL,
  ImageAnnotationResult,
} from "queries";
import ResultContainer from "components/ResultsContainer";
import {
  ImageSource,
  UnifiedImageSelector,
} from "components/selection/UnifiedImageSelector";
import FeatureToggleSelection from "components/selection/FeatureToggleSelection";
import ImageSourceToggleSelection from "components/selection/ImageSourceToggleSelection";
import clsx from "clsx";

const ErrorAlert = ({ error }: { error: Error }) => (
  <div className="bg-red-500 text-white p-4 rounded">
    Error: {error.message}
  </div>
);

const LoadingAlert = () => (
  <div className="bg-blue-500 text-white p-4 rounded flex items-center">
    <div className="animate-spin mr-2">
      <i className="fas fa-spinner"></i>
    </div>
    Uploading image...
  </div>
);

const ImageAnnotationPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // The URL to the image to be displayed
  const [selectedFileUrl, setSelectedFileURL] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [imageSource, setImageSource] = useState<ImageSource>(
    ImageSource.Upload
  );

  const annotateImageByFileMutation = useMutation<
    ImageAnnotationResult,
    Error,
    File
  >((file: File) => {
    return annotateImageByFile(file, selectedFeatures);
  });

  const annotateImageByUriMutation = useMutation<
    ImageAnnotationResult,
    Error,
    string
  >((imageUri: string) => {
    return annotateImageByUri(imageUri, selectedFeatures);
  });

  const annotateImageByCloudImageMutation = useMutation<
    ImageAnnotationResult,
    Error,
    CloudImageInfo
  >((info: CloudImageInfo) => {
    return annotateImageByCloudImageInfo(info);
  });

  const handleFileChange = (file: File | null) => {
    console.log("handleFileChange");
    if (file != null) {
      setSelectedFile(file);

      // Reset upload results
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

      // Get the file url and save it to state
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result != null) {
          setSelectedFileURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      annotateImageByFileMutation.mutate(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAnnotateByUri = (uri: string) => {
    console.log("handleAnnotateByUri");

    if (uri.length > 0) {
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

      setSelectedFileURL(uri);
      annotateImageByUriMutation.mutate(uri);
    }
  };

  const handleCloudImageInfoSelected = (info: CloudImageInfo | null) => {
    console.log("handleCloudImageInfoSelected");
    if (info != null) {
      // Reset upload results
      annotateImageByFileMutation.reset();
      annotateImageByUriMutation.reset();
      annotateImageByCloudImageMutation.reset();

      // Get the image url
      setSelectedFileURL(getImageDataURL(info));

      annotateImageByCloudImageMutation.mutate(info);
    } else {
      setSelectedFile(null);
    }
  };

  // Redo annotation when features list changes
  useEffect(() => {
    console.log("selectedFeatures changed");
    switch (imageSource) {
      case ImageSource.Upload:
        handleFileChange(selectedFile);
        break;
      case ImageSource.URL:
        handleAnnotateByUri(selectedFileUrl);
        break;
      case ImageSource.CloudStorage:
        break;
    }
  }, [selectedFeatures]);

  // Clear results and file URL
  useEffect(() => {
    console.log("imageSource changed");
    setSelectedFileURL("");

    // Reset upload results
    annotateImageByFileMutation.reset();
    annotateImageByUriMutation.reset();
    annotateImageByCloudImageMutation.reset();
  }, [imageSource]);

  const handleImageSourceChange = (imageSource: ImageSource) => {
    setImageSource(imageSource);
  };

  let isLoading: boolean =
    annotateImageByFileMutation.isLoading ||
    annotateImageByUriMutation.isLoading ||
    annotateImageByCloudImageMutation.isLoading;
  let error: Error | null =
    annotateImageByFileMutation.error ||
    annotateImageByUriMutation.error ||
    annotateImageByCloudImageMutation.error;
  let annotationResult: ImageAnnotationResult | undefined =
    annotateImageByFileMutation.data ||
    annotateImageByUriMutation.data ||
    annotateImageByCloudImageMutation.data;

  const renderImageSourceSelection = () => {
    return (
      <div className={clsx("border-l-4 pl-4 border-blueGray-200", "space-y-2")}>
        <h6 className="text-lg">Image source</h6>
        <p className="text-base">Choose the image you want to annotate</p>
        <div className="grid grid-col-1 md:grid-cols-2 gap-4">
          <ImageSourceToggleSelection onChange={handleImageSourceChange} />
          <UnifiedImageSelector
            isLoading={isLoading}
            imageSource={imageSource}
            handleFileChange={handleFileChange}
            handleAnnotateByUri={handleAnnotateByUri}
            handleAnnotateByImageInfo={handleCloudImageInfoSelected}
          />
        </div>
      </div>
    );
  };

  const renderImageFeatureSelection = () => {
    return (
      <div className={clsx("border-l-4 pl-4 border-blueGray-200", "space-y-2")}>
        <h6 className="text-lg">Features</h6>
        <p className="text-base">
          Choose the image features you want to detect
        </p>
        <FeatureToggleSelection
          onChange={(features) => {
            setSelectedFeatures(features);
          }}
        />
      </div>
    );
  };

  const showImageFeatureSelection = imageSource != ImageSource.CloudStorage;

  return (
    <div className="container mx-auto max-w-6xl pt-8">
      <span className="text-2xl mb-2">Annotate Image</span>
      <div className="space-y-8">
        {renderImageSourceSelection()}
        {showImageFeatureSelection ? renderImageFeatureSelection() : null}
        {error || isLoading || annotationResult ? (
          <>
            <span className="text-2xl">Results</span>
            {error && <ErrorAlert error={error} />}
            {isLoading && <LoadingAlert />}
            {annotationResult != null && selectedFileUrl != null ? (
              <ResultContainer
                imageUrl={selectedFileUrl}
                result={annotationResult}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageAnnotationPage />
    </QueryClientProvider>
  );
};
