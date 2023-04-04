import clsx from "clsx";
import { LocalizedObjectAnnotation } from "queries";
import ConfidenceLabelRow from "components/results/ConfidenceLabelRow";
import Alert from "components/Alert";

interface Props {
  annotations: LocalizedObjectAnnotation[];
  showTopResult: boolean;
  onIndexSelected?: (index?: number) => void;
}

const ResultsTable = ({
  annotations,
  showTopResult,
  onIndexSelected,
}: Props) => {
  // Display message if no objects detected
  if (annotations.length === 0) {
    return (
      <div
        className={clsx(
          "bg-blue-200 text-blue-800 p-4 rounded", // Alert styling
          "flex items-center", // Flexbox alignment
          "text-sm" // Text size
        )}
      >
        No objects detected.
      </div>
    );
  }

  // Sort object detections by confidence
  const objectDetections = annotations.sort((a, b) =>
    a.score < b.score ? 1 : -1
  );

  // Get highest confidence label and percentage
  const highestConfidence = objectDetections[0];
  const label = highestConfidence.name;
  const confidencePercentage = (highestConfidence.score * 100).toFixed(0);

  return (
    <div className="flex flex-col gap-4">
      <span className="text-md font-medium">
        The Vision API can detect and extract multiple objects in an image with
        Object Localization. Each result identifies information about the
        object, the position of the object, and rectangular bounds for the
        region of the image that contains the object.
      </span>
      {showTopResult && (
        <Alert
          mode="success"
          text={`Image is classified as '${label}' with ${confidencePercentage}% confidence.`}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {objectDetections.map(({ name, score }, index) => (
              <tr
                key={index}
                onMouseEnter={() => {
                  if (onIndexSelected) {
                    onIndexSelected(index);
                  }
                }}
                onMouseLeave={() => {
                  if (onIndexSelected) {
                    onIndexSelected(undefined);
                  }
                }}
              >
                <ConfidenceLabelRow
                  index={index}
                  label={name}
                  confidence={score}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
