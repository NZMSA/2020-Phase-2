import React, { useState, useEffect } from "react";
import { getArray, modifyArray } from '../../api/Api';
import Grid from "../Grid/Grid";

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<any>([]);
  const [changeArray, setChangeArray] = useState<boolean>(false);

  useEffect(() => {
    async function getArrayAsync() {
      if (!colourArray || colourArray.length === 0 || changeArray) {
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

  return <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />;
};

export default LatestGrid;
