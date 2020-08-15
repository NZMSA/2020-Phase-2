import React, { useState } from 'react';
import { Modal } from '@material-ui/core';
import ColorPicker from '../ColorPicker/ColorPicker';

interface IGridProps {
    colourArray: string[][]
    modifyArray: (props: { position: { i: number, j: number }, colour: string }) => void
}

const GridComponent = (props: IGridProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState({ i: -1, j: -1, colour: "#ffffff" });
    const singleCellSize = (600 / 32) - 2;
    const cells = [];
    const addFilter = (e: any) => {
        e.target.style.filter = "brightness(0.8)"
    }
    const removeFilter = (e: any) => {
        e.target.style.filter = "brightness(1)"
    }
    for (var i = 0; i < props.colourArray.length; i++) {
        for (var j = 0; j < props.colourArray[0].length; j++) {
            cells.push(
                <div
                    key={i + "," + j}
                    data-i={i}
                    data-j={j}
                    data-colour={props.colourArray[i][j]}
                    className= "cell"
                    style={{
                        height: singleCellSize,
                        width: singleCellSize,
                        backgroundColor: props.colourArray[i][j],
                    }}
                    onMouseEnter={addFilter}
                    onMouseLeave={removeFilter}
                    onClick={event => {
                        const innerI = event.currentTarget.getAttribute("data-i");
                        const innerJ = event.currentTarget.getAttribute("data-j");
                        const colour = event.currentTarget.getAttribute("data-colour")
                        if (!innerI || !innerJ || !colour) {
                            return
                        }
                        const iVal = parseInt(innerI, 10);
                        const jVal = parseInt(innerJ, 10);
                        setSelectedElement({ i: iVal, j: jVal, colour })
                        setModalOpen(true);
                    }}
                />)
        }
    }
    return (
        <>
            <div className="grid">
            {cells}
        </div >
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <ColorPicker selectedElement={selectedElement} modifyArray={props.modifyArray} closeModal={() => setModalOpen(false)} />
        </Modal>
        </>
    )
}

export default GridComponent