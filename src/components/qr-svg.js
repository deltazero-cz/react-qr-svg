import React from "react";
import PropTypes from "prop-types";

const QRCodeImpl = require("qr.js/lib/QRCode");
const ErrorCorrectLevel = require("qr.js/lib/ErrorCorrectLevel");

export function QRCode({
    value = "",
    level = "L",
    bgColor = "#FFFFFF",
    fgColor = "#000000",
    cellClassPrefix = "",
    transparent = false,
    rectProps = {},
    ...otherProps
} = {}) {
    // adapted from https://github.com/zpao/qrcode.react/blob/master/src/index.js
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(value);
    qrcode.make();

    const cells = qrcode.modules;

    const cellClassName = cellClassPrefix && `${cellClassPrefix}-cell`;
    const emptyCellClassName =
        cellClassPrefix && `${cellClassName} ${cellClassPrefix}-cell-empty`;
    const filledCellClassName =
        cellClassPrefix && `${cellClassName} ${cellClassPrefix}-cell-filled`;

    let cellIndex = 0; // we use simple order as a key just to avoid the key warning here

    return (
        <svg
            shapeRendering="crispEdges"
            viewBox={[0, 0, cells.length, cells.length].join(" ")}
            {...(transparent ? { fill: fgColor } : {})}
            {...otherProps}
        >
            {cells.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (transparent && !cell) return null;

                    const className = cell
                        ? filledCellClassName
                        : emptyCellClassName;
                    const classNameProp = className ? { className } : null;

                    // Only use the fill if no cellClassPrefix was set. See https://github.com/no23reason/react-qr-svg/issues/136 for reasoning.
                    const fill =
                        !classNameProp &&
                        !transparent &&
                        (cell ? fgColor : bgColor);
                    const styleProp = fill ? { style: { fill } } : null;
                    return (
                        <rect
                            height={1}
                            key={cellIndex++} // string was too slow here
                            {...styleProp}
                            {...classNameProp}
                            width={1}
                            x={colIndex}
                            y={rowIndex}
                            {...rectProps}
                        />
                    );
                }),
            )}
        </svg>
    );
}

QRCode.propTypes = {
    value: PropTypes.string.isRequired,
    size: PropTypes.number,
    level: PropTypes.oneOf(["L", "M", "Q", "H"]),
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
    cellClassPrefix: PropTypes.string,
    transparent: PropTypes.bool,
    rectProps: PropTypes.object,
};
