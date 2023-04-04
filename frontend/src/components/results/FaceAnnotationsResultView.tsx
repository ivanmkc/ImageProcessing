import { useState } from "react";
import clsx from "clsx";
import ConfidenceLabelRow from "components/results/ConfidenceLabelRow";
import { FaceAnnotation } from "queries";

export default ({
  annotations,
  onIndexSelected,
}: {
  annotations: FaceAnnotation[];
  onIndexSelected?: (index?: number) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (annotations.length === 0) {
    return (
      <div className="alert alert-info shadow-lg">
        <div>
          <span>No faces detected.</span>
        </div>
      </div>
    );
  }

  // Sort rows by confidence
  const faces = annotations.sort(
    (a, b) => b.detectionConfidence - a.detectionConfidence
  );

  return (
    <div className="shadow">
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
    </div>
  );
};
