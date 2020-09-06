import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Grid from "../Grid/Grid";
import Information from "../Text/Information";
import CircularProgress from "../CircularProgress/CircularProgress";

import { getArray, modifyArray, ModifyProps } from "../../api/Api";

import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";



const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);
  const [hubConnection, setHubConnection] = useState<HubConnection>();

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_BASE_URL! + "/hub")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
      try {

        connection.on("NewUserConnected", (clientIp: string) => {
          console.log("New user joined the session - IP: " + clientIp);
        });

        connection.on("ColourArrayUpdated", (colorArray: string[][]) => {
          setColourArray(colorArray);
        });

        await connection.start();
        console.log("Successfully connected to signalR hub.");

      } catch (error) {
        console.log(
          "Error establishing connection to signalR hub: " + { error }
        );
      }

      setHubConnection(connection);
    };
    createHubConnection();
  }, []);

  const modifyColour = async (props: ModifyProps) => {
    hubConnection?.invoke("UpdateColourArray", JSON.stringify(props)).catch(err => console.error(err));
  };

  if (colourArray.length === 0) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Container fluid>
        <Row style={{ justifyContent: "center" }}>
          <Col md={6}>
            <Grid
              colourArray={colourArray}
              canEdit={true}
              modifyArray={modifyColour}
            />
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
