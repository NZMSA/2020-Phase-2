import React, { useState, useEffect } from 'react';
import { getArray, modifyArray } from './api/Api';
import Grid from './components/Grid/Grid'
import './App.css';

const App = () => {
  const [colourArray, setColourArray] = useState<any>([])
  const [changeArray, setChangeArray] = useState<boolean>(false);

  
  useEffect(() => {
    setInterval(() => setChangeArray(true), 10000);
  }, [])

  useEffect(() => {
    async function getArrayAsync() {
      if (!colourArray || colourArray.length === 0 || changeArray) {
        const res = await getArray();
        setColourArray(res);
        setChangeArray(false);
      }
    }
    getArrayAsync()
  }, [colourArray, changeArray])

  const modifyColour = async (props: { position: { row: number, col: number }, colour: string }) => {
    await modifyArray(props);
    setChangeArray(true)
  }

  return (
    <div>
      <Grid colourArray={colourArray} modifyArray={modifyColour} />
    </div>
  )
}

export default App;
