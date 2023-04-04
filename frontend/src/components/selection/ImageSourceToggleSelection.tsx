import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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

  const handleSelection = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: ImageSource
  ) => {
    if (newSelection !== null) {
      setSelectedFeature(newSelection);
      onChange(newSelection);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedOptions}
      exclusive
      onChange={handleSelection}
      sx={{ height: 80, flexShrink: 0 }}
    >
      {Object.entries(OPTION_TO_LABEL_MAP).map(([label, value]) => (
        <ToggleButton key={label} value={value} aria-label={label}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
