import React, { useState, useEffect } from "react";
import { getArray, modifyArray } from '../../api/Api';

import Grid from "../Grid/Grid";
import CircularProgress from '../CircularProgress/CircularProgress'

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);
  const [changeArray, setChangeArray] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (colourArray.length > 0 && isLoading) setIsLoading(false)
  }, [isLoading, colourArray])
  
  useEffect(() => {
    async function getArrayAsync() {
      if (colourArray.length === 0 || changeArray) {
        const res = await getArray();
        setColourArray(res);
        setChangeArray(false);
      }
    }

    getArrayAsync();
  }, [colourArray, changeArray]);

  const modifyColour = async (props: { position: { row: number; col: number }; colour: string }) => {
    await modifyArray(props);
    setChangeArray(true);
  };

  return isLoading ? <CircularProgress /> : <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
};

export default LatestGrid;
