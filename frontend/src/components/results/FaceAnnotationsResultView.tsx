import { useState } from "react";
import clsx from "clsx";
import ConfidenceLabelRow from "components/results/ConfidenceLabelRow";
import { FaceAnnotation } from "queries";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Alert from "components/Alert";

export default ({
  annotations,
  onIndexSelected,
}: {
  annotations: FaceAnnotation[];
  onIndexSelected?: (index?: number) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort rows by confidence
  const faces = annotations.sort(
    (a, b) => b.detectionConfidence - a.detectionConfidence
  );

  return (
    <div className="flex flex-col gap-4">
      <span className="text-md font-medium">
        Face Detection detects multiple faces within an image along with the
        associated key facial attributes such as emotional state or wearing
        headwear.
      </span>

      {annotations.length === 0 ? (
        <Alert mode="info" text="No faces detected" />
      ) : (
        <table className="w-full divide-y divide-neutral-200">
          <tbody className="bg-white divide-y divide-neutral-200">
            {faces.map(({ detectionConfidence }, index) => (
              <tr
                key={index}
                className={clsx("cursor-pointer", {
                  "bg-gray-100": hoveredIndex === index,
                })}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  if (onIndexSelected) {
                    onIndexSelected(index);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  if (onIndexSelected) {
                    onIndexSelected(undefined);
                  }
                }}
              >
                <ConfidenceLabelRow
                  index={index}
                  label={`Face ${index + 1}`}
                  confidence={detectionConfidence}
                />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
