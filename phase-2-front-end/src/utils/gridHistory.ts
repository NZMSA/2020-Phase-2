import _ from "lodash";
import moment from "moment";

import { IHistoricalData, ITransformedHistoricalData, IUpdatedCell, getColorDataById, ICanvasData, IHistoricalDataDates } from "../api/Api";

const DATE_FORMAT = "YYYY-MM-DD";

// all the dates value in the array are sorted from earliest to the latest already
export const transformHistoricalData = async (historicalDataArray: IHistoricalData[]): Promise<ITransformedHistoricalData> => {
  const result: ITransformedHistoricalData = {};

  for (const histData of historicalDataArray) {
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
  }

  return result;
};

export const historicalDataDates = (histData: ITransformedHistoricalData): IHistoricalDataDates => {
  const result: IHistoricalDataDates = {};

  for (const key of Object.keys(histData)) {
    const canvasID = Number(key);
    const canvasIDModifiedDates = Object.keys(histData[canvasID]);
    result[canvasID] = canvasIDModifiedDates;
  }

  return result;
};

export const extractColors = (canvas: ICanvasData): string[][] => {
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
