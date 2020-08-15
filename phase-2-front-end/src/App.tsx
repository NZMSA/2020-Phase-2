import React, { useState, useEffect } from 'react';
import { getArray, modifyArray } from './api/Api';
import Grid from './components/Grid/Grid'
import './App.css';

const App = () => {
  const [colourArray, setColourArray] = useState<any>([])
  const [changeArray, setChangeArray] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>(null);
  
  useEffect(() => {
    if(!timer){
      setTimer(setInterval(() => setChangeArray(true), 10000));
    }
  }, [timer, changeArray])

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

  const modifyColour = async (props: { position: { i: number, j: number }, colour: string }) => {
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
