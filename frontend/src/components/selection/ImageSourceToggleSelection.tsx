import React, { useState } from "react";
import clsx from "clsx";
import { ImageSource } from "components/selection/UnifiedImageSelector";

interface Props {
  onChange: (imageSource: ImageSource) => void;
}

const OPTION_TO_LABEL_MAP = {
  "File upload": ImageSource.Upload,
  "Image URL": ImageSource.URL,
  "Cloud storage": ImageSource.CloudStorage,
};

export default ({ onChange }: Props) => {
  const [selectedOptions, setSelectedFeature] = useState<ImageSource>(
    Object.values(OPTION_TO_LABEL_MAP)[0]
  );

  const handleSelection = (newSelection: ImageSource) => {
    if (newSelection !== null) {
      setSelectedFeature(newSelection);
      onChange(newSelection);
    }
  };

  return (
    <div className="btn-group">
      {Object.entries(OPTION_TO_LABEL_MAP).map(([label, value]) => (
        <button
          key={label}
          onClick={() => handleSelection(value)}
          aria-label={label}
          className={clsx(
            "btn",
            selectedOptions === value
              ? "btn-primary border-primary-focus"
              : "bg-gray-200 border-gray-400 text-gray-500 hover:border-primary hover:bg-primary hover:bg-opacity-25"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
