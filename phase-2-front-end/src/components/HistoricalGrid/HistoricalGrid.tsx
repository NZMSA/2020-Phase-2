import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from "@material-ui/core";
import _ from "lodash";

// core components
import Grid from "../Grid/Grid";
import CircularProgress from '../CircularProgress/CircularProgress'
// api
import { ITransformedHistoricalData, getHistoricalData, getCanvasById, IHistoricalDataDates } from "../../api/Api";
// utils
import { transformHistoricalData, historicalDataDates, extractColors } from "../../utils/gridHistory";

// NOTE: the current method of processing the data and rendering the
// component is very inefficient. Explain why that is

// TODO: explain the thought process
const HistoricalGrid = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currDateIdx, setCurrDateIdx] = useState<number>();
  const [selectedCanvasId, setSelectedCanvasId] = useState<number>();

  const [colors, setColors] = useState<string[][]>();
  const [historicalData, setHisotricalData] = useState<ITransformedHistoricalData>();
  const [canvasModifiedDates, setCanvasModifiedDates] = useState<IHistoricalDataDates>();

  const onLoadComponent = async () => {
    // fectch and transform and historical data
    const hist = await getHistoricalData();
    const transformed = await transformHistoricalData(hist);
    setHisotricalData(transformed);

    // set the modified dates of each canvas
    const modifiedDates = historicalDataDates(transformed);
    setCanvasModifiedDates(modifiedDates);

    // choosing the first one in the dictionary due to personal preference
    const firstCanvasIdKey = Number(Object.keys(transformed)[0]);
    setSelectedCanvasId(firstCanvasIdKey);
  };

  useEffect(() => {
    if (isLoading) {
      onLoadComponent();
      setIsLoading(false);
    }
  }, [isLoading]);

  // fetch the latest copy of canvas whenever canvasID is updated
  // and reset the date to the latest one of the modified dates
  useEffect(() => {
    (async () => {
      if (selectedCanvasId && canvasModifiedDates) {
        const canvas = await getCanvasById(selectedCanvasId);
        const colorsArray = extractColors(canvas);
        const latestModifiedDates = canvasModifiedDates[canvas.canvasID];

        setCurrDateIdx(latestModifiedDates.length - 1);
        setColors(colorsArray);
      }
    })();
  }, [selectedCanvasId, canvasModifiedDates]);

  // use the current modified date's old hex to update the grid
  const handlePrev = () => {
    if (canvasModifiedDates && historicalData && colors && currDateIdx !== undefined && selectedCanvasId !== undefined) {
      const modifiedDates = canvasModifiedDates[selectedCanvasId];
      const currDate = modifiedDates[currDateIdx];

      const updatedCells = historicalData[selectedCanvasId][currDate];
      const colorsDeepCopy = _.cloneDeep(colors);

      // change the current cell to the old color
      for (const { row, col, oldHex } of updatedCells) colorsDeepCopy[row][col] = oldHex;

      setColors(colorsDeepCopy);
      setCurrDateIdx(currDateIdx - 1);
    }
  };

  // use the next modified date's new hex to update the grid
  const handleNext = () => {
    if (canvasModifiedDates && historicalData && colors && currDateIdx !== undefined && selectedCanvasId !== undefined) {
      const modifiedDates = canvasModifiedDates[selectedCanvasId];
      const nextDateIdx = currDateIdx + 1;
      const nextDate = modifiedDates[nextDateIdx];

      const updatedCells = historicalData[selectedCanvasId][nextDate];

      const colorsDeepCopy = _.cloneDeep(colors);

      // change the current cell to the new color
      for (const { row, col, newHex } of updatedCells) colorsDeepCopy[row][col] = newHex;

      setColors(colorsDeepCopy);
      setCurrDateIdx(nextDateIdx);
    }
  };

  const onClickCanvasId = (newId: number) => setSelectedCanvasId(newId);

  // NOTE: currDateIdx and selectedCanvasId are numbers, so 0 evaluates
  // to false, therefore need to check them against undefined
  return !isLoading && historicalData && colors && canvasModifiedDates && selectedCanvasId !== undefined && currDateIdx !== undefined ? (
    <main style={{ textAlign: "center" }}>
      <header>
        <Typography variant="h6">List of Canvas IDs:</Typography>
        {Object.keys(historicalData).map((canvasId, idx) => (
          <Button key={idx} onClick={() => onClickCanvasId(Number(canvasId))}>
            {canvasId}
          </Button>
        ))}
      </header>
      <Container maxWidth="md">
        <Grid colourArray={colors} />
      </Container>
      <footer>
        <Typography variant="h6">{canvasModifiedDates[selectedCanvasId][currDateIdx]}</Typography>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {currDateIdx > 0 && (
            <Button variant="contained" onClick={() => handlePrev()}>
              Last Date
            </Button>
          )}
          {currDateIdx < canvasModifiedDates[selectedCanvasId].length - 1 && (
            <Button variant="contained" color="primary" onClick={() => handleNext()}>
              Next Date
            </Button>
          )}
        </div>
      </footer>
    </main>
  ) : (
    // center the progress at the center of the screen
    <CircularProgress />
  );
};

export default HistoricalGrid;
