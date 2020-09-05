# Getting started

Make sure you have npm installed, and updated Run: 

If not follow this to [install](https://www.npmjs.com/get-npm)

```sh
[sudo] npm i -g npm to update  
```

This quick start guide will teach you how to wire up TypeScript with [React](http://facebook.github.io/react/).



We'll use the [create-react-app](https://github.com/facebookincubator/create-react-app) tool to quickly get set up.

We assume that you're already using [Node.js](https://nodejs.org/) with [npm](https://www.npmjs.com/).
You may also want to get a sense of [the basics with React](https://facebook.github.io/react/docs/hello-world.html).

# Create-react-app

We're going to use the create-react-app because it sets some useful tools and canonical defaults for React projects.
This is just a command-line utility to scaffold out new React projects.

# Create our new project

We'll create a new project called `my-app`:

```shell
npx create-react-app my-app --template typescript --use-npm
```

--template typescript tells create react app to use the typescript template for the react project.

At this point, your project layout should look like the following:

```text
my-app/
├─ .git/
├─ node_modules/
├─ public/
├─ src/
│  └─ ...
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ package-lock.json
```

Of note:

* `tsconfig.json` contains TypeScript-specific options for our project.
* `package.json` contains our dependencies, as well as some shortcuts for commands we'd like to run for testing, previewing, and deploying our app.
* `public` contains static assets like the HTML page we're planning to deploy to, or images. You can delete any file in this folder apart from `index.html`.
* `src` contains our TypeScript and CSS code. `index.tsx` is the entry-point for our file, and is mandatory.

# Running the project

Running the project is as simple as running in the console which can be opened by pressing ctrl + ` or going into View in your menu tab and clicking on terminal. 

```sh
npm run start
```

This runs the `start` script specified in our `package.json`, and will spawn off a server which reloads the page as we save our files.
Typically the server runs at `http://localhost:3000`, but should be automatically opened for you.

Every time you save a change to your application it should be automatically rebuilt. This helps us by allowing us to quickly see changes and therefore iterate on a more frequent basis.

# Setting up React Router

 React router allows us to have different components being rendered based of the url. To start lets install react router the command to do this run

```
npm install react-router-dom
```
React router dom is the web version of react router.

Lets start by importing the required items out of react router dom in `App.tsx`. The components that we will be using is `BrowserRouter, Switch, Route` to import these you need to add the following line

```js
import { BrowserRouter, Switch, Route } from 'react-router-dom';
```  

We will then setup our app component with the router and set our main page being the LatestGrid component which we will create next. For this update App.tsx to be the following.

```tsx
import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import LatestGrid from "./components/LatestGrid/LatestGrid";

import "./App.css";

const App = () => {
  return <div>
    <BrowserRouter>
      <Switch>
        <Route path='/' component={LatestGrid} />
      </Switch>
    </BrowserRouter>
  </div>
};

export default App;

```

To learn about React Router in more detail please refer to [react-routers website](https://reactrouter.com/web/guides/quick-start).

# Latest Grid

## Creating API Requests
Now lets create the latest grid component which will manage the passing the required props for the game. The latest grid component will be responsible for making the API request to get the grid component. Lets start by creating a new api folder with a file inside called `Api.ts` this will have the path of `src/api/Api.ts`. We will use this file to store all of the API requests in one location.

In `API.ts` lets set it up to allow local development and deployment to do this we can use the NODE_ENV environment variable to determine whether we are in production or development. We will use this to set the api url. Finally we will use fetch to make the two reqeusts that are required to power the game being getting the array and modifying the array. We will use these to pass into our Grid component when we make it.

```ts
const API_BASE_URL =
  process.env.NODE_ENV === "development" ? "https://localhost:44301/api/" : "https://msa-2020-api.azurewebsites.net/api/";

const CANVAS_API_URL = API_BASE_URL + "Canvas/";;

export const getArray = async () => {
  let response = await fetch(CANVAS_API_URL + "GetCanvas", {
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => JSON.parse(res));
  return response;
};

interface ModifyProps {
  position: { row: number; col: number };
  colour: string;
}

export const modifyArray = async ({ position: { row, col }, colour }: ModifyProps) => {
  const body = JSON.stringify({ row: row, column: col, hex: colour });
  await fetch(CANVAS_API_URL + "UpdateCell", {
    body,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    method: "PUT",
  });
};
```

## Making the Component
The component for the latest grid will only render the Grid component or a spinner if the API request isnt completed. It will also be setup to poll the board so we can see changes other people have made. We will want to install material-ui so we can make use of their spinner component. To do this run 
```
npm install @material-ui/core
``` 
### Spinner Component
We will setup a resuable spinner component make a new folder in components called `CircularProgress` and add a file called `CircularProgress.tsx`. This will just be cenetering the circular progress from material-ui. 

```tsx
import React from "react";
import { CircularProgress as Progress } from "@material-ui/core";

const CircularProgress = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
    <Progress disableShrink />
  </div>
);

export default CircularProgress;
```

Next lets go and create a file for this component. To do this lets create a folder for our components and then a folder for the LatestGrid. Inside the LatestGrid folder create a new file called `LatestGrid.tsx`. We will be making use of useEffect which is a react hook that is called whenever change has occured in the array of variables eg. `useEffect(() => {...}, [isLoading, colourArray])` will run the function when isLoading or colourArray changes.

The code for LatestGrid is below

```tsx
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

```

The first of the useEffects looks at the colourArray and updates isLoading when the colourArray has elements in it this will then stop rendering the spinner and render our created grid. 

The next useEffect sets up the polling and makes the initial request for our colourArray since it takes an empty array on the second arguement it only runs once on the render. SetInterval calls the given function every x ms which is 10 seconds in our case.

Finally we have our modifyColour function which will first make the call to the api and once it has finished reload our colourArray so we can see the relevant change.

# Creating the Grid Component

Lets create a reusable grid component that will render the grid of colours that will be used to display our game. Start by creating a new folder in the components folder for the Grid and inside of it make a file called `Grid.tsx` 


The inputs we will be needing are the following props colourArray which will provide the grid to render, modifyArray which is a function that allows you to modify the grid this is an optional prop and canEdit to enable the editing of a grid.

```ts
interface IGridProps {
  colourArray: string[][];
  modifyArray?: (props: { position: { row: number; col: number }; colour: string }) => void;
  canEdit?: boolean;
}
```
To render the grid we are going to make divs with each div being assigned to a specific colour. To do this we first need to calculate the size of each of the divs in our grid. We want each grid to be square with a slight border around it to allow people to distinguish between each of the colours. The calculation of this will be the total width which we will use as 600px divided by the number of divs we want in the row which is 32. Next we need to remove 1 px from each side so we minus 2.

We can put this into code

```tsx
import React, { useState } from "react";


interface IGridProps {
  colourArray: string[][];
  modifyArray?: (props: { position: { row: number; col: number }; colour: string }) => void;
  canEdit?: boolean;
}

const Grid = (props: IGridProps) => {
  const singleCellSize = (600 / 32) - 2;
  const cells = [];
  for (var i = 0; i < props.colourArray.length; i++) {
    for (var j = 0; j < props.colourArray[0].length; j++) {
      cells.push(
        <div
          key={i + "," + j}
          className="cell"
          style={{
            height: singleCellSize,
            width: singleCellSize,
            backgroundColor: props.colourArray[i][j],
          }}
        />
      );
    }
  }
  return (
    <>
      <div className="grid">{cells}</div>
    </>
  );
};

export default Grid;
```
This does the looping over each colour in our colours array and renders the colour in the div.

Now we want to add the ability to see which element our mouse is over. To do this we will be adjusting the brightnesss of the colour. We can use onMouseEnter and onMouseLeave along with the brightness css tag to achieve this. Add the following functions within the Grid and then pass each of them to the generated divs adding the filter onMouseEnter and removing on onMouseLeave.

```tsx
  const addFilter = (e: any) => {
    e.target.style.filter = "brightness(0.8)";
  };
  const removeFilter = (e: any) => {
    e.target.style.filter = "brightness(1)";
  };
```

The div should look like the following.

```tsx
        <div
          key={i + "," + j}
          className="cell"
          style={{
            height: singleCellSize,
            width: singleCellSize,
            backgroundColor: props.colourArray[i][j],
          }}
          onMouseEnter={addFilter}
          onMouseLeave={removeFilter}
          />
```
Next we will want setup the ability to pick a cell and show a colour picker to allow people to select a new colour for the item on the grid. To do this we are going to need to add a function to handle the onClick. To call our modify array we need to store some information about where it is in the array to do this we can add attributes to the divs and use them when the click occurs. Finally we will store the selected element and pass it into a modal that will be used to show our colour picker. This results in our grid component being updated to the following.

```tsx
import React, { useState } from "react";
import { Modal } from "@material-ui/core";
import ColorPicker from "../ColorPicker/ColorPicker";

interface IGridProps {
  colourArray: string[][];
  modifyArray?: (props: { position: { row: number; col: number }; colour: string }) => void;
  canEdit?: boolean;
}

const GridComponent = (props: IGridProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState({ row: -1, col: -1, colour: "#ffffff" });
  const singleCellSize = 600 / 32 - 2;
  const cells = [];
  const addFilter = (e: any) => {
    e.target.style.filter = "brightness(0.8)";
  };
  const removeFilter = (e: any) => {
    e.target.style.filter = "brightness(1)";
  };
  for (var i = 0; i < props.colourArray.length; i++) {
    for (var j = 0; j < props.colourArray[0].length; j++) {
      cells.push(
        <div
          key={i + "," + j}
          data-row={i}
          data-col={j}
          data-colour={props.colourArray[i][j]}
          className="cell"
          style={{
            height: singleCellSize,
            width: singleCellSize,
            backgroundColor: props.colourArray[i][j],
          }}
          onMouseEnter={addFilter}
          onMouseLeave={removeFilter}
          onClick={(event) => {
            const dataRow = event.currentTarget.getAttribute("data-row");
            const dataCol = event.currentTarget.getAttribute("data-col");
            const colour = event.currentTarget.getAttribute("data-colour");
            if (!dataRow || !dataCol || !colour) {
              return;
            }
            const row = parseInt(dataRow, 10);
            const col = parseInt(dataCol, 10);
            setSelectedElement({ row, col, colour });
            setModalOpen(true);
          }}
        />
      );
    }
  }
  return (
    <>
      <div className="grid">{cells}</div>
      {/* only render the color picker if it is editable */}
      {props.canEdit && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ColorPicker selectedElement={selectedElement} modifyArray={props.modifyArray!} closeModal={() => setModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default GridComponent;
```

# Creating the Colour Picker
The final step for the base game is to create the colour picker which will be opened in the modal this will take in our modifyArray function as well as the selected element. We will use the colour to preload our colour picker. Here we will make use of react-color which will be used to supply the actual colour picker itself. To install run the following

```
npm i react-color
npm i @types/react-color
```

We will be using material UI paper along with the SketchPicker from react colour. We will also be providing a button to submit once they are satisfied with the selection of colours. When the click the button we will call the provided function from props with the selected element and the new colour and then we will close the modal using the function provided. 

```tsx
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Button, Paper } from '@material-ui/core';

interface PickerProps {
    selectedElement: { row: number, col: number, colour:string},
    modifyArray: (props: { position: { row: number, col: number }, colour: string }) => void
    closeModal: () => void
}

export default (props: PickerProps) => {
    const [background, setBackground] = useState(props.selectedElement.colour)

    const handleChangeComplete = (color: any) => {
        setBackground(color.hex)
    };

    return (
        <Paper style={{
            width: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 25
        }}>
            <SketchPicker
                color={background}
                onChangeComplete={handleChangeComplete}
                disableAlpha={true}
            />
            <Button style={{ marginTop: 10 }} variant="contained" color="primary"
                onClick={() => {
                    props.modifyArray({ position: { row: props.selectedElement.row, col: props.selectedElement.col}, colour: background });
                    props.closeModal();
                }}>
                Confirm Selection
            </Button>
        </Paper >
    );
}
```
This will complete the basic game.

## Historical Grid

### What is it

For every canvas (i.e. a canvas with an unique id), we can see different states of it on different dates. 

(Note: there is no much frontend styling involved with this component, as we are using the existing `Grid` component. Rather, it focuses more on logic and data manipulation)

![image](https://media.giphy.com/media/TgxwdeqVb6CLEx5KzC/giphy.gif)


Main things to consider when creating the component:

- What is the available data we can get from the **backend API**?
- What are the **states** we need for the component?
- How do we manipulate and **structure** the data?

### API

We can fetch the data with the following types `ICanvasData`, `IColorData`, `IHistoricalData`, and they are defined in `Api.ts`.

(Note: find more information about why it is structured that way in the backend API documentation)

### States

We have defined the following states in `HistoricalGrid.tsx`: 

- `currDateIdx`: the index of the selected modified date, of the current canvas.

- `selectedCanvasId`: the id of the current selected canvas.

- `colors`: the color array of the grid which we use to paint.

- `historicalData`: has type `ITransformedHistoricalData` defined in `gridHistory.ts`.

- `canvasModifiedDates`: has type `IHistoricalDataDates` defined in `gridHistory.ts`.

Let's discuss why we want to use these states. We need to understand the actions we will perform on the components.

1. For each canvas with an unique ID, we want to see the state the grid was at on the previous date after clicking the `LAST DATE` button. Similarly, we want to color of the grid on the next date if there exists a next date after clicking the `NEXT DATE` button. This tells us we want to store an array of the modified dates of each unique canvas. Hence `canvasModifiedDates`. We need `currDateIdx` to help us keep track of which date of the current selected canvas we are in.

2. When we select a different canvas ID, if any, the grid will render the colors of the latest modified date of that canvas. Hence `selectedCanvasId`.

3. Finally and most importantly, we want to know what colors the cells were updated from and to in each modified date of the canvas. This tells us we need to access such information based on the canvas ID and modified date. Hence we use `historicalData` with the type `ITransformedHistoricalData`.

### Data Manipulation

To process the data, we have defined 5 functions in `gridHistory.ts`:

- `getAllColorData`: use `Promise.all` to get an array of resolved outputs. It is faster than doing an individual API call to get the color data during each iteration of the for loop.

- `deserialzeHistoricalData`: first it parses the respective values from `string` to `JSON`, then extract and output the relevant keys.

- `transformHistoricalData`: returns a promise with a type of `ITransformedHistoricalData`. The motivation of the structure of this type is discussed in the `States` section above.

- `historicalDataDates`: returns a value with type `IHistoricalDataDates`.

- `extractColors`: returns a 2D array with the Hex color in each cell. During each iteration of the nested loop, `gridSize * r + c` gives us the respective position in the 1D array `sortedColorData`. (Note: playnig with an example is probably the best way to understand why)

Hope the above helps you to understand the `HistoricalGrid` component! If in doubt, feel free to reach out to 0alexzhong0@gmail.com. Always keen to help and explain, xD.
