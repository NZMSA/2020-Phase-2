import React, { useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import Grid from "../Grid/Grid";
import CircularProgress from '../CircularProgress/CircularProgress'
import { connect } from "http2";

const LatestGrid = () => {
  const [colourArray, setColourArray] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [hubConnection, setHubConnection] = useState<HubConnection>();

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_BASE_URL! + "/hub")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
      try {
        connection.on("UpdateColorArray", (colorArray) => {
          setColourArray(colorArray);
        });

        connection.on("NewUserConnection", (clientIp: string) => {
          console.log("New user joined the session - IP: " + clientIp);
        });

        connection.onreconnecting(() => {
          setIsLoading(true);
          console.log("Reconnecting...");
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

  useEffect(() => {
    if (colourArray.length > 0 && isLoading) setIsLoading(false)
  }, [isLoading, colourArray])

  const modifyColour = async (props: { position: { row: number; col: number }; colour: string }) => {
    hubConnection?.invoke("UpdateColourArray", JSON.stringify(props)).catch(err => console.error(err));
  };

  return isLoading ? <CircularProgress /> : <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
};

export default LatestGrid;
