import React, { useState, useEffect } from "react";
import { getArray, modifyArray } from '../../api/Api';

import Grid from "../Grid/Grid";
import CircularProgress from '../CircularProgress/CircularProgress'

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (colourArray.length > 0 && isLoading) setIsLoading(false)
  }, [isLoading, colourArray])

  useEffect(() => {
    const makeArrayRequest = async () => {
      setColourArray(await getArray());
    }
    makeArrayRequest();
    setInterval(makeArrayRequest, 10000)
  }, [])

  const modifyColour = async (props: { position: { row: number; col: number }; colour: string }) => {
    await modifyArray(props);
    setColourArray(await getArray());
  };

  return isLoading ? <CircularProgress /> : <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
};

export default LatestGrid;
