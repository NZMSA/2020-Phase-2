import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from "@material-ui/core";

// core components
import Grid from "../Grid/Grid";
import CircularProgress from "../CircularProgress/CircularProgress";

// api
import {  getHistoricalData, getCanvasById } from "../../api/Api";

// utils
import { transformHistoricalData, historicalDataDates, extractColors, ITransformedHistoricalData, IHistoricalDataDates } from "../../utils/gridHistory";

const HistoricalGrid = () => {
  const [currDateIdx, setCurrDateIdx] = useState<number>(-1);
  const [selectedCanvasId, setSelectedCanvasId] = useState<number>(-1);

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
    onLoadComponent();
  }, []);

  // fetch the latest copy of canvas whenever canvasID is updated
  // and reset the date to the latest one of the modified dates
  useEffect(() => {
    (async () => {
      if (selectedCanvasId !== -1 && canvasModifiedDates) {
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
    const modifiedDates = canvasModifiedDates![selectedCanvasId];
    const currDate = modifiedDates[currDateIdx];

    const updatedCells = historicalData![selectedCanvasId][currDate];

    // setColors accepts a callback so we can modify the previous state
    setColors((prevState) => {
      // change the current cell to the old color
      for (const { row, col, oldHex } of updatedCells) prevState![row][col] = oldHex;

      return prevState;
    });

    setCurrDateIdx(currDateIdx - 1);
  };

  // use the next modified date's new hex to update the grid
  const handleNext = () => {
    const modifiedDates = canvasModifiedDates![selectedCanvasId];
    // slight difference than above, we increment the index before we update the colors
    // because we want to get the new version of the canvas on the next date
    const nextDateIdx = currDateIdx + 1;
    const nextDate = modifiedDates[nextDateIdx];

    const updatedCells = historicalData![selectedCanvasId][nextDate];

    setColors((prevState) => {
      // change the cell to the new color
      for (const { row, col, newHex } of updatedCells) prevState![row][col] = newHex;

      return prevState;
    });

    setCurrDateIdx(nextDateIdx);
  };

  const onClickCanvasId = (newId: number) => setSelectedCanvasId(newId);

  const noPrev = () => currDateIdx === 0;
  const noNext = () => currDateIdx === canvasModifiedDates![selectedCanvasId].length - 1;

  return historicalData && colors && canvasModifiedDates ? (
    <main style={{ textAlign: "center" }}>
      <header>
        <Typography variant='h6'>List of Canvas IDs:</Typography>
        {Object.keys(historicalData).map((canvasId, idx) => (
          <Button key={idx} onClick={() => onClickCanvasId(Number(canvasId))}>
            {canvasId}
          </Button>
        ))}
      </header>
      <Container maxWidth='md'>
        <Grid colourArray={colors} />
      </Container>
      <footer>
        <Typography variant="h6">{canvasModifiedDates[selectedCanvasId][currDateIdx]}</Typography>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {/* disable the button if it is the first date */}
          <Button disabled={noPrev()} variant="contained" onClick={() => handlePrev()}>
            Last Date
          </Button>
          {/* disable the button if it is the last date */}
          <Button disabled={noNext()} variant="contained" color="primary" onClick={() => handleNext()}>
            Next Date
          </Button>
        </div>
      </footer>
    </main>
  ) : (
    <CircularProgress />
  );
};

export default HistoricalGrid;
