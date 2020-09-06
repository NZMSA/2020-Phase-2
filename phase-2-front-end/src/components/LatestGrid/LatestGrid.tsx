import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Grid from "../Grid/Grid";
import Information from "../Text/Information";
import CircularProgress from "../CircularProgress/CircularProgress";

import { getArray, modifyArray, ModifyProps } from "../../api/Api";

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);

  useEffect(() => {
    const makeArrayRequest = async () => {
      setColourArray(await getArray());
    }
    makeArrayRequest();
    setInterval(makeArrayRequest, 10000)
  }, []) 

  const modifyColour = async (props: ModifyProps) => {
    await modifyArray(props);
    setColourArray(await getArray());
  };

  if (colourArray.length === 0) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Container fluid>
        <Row style={{ justifyContent: "center" }}>
          <Col md={6}>
            <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
            <div style={{ textAlign: "center", margin: "5% 0" }}>
              <Link to="/history">View Canvas Hisotry</Link>
            </div>
          </Col>
          <Col md={6} style={{ textAlign: "center", minWidth: "600px" }}>
            <Information />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LatestGrid;
