import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Button, Paper } from '@material-ui/core';

interface PickerProps {
    selectedElement: { i: number, j: number, colour:string},
    modifyArray: (props: { position: { i: number, j: number }, colour: string }) => void
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
                    props.modifyArray({ position: { i: props.selectedElement.i, j: props.selectedElement.j}, colour: background });
                    props.closeModal();
                }}>
                Confirm Selection
            </Button>
        </Paper >
    );
}