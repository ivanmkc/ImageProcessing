/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper>
      <Grid container spacing={4} padding={4} width="100%">
        <Grid item xs={12} md={6}>
          <ImageWithBoundingBoxes
            objectDetectionResult={
              selectedTab == 0 ? result.objectDetectionResult : undefined
            }
            imageUrl={result.imageUrl}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%" }}>
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              variant="fullWidth"
            >
              <Tab label="Objects" />
              <Tab label="Labels" />
              <Tab label="Properties" />
              <Tab label="Safe Search" />
            </Tabs>
            <Box padding={2}>
              <TabPanel value={selectedTab} index={0}>
                {result.objectDetectionResult != null ? (
                  <ObjectDetectionResultView
                    result={result.objectDetectionResult}
                    showTopResult={true}
                  />
                ) : null}
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                {result.labelDetectionResult != null ? (
                  <LabelDetectionResultView
                    result={result.labelDetectionResult}
                  />
                ) : null}
              </TabPanel>
              <TabPanel value={selectedTab} index={2}>
                <Typography>TODO: Properties</Typography>
              </TabPanel>
              <TabPanel value={selectedTab} index={3}>
                <Typography>TODO: Safe Search</Typography>
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ResultContainer;
