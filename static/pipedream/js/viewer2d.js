/**
 * @namespace viewer2d
 */

/**
 * Generates and displays the 2D overhead diagram of the manhole.
 * @memberof viewer2d
 */
function generate2DDiagram() {
    const canvas2d = document.getElementById('canvas-2d');
    const ctx = canvas2d.getContext('2d');
    const width = canvas2d.width;
    const height = canvas2d.height;
    const center = { x: width / 2, y: height / 2 };

    ctx.clearRect(0, 0, width, height);

    const innerDiameter = parseFloat(document.getElementById('inner-diameter').value);
    const wallThickness = parseFloat(document.getElementById('wall-thickness').value);
    const outerDiameter = innerDiameter + 2 * wallThickness;

    const maxDiameter = outerDiameter;
    const scale = (Math.min(width, height) * 0.8) / maxDiameter;

    // Draw manhole walls
    ctx.beginPath();
    ctx.arc(center.x, center.y, (outerDiameter / 2) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#c0c0c0';
    ctx.fill();

    ctx.beginPath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.arc(center.x, center.y, (innerDiameter / 2) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw holes
    const holeEntries = document.querySelectorAll('.hole-entry');
    let cumulativeAngle = 0;
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    const innerRadius = (innerDiameter / 2);
    var prevCentralAngle = 0;
    holeEntries.forEach((hole, index) => {
        const holeDiameter = parseFloat(hole.querySelector('.hole-diameter').value);
        const angleOffset = parseFloat(hole.querySelector('.hole-angle').value);

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

        // Draw label
        ctx.fillStyle = "black";
        const labelRadius = manholeRadius + 15;
        const labelX = center.x + Math.cos(-angleRad + Math.PI / 2) * labelRadius;
        const labelY = center.y + Math.sin(-angleRad + Math.PI / 2) * labelRadius;
        ctx.fillText(`Hole ${index + 1}: Arc=${arcLength.toFixed(2)}"`, labelX, labelY);
        

        // find arc distance between adjacent holes
        if (index > 0) {
            const prevCumulativeAngle = cumulativeAngle - angleOffset;
            const prevAngleRad = (prevCumulativeAngle * Math.PI) / 180;
            const midAngleRad = (prevAngleRad + angleRad) / 2;
            const arcDistance = innerRadius * (angleRad - prevAngleRad - centralAngle / 2 - prevCentralAngle / 2);
            const distLabelRadius = manholeRadius - 15;
            const distLabelX = center.x + Math.cos(-midAngleRad + Math.PI / 2) * distLabelRadius;
            const distLabelY = center.y + Math.sin(-midAngleRad + Math.PI / 2) * distLabelRadius;
            ctx.fillText(`Holes ${index}-${index + 1}: Dist=${arcDistance.toFixed(2)}"`, distLabelX, distLabelY);
        }
        ctx.fillStyle = '#ffffff';
        prevCentralAngle = centralAngle;
    });
}
