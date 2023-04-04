export default ({
  index,
  label,
  confidence,
}: {
  index: number;
  label: string;
  confidence: number;
}) => {
  const confidencePercent = confidence * 100;

  return (
    <td className="text-right h-12 border border-neutral-300 p-4">
      <div className={"flex justify-between items-start"}>
        <span className="text-xs font-semibold">{label}</span>
        <span className="text-xs font-medium">
          {index === 0 ? "Confidence = " : null}
          {confidence.toFixed(2)}
        </span>
      </div>
      <div className={"h-2 bg-gray-200 rounded overflow-hidden mt-1"}>
        <div
          className={"bg-green-600 h-full"}
          style={{ width: `${confidencePercent}%` }}
        ></div>
      </div>
    </td>
  );
};
