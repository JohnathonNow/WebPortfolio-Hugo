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
            angleOffset = 360 - angleOffset;
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
        // appendText(content, `Arc=${arcLength.toFixed(2)}"`);
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

function createPdf() {
    const { jsPDF } = window.jspdf;
    // var doc = new jsPDF();
    // doc.setFontSize(12);
    // doc.text("Name:", 20, 20);

    // // Create an AcroForm Text Field
    // const { TextField } = jsPDF.AcroForm; // Destructure TextField from AcroForm
    // const nameField = new TextField();
    // nameField.fieldName = "userName"; // Unique name for the field
    // nameField.Rect = [35, 15, 100, 10]; // [x, y, width, height]
    // nameField.defaultValue = "Enter your name here"; // Optional default value
    // nameField.multiline = false; // Set to true for multiline text
    // nameField.maxFontSize = 12; // Optional: maximum font size for the field

    // doc.addField(nameField); // Add the field to the document

    // // Add another static text and a checkbox
    // doc.text("Agree to terms:", 20, 40);

    // const {CheckBox } = jsPDF.AcroForm;
    // const termsCheckbox = new CheckBox();
    // termsCheckbox.fieldName = "agreeTerms";
    // termsCheckbox.Rect = [55, 35, 5, 5]; // [x, y, width, height]
    // termsCheckbox.defaultValue = "Off"; // "On" or "Off" for default state

    // doc.addField(termsCheckbox);

    // // Save the PDF
    // doc.save("acroform_example.pdf");
    // const { jsPDF } = window.jspdf;

        // Initialize document (Letter size is standard for US forms)
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'letter'
        });

        // --- CONSTANTS ---
        const marginLeft = 40;
        const width = 612; // Letter width in pt
        const height = 792; // Letter height in pt
        const contentWidth = width - (marginLeft * 2);
        
        // --- HELPER FUNCTIONS ---
        function addLine(x1, y1, x2, y2) {
            doc.setLineWidth(0.5);
            doc.line(x1, y1, x2, y2);
        }

        function addLabel(text, x, y, fontSize = 9, font = "helvetica", style = "normal") {
            doc.setFont(font, style);
            doc.setFontSize(fontSize);
            doc.text(text, x, y);
        }

        // --- HEADER ---
        // Logo Placeholder (Top Left)
        doc.setLineWidth(1.5);
        // doc.triangle(50, 30, 70, 60, 30, 60, 'S'); // Abstract "A" shape for logo
        doc.addImage("static/logo.png", "PNG", 30, 30, 60, 60);
        
        // Company Info
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("ATLANTIC CONCRETE PRODUCTS, INC.", 100, 60);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("P.O. Box 129 - Tullytown, PA 19007-0098 - Tel. (215) 945-5600 Fax (215) 946-3102", 110, 70);
        
        addLine(marginLeft, 100, width - marginLeft, 100); // Header separator line

        // --- TOP METADATA ---
        let yPos = 125;
        let fieldWidth = 80;
        let fieldHeight = 10;
        const { TextField } = jsPDF.AcroForm; // Destructure TextField from AcroForm
        // Date Released
        addLabel("DATE RELEASED:", marginLeft, yPos);
        const dateField = new TextField();
        dateField.fieldName = "date"; // Unique name for the field
        dateField.Rect = [130, yPos - fieldHeight, fieldWidth, fieldHeight]; // [x, y, width, height]
        dateField.defaultValue = ""; // Optional default value
        dateField.multiline = false; // Set to true for multiline text
        dateField.maxFontSize = 12; // Optional: maximum font size for the field
        doc.addField(dateField); // Add the field to the document
        // addLine(130, yPos, 200, yPos); // Underline

        // Customer
        addLabel("CUSTOMER :", 220, yPos);
        const customerField = new TextField();
        customerField.fieldName = "customer"; // Unique name for the field
        customerField.Rect = [280, yPos - fieldHeight, fieldWidth, fieldHeight]; // [x, y, width, height]
        customerField.defaultValue = ""; // Optional default value
        customerField.multiline = false; // Set to true for multiline text
        customerField.maxFontSize = 12; // Optional: maximum font size for the field
        doc.addField(customerField); // Add the field to the document
        // addLine(280, yPos, 400, yPos); // Underline

        // Job Name
        yPos += 25;
        addLabel("JOB NAME:", marginLeft, yPos);
        // addLine(100, yPos, 200, yPos); // Underline for Job Name
        const jobField = new TextField();
        jobField.fieldName = "job"; // Unique name for the field
        jobField.Rect = [130, yPos - fieldHeight, fieldWidth, fieldHeight]; // [x, y, width, height]
        jobField.defaultValue = ""; // Optional default value
        jobField.multiline = false; // Set to true for multiline text
        jobField.maxFontSize = 12; // Optional: maximum font size for the field
        doc.addField(jobField); // Add the field to the document

        // Structure
        addLabel("STRUCTURE:", 220, yPos);
        const structureField = new TextField();
        structureField.fieldName = "structure"; // Unique name for the field
        structureField.Rect = [280, yPos - fieldHeight, fieldWidth, fieldHeight]; // [x, y, width, height]
        structureField.defaultValue = ""; // Optional default value
        structureField.multiline = false; // Set to true for multiline text
        structureField.maxFontSize = 12; // Optional: maximum font size for the field
        doc.addField(structureField); // Add the field to the document
        // addLine(280, yPos, 550, yPos); // Underline for Structure

        // --- RIGHT COLUMN SPECS ---
        const rightColX = 420;
        let rightColY = 170;
        const lineLength = 100;
        const lineHeight = 18;

        const specs = [
            "SCHEDULE", "CAST DATE", "FORM #", "HEIGHT", 
            "WALL", "BASE (THICK)", "LIFTER (T) 2/4/8/20", 
            "REINF", "B.O.S"
        ];

        specs.forEach(spec => {
            addLabel(spec, rightColX, rightColY, 8);
            addLine(rightColX + 80, rightColY, rightColX + 80 + 50, rightColY); // Short lines
            rightColY += lineHeight;
        });

        // --- DIAGRAM AREA (MAIN BODY) ---
        
        // // Box 1: Slab Top
        // const boxLeft = 80;
        // const box1Top = 150;
        // const boxSize = 120;

        // doc.setLineWidth(1);
        // doc.rect(boxLeft, box1Top, boxSize, boxSize); // Main Square
        // addLabel("36\" HOLE", boxLeft, box1Top - 10, 10, "helvetica", "bold");
        
        // // Circle inside box 1
        // doc.circle(boxLeft + 30, box1Top + 30, 20); 

        // // Label to the right of Box 1
        // addLabel("SLAB TOP", boxLeft + boxSize + 30, box1Top + 40, 10);
        // addLabel("10\" ON GRADE", boxLeft + boxSize + 30, box1Top + 55, 10);

        // // Box 2: Riser
        // const box2Top = 350;
        // doc.rect(boxLeft, box2Top, boxSize, boxSize); // Main Square
        
        // // Small "tab" on left of box 2
        // doc.rect(boxLeft - 10, box2Top + 20, 10, 20);

        // // Text Labels for Box 2
        // addLabel("27Hx29W HOLE", boxLeft + 60, box2Top - 30);
        // addLabel("0", boxLeft + 60, box2Top - 15);
        
        // // Arrow pointing to box
        // addLine(boxLeft + 70, box2Top - 10, boxLeft + 50, box2Top + 10); 

        // // "6' RISER" Label
        // addLabel("6' RISER", boxLeft + boxSize + 50, box2Top + 60, 10);
        
        // // Bottom hole label
        // addLabel("27Hx29W HOLE", boxLeft + 60, box2Top + boxSize + 30);
        // addLabel("0", boxLeft + 60, box2Top + boxSize + 45);
        // addLine(boxLeft + 70, box2Top + boxSize + 25, boxLeft + 50, box2Top + boxSize - 10); // Arrow

        // // Additional Specs (Box 4x4)
        // addLabel("BOX   4X4", 450, 480, 10);
        // addLabel("8\" WALLS 1350 PER FT", 450, 500, 10, "helvetica", "bold");

        // // --- FOOTER GRID ---
        // const footerY = 650;
        // const rowHeight = 25;
        // const col1X = marginLeft;
        // const col2X = 150;
        // const col3X = 400; // Unloader start

        // // Horizontal Lines
        // addLine(col1X, footerY, width - marginLeft, footerY); // Top
        // addLine(col1X, footerY + rowHeight, width - marginLeft, footerY + rowHeight); // Middle 1
        // addLine(col1X, footerY + (rowHeight*2), width - marginLeft, footerY + (rowHeight*2)); // Middle 2
        // addLine(col1X, footerY + (rowHeight*3), width - marginLeft, footerY + (rowHeight*3)); // Bottom

        // // Vertical Lines logic would go here, but the form uses long underlines mostly. 
        // // I will replicate the "Table look" by placing text and lines.

        // // Row 1
        // addLabel("STEPS", col1X + 5, footerY + 15, 8, "helvetica", "bold");
        // addLabel("BUTYL", col2X, footerY + 15, 8, "helvetica", "bold");
        // addLabel("UNLOADER", col3X, footerY + 15, 8, "helvetica", "bold");

        // // Row 2
        // addLabel("OPENING", col1X + 5, footerY + 15 + rowHeight, 8, "helvetica", "bold");
        // addLabel("BOLTS", col2X, footerY + 15 + rowHeight, 8, "helvetica", "bold");
        // addLabel("JOINT", col3X, footerY + 15 + rowHeight, 8, "helvetica", "bold");
        // addLabel("BOTTOM", col3X + 150, footerY + 15 + rowHeight, 8, "helvetica", "bold");

        // // Row 3
        // addLabel("COATING", col1X + 5, footerY + 15 + (rowHeight*2), 8, "helvetica", "bold");
        // addLabel("MISC", col3X + 20, footerY + 15 + (rowHeight*2), 8, "helvetica", "bold");

        // --- SAVE PDF ---
        doc.save("blank_form.pdf");
}

document.getElementById("pdf-report").onclick = (e) => createPdf();