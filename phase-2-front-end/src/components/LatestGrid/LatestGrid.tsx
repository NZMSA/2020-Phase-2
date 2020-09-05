import React, { useState, useEffect } from "react";
import { getArray, modifyArray } from '../../api/Api';

import Grid from "../Grid/Grid";
import CircularProgress from '../CircularProgress/CircularProgress';
import Info from '../Text/Information';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

  if(isLoading){
    return <CircularProgress/>
  }
  else{
    return (
      <div>
        <Container fluid>
        <Row style={{justifyContent:"center"}}>
          <Col md={6}>
            <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
          </Col>
          <Col md={6} style={{textAlign:"center", minWidth:"600px"}}>
            <Info/>
          </Col>
        </Row>
        </Container>
      </div>
    )
  }
};

export default LatestGrid;
