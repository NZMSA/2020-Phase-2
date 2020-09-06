import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Grid from "../Grid/Grid";
import Information from "../Text/Information";
import CircularProgress from "../CircularProgress/CircularProgress";

import { getArray, modifyArray } from "../../api/Api";

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);
  const [changeArray, setChangeArray] = useState<boolean>(false);

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

  if (colourArray.length === 0) {
    return <CircularProgress />;
  } else {
    return (
      <div>
        <Container fluid>
          <Row style={{ justifyContent: "center" }}>
            <Col md={6}>
              <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
              <div style={{ textAlign: "center", margin: "5% 0" }}>
                <Link to="/history">View Canvas History</Link>
              </div>
            </Col>
            <Col md={6} style={{ textAlign: "center", minWidth: "600px" }}>
              <Information />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
};

export default LatestGrid;
