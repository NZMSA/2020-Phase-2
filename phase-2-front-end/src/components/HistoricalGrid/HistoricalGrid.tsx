import React, { useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";

import Grid from "../Grid/Grid";
import { Button, Typography, Container } from "@material-ui/core";

// NOTE: nitpick on the model field naming, should change
// oldValues, newValues and keyValues to singular instead

// same types as defined in backend/Models/HistoricalData.cs
interface IHistoricalData {
  id: number;
  // NOTE: assuming the tableName can only be ColorData
  // Name of table that is changed
  tableName: string;
  // Time when SaveChangesAsync() is called in UpdateCell()
  dateTime: string;
  // Id of the item changed
  keyValues: string; // "{\"ColorDataID\":1027}"
  // Old value of the item changed
  oldValues: string; // "{\"Hex\":\"#FFFFFF\"}"
  // New value of the item changed
  newValues: string; // "{\"Hex\":\"#eb4034\"}"
}

// same types as defined in backend/Models/ColorData.cs
interface IColorData {
  colorDataID: number;
  rowIndex: number;
  columnIndex: number;
  hex: string;
  canvasID: number;
}

interface IUpdatedCell {
  row: number;
  col: number;
  oldHex: string;
  newHex: string;
}

// TODO: explain why I want to structure the data like this
interface ITransformedHistoricalData {
  [canvasID: number]: { [date: string]: IUpdatedCell[] };
}

const getHistoricalData = async (): Promise<IHistoricalData[]> => {
  const placeHolder: IHistoricalData[] = [
    {
      id: 1,
      tableName: "ColorData",
      dateTime: "2020-08-23T08:26:49.5546456",
      keyValues: '{"ColorDataID":1026}',
      oldValues: '{"Hex":"#FFFFFF"}',
      newValues: '{"Hex":"#32a852"}',
    },
    {
      id: 2,
      tableName: "ColorData",
      dateTime: "2020-08-23T08:29:40.7471006",
      keyValues: '{"ColorDataID":1026}',
      oldValues: '{"Hex":"#32a852"}',
      newValues: '{"Hex":"#eb4034"}',
    },
  ];

  return placeHolder;
};

// TODO: complete the api call
const getColorDataById = async (id: number): Promise<IColorData> => {
  const placeHolder: IColorData = {
    colorDataID: 0,
    rowIndex: 0,
    columnIndex: 0,
    hex: "string",
    canvasID: 0,
  };

  return placeHolder;
};

interface ICanvasData {
  canvasID: number;
  name: string | null;
  score: number;
  colorData: IColorData[];
}

const getCanvasById = async (id: number): Promise<ICanvasData> => {
  // NOTE: there will 32x32 datapoints in the colorData array

  return {
    canvasID: 1,
    name: null,
    score: 0,
    colorData: [
      {
        colorDataID: 1,
        rowIndex: 0,
        columnIndex: 0,
        hex: "#cffc03",
        canvasID: 1,
      },
      {
        colorDataID: 2,
        rowIndex: 21,
        columnIndex: 2,
        hex: "#FFFFFF",
        canvasID: 1,
      },
    ],
  };
};

const DATE_FORMAT = "YYYY-MM-DD";

// all the dates value in the array are sorted from earliest to the latest already
const transformHistoricalData = (historicalDataArray: IHistoricalData[]): ITransformedHistoricalData => {
  const result: ITransformedHistoricalData = {};

  historicalDataArray.forEach(async (histData) => {
    /**
     * NOTE:
     * - histData.keyValues may not be a valid value to transform to a number from
     * - the tableName may not necessarily be ColorData all the time
     */
    const { dateTime, keyValues, oldValues, newValues } = histData;

    // deserialization
    const oldHex = JSON.parse(oldValues).Hex;
    const newHex = JSON.parse(newValues).Hex;
    const deserializedKey = JSON.parse(keyValues).ColorDataID;

    const colorDataId = Number(deserializedKey);
    const colorData = await getColorDataById(colorDataId);
    const { rowIndex, columnIndex, canvasID } = colorData;

    // transform from 2020-08-25T12:08:51.026Z to 2020-08-25
    const localDateValue = moment.utc(dateTime).local().format(DATE_FORMAT);

    // initializations
    if (!result[canvasID]) result[canvasID] = {};
    if (!result[canvasID][localDateValue]) result[canvasID][localDateValue] = [];

    // format cell data
    const updatedCell: IUpdatedCell = { row: rowIndex, col: columnIndex, oldHex, newHex };
    result[canvasID][localDateValue].push(updatedCell);
  });

  return result;
};

// TODO: explain why this is necessary
interface IHistoricalDataDates {
  [canvasID: number]: string[];
}

const historicalDataDates = (histData: ITransformedHistoricalData): IHistoricalDataDates => {
  const result: IHistoricalDataDates = {};

  Object.keys(histData).forEach((key) => {
    const canvasID = Number(key);
    const canvasIDModifiedDates = Object.keys(histData[canvasID]);
    result[canvasID] = canvasIDModifiedDates;
  });

  return result;
};

const extractColors = (canvas: ICanvasData): string[][] => {
  // assume it is a square grid
  const gridSize = Math.sqrt(canvas.colorData.length);
  // init a gridSize by gridSize array filled with '' strings
  const colors: string[][] = [...Array(gridSize)].map((_) => Array(gridSize).fill(""));

  // first sort by row index, then by the column index
  const sortedColorData = _.orderBy(canvas.colorData, ["rowIndex", "columnIndex"]);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      colors[r][c] = sortedColorData[gridSize * r + c].hex;
    }
  }
  return colors;
};

