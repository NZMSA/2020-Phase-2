import React, { useState } from "react";
import { Modal } from "@material-ui/core";
import ColorPicker from "../ColorPicker/ColorPicker";
import { ModifyProps } from "../../api/Api";

interface IGridProps {
  colourArray: string[][];
  modifyArray?: (props: ModifyProps) => void;
  canEdit?: boolean;
}

const Grid = (props: IGridProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState({ row: -1, col: -1, colour: "#ffffff" });
  const singleCellSize = (600 / 32) - 2;
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

export default Grid;
