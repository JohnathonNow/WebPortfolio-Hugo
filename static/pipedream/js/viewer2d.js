/**
 * @namespace viewer2d
 */

/**
 * Generates and displays the 2D overhead diagram of the manhole.
 * @memberof viewer2d
 */
function generate2DDiagram(data) {
    const canvas2d = document.getElementById('canvas-2d');
    const ctx = canvas2d.getContext('2d');

    canvas2d.width = canvas2d.clientWidth;
    canvas2d.height = canvas2d.clientHeight;
    const width = canvas2d.width;
    const height = canvas2d.height;
    const center = { x: width / 2, y: height / 2 };

    ctx.clearRect(0, 0, width, height);

    const { innerDiameter, wallThickness, manholeHeight, holes } = data;
    const outerDiameter = innerDiameter + 2 * wallThickness;
    const maxDiameter = outerDiameter;
    const scale = ((Math.min(width, height) * 0.8) / maxDiameter);
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
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    const innerRadius = (innerDiameter / 2);
    var prevCentralAngle = 0;
    holes.forEach((hole, index) => {
        const { holeDiameter, angleOffset, verticalOffset } = hole;
        cumulativeAngle += angleOffset;
        const angleRad = (cumulativeAngle * Math.PI) / 180;

        const holeRadius = (holeDiameter / 2) * scale;
        const manholeRadius = (innerDiameter / 2) * scale;

        // Calculate hole center position
        let cy = center.y - holeRadius;
        const holeCenterX = center.x * Math.cos(angleRad) - cy * Math.sin(angleRad);
        const holeCenterY = cy * Math.cos(angleRad) + center.x * Math.sin(angleRad);
        const centralAngle = 2*Math.asin(holeDiameter / (2*innerRadius));
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
        let cornerX2 = wallThickness * scale * Math.cos(-cumulativeAngle * Math.PI/180 + Math.PI / 2) + cornerX1;
        let cornerY2 = wallThickness * scale * Math.sin(-cumulativeAngle * Math.PI/180 + Math.PI / 2) + cornerY1;
        ctx.moveTo(cornerX1, cornerY1);
        // ctx.moveTo(0, 0);
        ctx.lineTo(cornerX2, cornerY2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        cornerX1 = center.x + innerDiameter * scale / 2 * Math.cos(-angleRad + centralAngle / 2 + Math.PI / 2);
        cornerY1 = center.y + innerDiameter * scale / 2 * Math.sin(-angleRad + centralAngle / 2 + Math.PI / 2);
        cornerX2 = wallThickness * scale * Math.cos(-cumulativeAngle * Math.PI/180 + Math.PI / 2) + cornerX1;
        cornerY2 = wallThickness * scale * Math.sin(-cumulativeAngle * Math.PI/180 + Math.PI / 2) + cornerY1;
        ctx.moveTo(cornerX1, cornerY1);
        // ctx.moveTo(0, 0);
        ctx.lineTo(cornerX2, cornerY2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#33de42';
        ctx.arc(center.x, center.y, (innerDiameter / 2) * scale, -angleRad - centralAngle / 2 + Math.PI / 2, -angleRad + centralAngle / 2  + Math.PI / 2);
        ctx.stroke();
    });
    cumulativeAngle = 0;
    holes.forEach((hole, index) => {
        const { holeDiameter, angleOffset, verticalOffset } = hole;


        cumulativeAngle += angleOffset;
        const angleRad = (cumulativeAngle * Math.PI) / 180;

        const holeRadius = (holeDiameter / 2) * scale;
        const manholeRadius = (innerDiameter / 2) * scale;
        // Calculate hole center position
        let cy = center.y - holeRadius;
        const holeCenterX = center.x * Math.cos(angleRad) - cy * Math.sin(angleRad);
        const holeCenterY = cy * Math.cos(angleRad) + center.x * Math.sin(angleRad);
        const centralAngle = 2*Math.asin(holeDiameter / (2*innerRadius));
        const arcLength = innerRadius * centralAngle;
        // Draw label
        ctx.fillStyle = "black";
        const labelRadius = manholeRadius + 50;
        const labelX = center.x + Math.cos(-angleRad + Math.PI / 2) * labelRadius;
        const labelY = center.y + Math.sin(-angleRad + Math.PI / 2) * labelRadius;
        ctx.fillText(`Hole ${index + 1}: Arc=${arcLength.toFixed(2)}"`, labelX, labelY);
        

        // find arc distance between adjacent holes
        if (index > 0) {
            const angleDiff = angleOffset * Math.PI / 180;
            let midAngleRad = angleRad - angleDiff / 2;
            const arcDistance1 = innerRadius * (angleDiff - centralAngle / 2 - prevCentralAngle / 2);
            const arcDistance2 = innerRadius * (2*Math.PI - angleDiff - centralAngle / 2 - prevCentralAngle / 2);
            let arcDistance;
            if (arcDistance1 < arcDistance2 || arcDistance2 < 0) {
                arcDistance = arcDistance1;
            } else {
                arcDistance = arcDistance2;
                midAngleRad += Math.PI;
            }
            const distLabelRadius = manholeRadius - 30;
            const distLabelX = center.x + Math.cos(-midAngleRad + Math.PI / 2) * distLabelRadius;
            const distLabelY = center.y + Math.sin(-midAngleRad + Math.PI / 2) * distLabelRadius;
            ctx.fillText(`Holes ${index}-${index + 1}: Dist=${arcDistance.toFixed(2)}"`, distLabelX, distLabelY);
        }
        ctx.fillStyle = '#ffffff';
        prevCentralAngle = centralAngle;
    });
}
