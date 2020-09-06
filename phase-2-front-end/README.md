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

What is it: for every canva (i.e. a canva with an unique id), we can see different states of it on different dates.




# Styling
## HeaderComponent
We are now going to style our web page. In web app development it is important to have responsive styling so that the application can be viewed on all screen sizes to maintain a high degree of usability.

First we will add a header header component to this baron grid.
```javascript
render(){
        return(
            <div className="header">
            <h1>
                <span id="P-char" style={{color: this.updateColours()}}>P</span>
                <span id="I-char" style={{color: this.updateColours()}}>i</span>
                <span id="X-char" style={{color: this.updateColours()}}>x</span>
                <span id="E-char" style={{color: this.updateColours()}}>e</span>
                <span id="L-char" style={{color: this.updateColours()}}>l</span>
                <span id="S-char" style={{color: this.updateColours()}}>s</span>
                <img src={logo} style={{display:"inline", height:"35px", verticalAlign:"middle", margin:"20px"}}/>
            </h1>
        </div>
        )
    }
```
We will animate each letter to randomly change into any one of the colours in the rainbow (ROYGBIV).
Each character will derive its colour from the updateColours() function, which generates a random integer to index into the colours array.
`<span id="P-char" style={{color: this.updateColours()}}>P</span>`
Display inline will cause the purplePixel gif to be displayed on the same same line as all the spans in our `h1` tag.
The vertical align will also place the gif in the middle of the header component in terms of height. Margin is added to to the `img` to create distance between the title and the image itself.
`<img src={logo} style={{display:"inline", height:"35px", verticalAlign:"middle", margin:"20px"}}/>`

Once the header component is rendered (does a mount) it will the `refresh()` to be called every 3000 milliseconds.
```javascript
 componentDidMount() {
    setInterval(this.refresh.bind(this), 3000);
  }
  
  refresh() {
    this.setState({ refresh: 1 });
  }
  
    updateColours() {
        let colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo'];
        return colours[(Math.random() * colours.length) >> 0];
    }
```
This assigns the integer 1 to the refresh state using setState(), which causes the component to be remounted. Thus calling `refresh()` 3000 milliseconds later. Every time the component is rendered, each letter will calculate it colour by calling the `updateColours` function.
```CSS
.header{
    text-align: center;
    background: #F8F8F8;
    margin-bottom: 20px;
    padding: 15px;
    min-width: 600px;
}
```

We added an off gray to make the header visible compared to the main body content. Padding and margins are added to seperate the header from the body and add thickness to the header. A `min-width` of 600px is added so that the header will always be as wide as the header.


## FooterComponent
We will make a simple footer component to indicate ownership.
```javascript
const Footer = () => <div className="footer">&copy; All rights reserved MSA 2020.</div>;
```
```CSS
.footer{
    padding: 50px;
    text-align: center;
}
```
Padding is added to seperate the the footer from the main body components and the text is aligned in the center of the element.

## Responsive Information
The ReactPlayer component is used to embed a YouTube video on to the information column. The library is downloaded using `npm install react-player`. We want the video to be as wide as the column itself.
```javascript
  <div id="info">
    <p>
      Pixels is inspired by the <a href="https://www.reddit.com/r/place/">/r/place</a> subreddit. To get started select a pixel on the canvas and select a colour and press confirm. Now your edit is visible to everyone!
    </p>
    <ReactPlayer url="https://www.youtube.com/watch?v=XnRCZK3KjUY&t=1s" width="auto"></ReactPlayer>
  </div>
```

To make the web app responsive we will use the react bootstrap library. First we must install the library using `npm install react-bootstrap bootstrap`. We must also link the following style sheet in `index.html`.
```HTML
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
```
Bootstrap has a grid system where each row is divided into 12 columns. We are able to specify how many columns each component occupies. Since we have a grid and information component we will divide the page into two "columns".

![alt text](https://miro.medium.com/max/700/0*z2Lkt066SfPxfWqM.png)

Hence, we have one row `<Row>` to the components on the same level and we use `<Col md={6}>` to enclose each component to divide them into two seperate components. The information column has a `minWidth: 600px` to match the width of the grid itself. Once, the screen width break point is reached it will cause our second column to be shifted onto a new line and stack on top of each other.

```javascript
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
```
Since bootstrap has a default style of `border box` in `box-sizing`. Therefore, we must convert it back to default `div` property of `content-box` or our grid will slightly overflow underneath
We must overide some default media enquiries which come with the default bootstrap library to achieve our desired responsiveness as the grid is set at `600px`, causing the columns to overflow.

```CSS
@media (min-width: 768px){
    .col-md-6{
        max-width: none !important;
    }
}
```
When ever the screen size is detected to be less than 768px wide we remove the `maxWidth` property so that the information is centrally aligned with the grid itself and does not adhere to the default `50%` property. The `!important` keyword is used to indicate that this style should take precedent over all other styling.

```CSS
#info{
    margin: 0 12.5%;
}
``` 
Margin is added to the information div so the information is lifted off the right and is centered along with the column we created.









