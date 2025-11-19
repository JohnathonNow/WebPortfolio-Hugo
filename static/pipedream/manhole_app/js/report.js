/**
 * @namespace report
 */

/**
 * Generates and displays the 2D overhead diagram of the manhole.
 * @memberof report
 */
function generateReport(data) {
    setTimeout(actuallyGenerate.bind(null, data), 100);
}

function appendText(content, text) {
    let span = document.createElement('span');
    span.innerText = text;
    content.appendChild(span);
    content.appendChild(document.createElement('br'));
}

function appendHeader(content, text) {
    let b = document.createElement('b');
    b.innerText = text;
    content.appendChild(b);
    content.appendChild(document.createElement('br'));
}

function actuallyGenerate(data) {
    const canvas2d = document.getElementById('canvas-report');
    const content = document.getElementById('report-content');
    const prefix = document.getElementById('report-prefix');

    content.innerHTML = "";
    prefix.innerHTML = "";
    // canvas2d
    // canvas2d.height = canvas2d.width;
    // canvas2d.style.height = `${canvas2d.width}px`;
    const ctx = canvas2d.getContext('2d');
    const width = canvas2d.width;
    const height = canvas2d.height;
    const center = { x: width / 2, y: height / 2 };

    ctx.clearRect(0, 0, width, height);

    const { innerDiameter, wallThickness, manholeHeight, holes } = data;
    appendHeader(prefix, `Manhole Specs`);
    appendText(prefix, `Height: ${manholeHeight}", Diameter: ${innerDiameter}", Wall: ${wallThickness}"`);
    appendHeader(prefix, `Inverted Diagram`);
    const outerDiameter = innerDiameter + 2 * wallThickness;
    const maxDiameter = outerDiameter;
    const scale = ((Math.min(width, height) * .8) / maxDiameter);
    console.log(data);
    // Draw manhole walls
    ctx.beginPath();
    ctx.arc(center.x, center.y, (outerDiameter / 2) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#c0c0c0';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.arc(center.x, center.y, (innerDiameter / 2) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
    // Draw holes
    let cumulativeAngle = 0;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    const innerRadius = (innerDiameter / 2);
    var prevCentralAngle = 0;
    const flipped = true;
    holes.forEach((hole, index) => {
        let { holeDiameter, holeInnerDiameter, materialName, angleOffset, verticalOffset, annularSpace } = hole;
        //cumulativeAngle -= angleOffset;
        if (flipped) {
            angleOffset = 180 - angleOffset;
        }
        const angleRad = ((-angleOffset * Math.PI) / 180);

        const holeRadius = (holeDiameter / 2) * scale;
        const manholeRadius = (innerDiameter / 2) * scale;

        // Calculate hole center position
        let cy = center.y - holeRadius;
        const holeCenterX = center.x * Math.cos(angleRad) - cy * Math.sin(angleRad);
        const holeCenterY = cy * Math.cos(angleRad) + center.x * Math.sin(angleRad);
        const centralAngle = 2 * Math.asin(holeDiameter / (2 * innerRadius));
        const arcLength = innerRadius * centralAngle;
        ctx.save();
        ctx.translate(0, holeRadius);
        ctx.rotate(-angleRad);
        ctx.translate(holeCenterX, holeCenterY);

        ctx.clearRect(-holeRadius, 0, holeRadius * 2, innerDiameter * 2 * scale);
        ctx.restore();

        ctx.beginPath();
        ctx.strokeStyle = '#000';
        let cornerX1 = center.x + innerDiameter * scale / 2 * Math.cos(-angleRad - centralAngle / 2 + Math.PI / 2);
        let cornerY1 = center.y + innerDiameter * scale / 2 * Math.sin(-angleRad - centralAngle / 2 + Math.PI / 2);
        let cornerX2 = wallThickness * scale * Math.cos(angleOffset * Math.PI / 180 + Math.PI / 2) + cornerX1;
        let cornerY2 = wallThickness * scale * Math.sin(angleOffset * Math.PI / 180 + Math.PI / 2) + cornerY1;
        ctx.moveTo(cornerX1, cornerY1);
        // ctx.moveTo(0, 0);
        ctx.lineTo(cornerX2, cornerY2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        cornerX1 = center.x + innerDiameter * scale / 2 * Math.cos(-angleRad + centralAngle / 2 + Math.PI / 2);
        cornerY1 = center.y + innerDiameter * scale / 2 * Math.sin(-angleRad + centralAngle / 2 + Math.PI / 2);
        cornerX2 = wallThickness * scale * Math.cos(angleOffset * Math.PI / 180 + Math.PI / 2) + cornerX1;
        cornerY2 = wallThickness * scale * Math.sin(angleOffset * Math.PI / 180 + Math.PI / 2) + cornerY1;
        ctx.moveTo(cornerX1, cornerY1);
        // ctx.moveTo(0, 0);
        ctx.lineTo(cornerX2, cornerY2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#33de42';
        ctx.arc(center.x, center.y, (innerDiameter / 2) * scale, -angleRad - centralAngle / 2 + Math.PI / 2, -angleRad + centralAngle / 2 + Math.PI / 2);
        ctx.stroke();
        const labelRadius = manholeRadius + 20;
        const labelX = center.x + Math.cos(-angleRad + Math.PI / 2) * labelRadius - 8;
        const labelY = center.y + Math.sin(-angleRad + Math.PI / 2) * labelRadius;
        const font = ctx.font;
        ctx.font = "bold 32px serif";
        ctx.fillText(`${index + 1}`, labelX, labelY);
        appendHeader(content, `Hole ${index + 1}`);
        ctx.font = font;
        appendText(content, `Arc=${arcLength.toFixed(2)}"`);
        appendText(content, `ID: ${holeInnerDiameter}"`);
        appendText(content, `Type: ${materialName}`);
        appendText(content, `Annular space: ${annularSpace}"`);
        appendText(content, `Hole: ${holeDiameter}"`);
        appendText(content, `Invert: ${verticalOffset.toFixed(2)}'`);
    });
    appendHeader(content, "Hole Distances")
    holes.forEach((hole, index) => {
        const { holeDiameter, holeInnerDiameter, materialName, angleOffset, verticalOffset, annularSpace } = hole;
        const angleRad = (-angleOffset * Math.PI) / 180;

        const holeRadius = (holeDiameter / 2) * scale;
        const manholeRadius = (innerDiameter / 2) * scale;
        // Calculate hole center position
        let cy = center.y - holeRadius;
        const holeCenterX = center.x * Math.cos(angleRad) - cy * Math.sin(angleRad);
        const holeCenterY = cy * Math.cos(angleRad) + center.x * Math.sin(angleRad);
        var centralAngle = 2 * Math.asin(holeDiameter / (2 * innerRadius));
        const arcLength = innerRadius * centralAngle;
        // Draw label
        ctx.fillStyle = "black";
        ctx.textAlign = "left"

        // ctx.textAlign = "center";
        // find arc distance between adjacent holes
        // if (index > 0) {
        var angleDiff;
        if (index == 0) {
            let lastHole = holes[holes.length - 1];
            angleDiff = Math.PI * (360 - lastHole.angleOffset + angleOffset) / 180;
            prevCentralAngle = 2 * Math.asin(lastHole.holeDiameter / (2 * innerRadius));
            //centralAngle = -centralAngle;
        } else {
            angleDiff = (angleOffset - holes[index - 1].angleOffset) * Math.PI / 180;
        }
        let midAngleRad = angleRad + angleDiff / 2;
        const arcDistance1 = innerRadius * (angleDiff - centralAngle / 2 - prevCentralAngle / 2);
        const arcDistance2 = innerRadius * (2 * Math.PI - angleDiff - centralAngle / 2 - prevCentralAngle / 2);
        let arcDistance;
        if (arcDistance1 > arcDistance2 || arcDistance1 < 0) {
            arcDistance = arcDistance2;
            midAngleRad += Math.PI;
        } else {
            arcDistance = arcDistance1;
        }
        const distLabelRadius = manholeRadius - 30;
        const distLabelX = center.x + Math.cos(-midAngleRad + Math.PI / 2) * distLabelRadius;
        const distLabelY = center.y + Math.sin(-midAngleRad + Math.PI / 2) * distLabelRadius;
        if (index > 0) {
            //ctx.fillText(`Holes ${index}-${index + 1}: Dist=${arcDistance.toFixed(2)}"`, distLabelX, distLabelY);
            appendText(content, `Holes ${index}-${index + 1}: Dist=${arcDistance.toFixed(2)}"`);
        } else if (holes.length > 2) {
            appendText(content, `Holes ${holes.length}-1: Dist=${arcDistance.toFixed(2)}"`);
            //ctx.fillText(`Holes ${holes.length}-1: Dist=${arcDistance.toFixed(2)}"`, distLabelX, distLabelY);
        }
        // }
        ctx.fillStyle = '#ffffff';
        prevCentralAngle = centralAngle;
    });

}
