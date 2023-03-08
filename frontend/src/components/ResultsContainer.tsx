import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Grid } from "@mui/material";
import { ImageUploadResult } from "queries";
import ImageWithBoundingBoxes from "components/ImageWithBoundingBoxes";
import LabelDetectionResultView from "components/LabelDetectionResultView";
import ObjectDetectionResultView from "components/ObjectDetectionResultView";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && <div>{children}</div>}
    </div>
  );
};

const ResultContainer = ({ result }: { result: ImageUploadResult }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={0} width="100%">
      <Grid item xs={12} md={6}>
        <ImageWithBoundingBoxes
          objectDetectionResult={result.objectDetectionResult}
          imageUrl={result.imageUrl}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="Objects" />
            <Tab label="Labels" />
            <Tab label="Properties" />
            <Tab label="Safe Search" />
          </Tabs>
          <TabPanel value={value} index={0}>
            {result.objectDetectionResult != null ? (
              <ObjectDetectionResultView
                result={result.objectDetectionResult}
                showTopResult={true}
              />
            ) : null}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {result.labelDetectionResult != null ? (
              <LabelDetectionResultView
                result={result.labelDetectionResult}
                showTopResult={false}
              />
            ) : null}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography>TODO: Properties</Typography>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Typography>TODO: Safe Search</Typography>
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResultContainer;
