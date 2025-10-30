/**
 * @namespace viewer2d
 */

/**
 * Generates and displays the 2D overhead diagram of the box.
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

    const { innerLength, innerWidth, wallThickness, holes } = data;
    const outerLength = innerLength + 2 * wallThickness;
    const outerWidth = innerWidth + 2 * wallThickness;
    const maxLength = Math.max(outerLength, outerWidth);
    const scale = ((Math.min(width, height) * 0.8) / maxLength);

    // Draw box walls
    ctx.fillStyle = '#c0c0c0';
    ctx.strokeStyle = '#000000';

    // Outer rectangle
    const outerX = center.x - (outerWidth / 2) * scale;
    const outerY = center.y - (outerLength / 2) * scale;
    const outerW = outerWidth * scale;
    const outerH = outerLength * scale;
    ctx.fillRect(outerX, outerY, outerW, outerH);
    ctx.strokeRect(outerX, outerY, outerW, outerH);

    // Inner rectangle
    const innerX = center.x - (innerWidth / 2) * scale;
    const innerY = center.y - (innerLength / 2) * scale;
    const innerW = innerWidth * scale;
    const innerH = innerLength * scale;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(innerX, innerY, innerW, innerH);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeRect(innerX, innerY, innerW, innerH);
    console.log(holes.length);
    holes.forEach((hole, index) => {
        const { holeDiameter, angleOffset } = hole;
        const angleRad = (angleOffset * Math.PI) / 180;
        const holeRadius = (holeDiameter / 2) * scale;

        let cy = center.y - holeRadius;
        const holeCenterX = center.x * Math.cos(angleRad) - cy * Math.sin(angleRad);
        const holeCenterY = cy * Math.cos(angleRad) + center.x * Math.sin(angleRad);
        ctx.save();
        ctx.translate(0, holeRadius);
        ctx.rotate(-angleRad);
        ctx.translate(holeCenterX, holeCenterY);
        ctx.fillStyle = "black";
        console.log(holeRadius);
        ctx.clearRect(-holeRadius, 0, holeRadius * 2, maxLength * scale * 2);
        // ctx.fillRect(0, 0, 500, 500);
        ctx.restore();
        // intersection with walls
        let slope = Math.tan(-angleRad + Math.PI/2);
        let slope2 = 1/slope;

        let x1 = (innerWidth/2 -wallThickness/2)* scale;
        let x2 = (outerWidth/2+wallThickness/2) * scale;
        let y1 = Math.min(slope*x1 - (holeDiameter/2)*scale, slope*x2 - (holeDiameter/2)*scale);
        let y2 = Math.max(slope*x1 + (holeDiameter/2)*scale, slope*x2 + (holeDiameter/2)*scale);
        let h1 = y2 - y1;
        ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
        ctx.fillRect(center.x + innerW/2, center.y + y1, wallThickness * scale, h1);
        let x3 = -(innerWidth/2 -wallThickness/2)* scale;
        let x4 = -(outerWidth/2+wallThickness/2) * scale;
        let y3 = -Math.min(slope*x3 - (holeDiameter/2)*scale, slope*x4 - (holeDiameter/2)*scale);
        let y4 = -Math.max(slope*x3 + (holeDiameter/2)*scale, slope*x4 + (holeDiameter/2)*scale);
        let h2 = y4 - y3;
        ctx.fillRect(center.x - outerW/2, center.y + y3, wallThickness * scale, h2);


        let y5 = (innerLength/2 - wallThickness/2) * scale;
        let y6 = (outerLength/2 + wallThickness/2) * scale;
        let x5 = Math.min(y5*slope2 - (holeDiameter/2)*scale, y6*slope2 - (holeDiameter/2)*scale);
        let x6 = Math.max(y5*slope2 + (holeDiameter/2)*scale, y6*slope2 + (holeDiameter/2)*scale);
        let w1 = x6 - x5;
        ctx.fillRect(center.x + x5, center.y + outerH/2, w1, -wallThickness * scale);


        let y7 = -(innerLength/2 - wallThickness/2) * scale;
        let y8 = -(outerLength/2 + wallThickness/2) * scale;
        let x7 = Math.min(y7*slope2 - (holeDiameter/2)*scale, y8*slope2 - (holeDiameter/2)*scale);
        let x8 = Math.max(y7*slope2 + (holeDiameter/2)*scale, y8*slope2 + (holeDiameter/2)*scale);
        let w2 = x8 - x7;
        ctx.fillRect(center.x + x7, center.y - outerH/2, w1, wallThickness * scale);
        // let x2o = -outerWidth/2;
        // let y2o = slope*x2o;
        // let x2i = -innerWidth/2;
        // let y2i = slope*x2i
        // let y3o = outerLength/2;
        // let x3o = y3o/slope;
        // let y3i = innerLength/2;
        // let x3i = y3i/slope;
        // let y4o = -outerLength/2;
        // let x4o = y3o/slope;
        // let y4i = -innerLength/2;
        // let x4i = y3i/slope;
        
        // y=mx+b
        // // Draw labels
        // ctx.fillStyle = "black";
        // ctx.textAlign = "left";
        // const labelRadius = Math.max(innerWidth, innerLength) / 2 * scale + 20;
        // const labelX = center.x + Math.cos(angleRad) * labelRadius;
        // const labelY = center.y + Math.sin(angleRad) * labelRadius;
        // ctx.fillText(`Hole ${index + 1}`, labelX, labelY);
    });
}