// TODO: restructure the code and put them in a separate folder and files
// NOTE: the current method of processing the data and rendering the component is very inefficient

// TODO: explain the thought process
const HistoricalGrid = () => {
  const [colors, setColors] = useState<string[][]>([]);
  // assuming the canvasID starts from 1
  const [selectedCanvasId, setSelectedCanvasId] = useState(1);
  const [currDateIdx, setCurrDateIdx] = useState(0);
  const [historicalData, setHisotricalData] = useState<ITransformedHistoricalData>({});
  const [canvasModifiedDates, setCanvasModifiedDates] = useState<IHistoricalDataDates>({});

  const onLoadComponent = async () => {
    // fectch and transform and historical data
    const hist = await getHistoricalData();
    const transformedHistData = transformHistoricalData(hist);
    setHisotricalData(transformedHistData);

    // set the modified dates of each canvas
    const modifiedDates = historicalDataDates(transformedHistData);
    setCanvasModifiedDates(modifiedDates);

    // choosing the first one in the dictionary due to personal preference
    const firstCanvasIdKey = Number(Object.keys(transformHistoricalData)[0]);
    setSelectedCanvasId(firstCanvasIdKey);
  };

  useEffect(() => {
    // TODO: give it a loading animation
    onLoadComponent();
  }, []);

  // fetch the latest copy of canvas whenever canvasID is updated
  // and reset the date to the latest one of the modified dates
  useEffect(() => {
    (async () => {
      const canvas = await getCanvasById(selectedCanvasId);
      const colorsArray = extractColors(canvas);
      const latestModifiedDates = canvasModifiedDates[canvas.canvasID];

      setCurrDateIdx(latestModifiedDates.length - 1);
      setColors(colorsArray);
    })();
  }, [selectedCanvasId]);

  // TODO: finish these 2 functions
  const handlePrev = () => {
    const modifiedDates = canvasModifiedDates[selectedCanvasId];
    // decrement the index and wrap it inside the length
    const prevDateIdx = (currDateIdx - 1) % modifiedDates.length;
    const prevDate = modifiedDates[prevDateIdx];
    const updatedCells = historicalData[selectedCanvasId][prevDate];

    const colorsDeepCopy = _.cloneDeep(colors);
    updatedCells.forEach((cell) => {
      // change the current cell to the old color
      const { row, col, oldHex } = cell;
      colorsDeepCopy[row][col] = oldHex;
    });

    setColors(colorsDeepCopy);
    setCurrDateIdx(prevDateIdx);
  };

  const handleNext = () => {
    const modifiedDates = canvasModifiedDates[selectedCanvasId];
    // increment the index and wrap it inside the length
    const nextDateIdx = (currDateIdx + 1) % modifiedDates.length;
    const nextDate = modifiedDates[nextDateIdx];
    const updatedCells = historicalData[selectedCanvasId][nextDate];

    const colorsDeepCopy = _.cloneDeep(colors);
    updatedCells.forEach((cell) => {
      // change the current cell to the new color
      const { row, col, newHex } = cell;
      colorsDeepCopy[row][col] = newHex;
    });

    setColors(colorsDeepCopy);
    setCurrDateIdx(nextDateIdx);
  };

  const onClickCanvasId = (newId: number) => setSelectedCanvasId(newId);

  return (
    <React.Fragment>
      <header>
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
        <Typography variant="h4">{canvasModifiedDates[selectedCanvasId][currDateIdx]}</Typography>
        <Button variant="contained" onClick={() => handlePrev()}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleNext()}>
          Next
        </Button>
      </footer>
    </React.Fragment>
  );
};

export default HistoricalGrid;
