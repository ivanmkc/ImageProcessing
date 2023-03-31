import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Typography } from "@mui/material";

interface Props {
  onChange: (features: string[]) => void;
}

const FEATURE_TO_LABEL_MAP = {
  OBJECT_LOCALIZATION: "Object localization",
  LABEL_DETECTION: "Label detection",
  IMAGE_PROPERTIES: "Image properties",
  SAFE_SEARCH_DETECTION: "Safe-search detection",
  FACE_DETECTION: "Face detection",
};

const FeatureSelector = ({ onChange }: Props) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Set to all features on init
  useEffect(() => {
    setSelectedFeatures(Object.keys(FEATURE_TO_LABEL_MAP));
  }, []);

  // Call change handler whenever features changes
  useEffect(() => {
    onChange(selectedFeatures);
  }, [selectedFeatures, setSelectedFeatures]);

  const handleFeatureSelection = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => {
    setSelectedFeatures(newSelection);
  };

  return (
    <ToggleButtonGroup
      value={selectedFeatures}
      onChange={handleFeatureSelection}
    >
      {Object.entries(FEATURE_TO_LABEL_MAP).map(([feature, label]) => (
        <ToggleButton key={feature} value={feature} aria-label={label}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FeatureSelector;
