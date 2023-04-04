import clsx from "clsx";
import { SafeSearchAnnotation } from "queries";

const CONFIDENCE_LEVELS_MAP: {
  [key: string]: { label: string; confidencePercent: number };
} = {
  "0": { label: "UNKNOWN", confidencePercent: 0 },
  "1": { label: "VERY UNLIKELY", confidencePercent: 0 },
  "2": { label: "UNLIKELY", confidencePercent: (1 / 4) * 100 },
  "3": { label: "POSSIBLE", confidencePercent: (2 / 4) * 100 },
  "4": { label: "LIKELY", confidencePercent: (3 / 4) * 100 },
  "5": { label: "VERY LIKELY", confidencePercent: (4 / 4) * 100 },
};

const ProgressBar = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <div className="h-2 bg-gray-200 rounded">
    <div
      className={clsx("h-2 bg-indigo-600 rounded", className)}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const LabelRow = ({
  label,
  confidence,
}: {
  label: string;
  confidence: number;
}) => {
  const confidenceLabel: string =
    CONFIDENCE_LEVELS_MAP[confidence.toString()]["label"];
  const confidencePercent: number =
    CONFIDENCE_LEVELS_MAP[confidence.toString()]["confidencePercent"];

  return (
    <td className="text-right h-12 border border-neutral-300 p-4">
      <div className="flex justify-between">
        <span className="text-xs font-semibold">{label}</span>
        <span className="text-xs font-medium">{confidenceLabel}</span>
      </div>
      <ProgressBar value={confidencePercent} className="mt-1" />
    </td>
  );
};

export default ({ annotation }: { annotation: SafeSearchAnnotation }) => {
  return (
    <table className="w-full table-fixed">
      <tbody>
        <tr>
          <LabelRow label="Adult" confidence={annotation.adult} />
        </tr>
        <tr>
          <LabelRow label="Spoof" confidence={annotation.spoof} />
        </tr>
        <tr>
          <LabelRow label="Medical" confidence={annotation.medical} />
        </tr>
        <tr>
          <LabelRow label="Violence" confidence={annotation.violence} />
        </tr>
        <tr>
          <LabelRow label="Racy" confidence={annotation.racy} />
        </tr>
      </tbody>
    </table>
  );
};
