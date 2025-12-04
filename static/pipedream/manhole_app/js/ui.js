/**
 * Initializes the user interface, setting up event listeners and initial state.
 * @param {Function} generate3DView - Callback function to generate the 3D view.
 * @param {Function} generate2DDiagram - Callback function to generate the 2D diagram.
 */

const thicknessTable = {
    "48": 5,
    "60": 6,
    "72": 7,
    "84": 8,
    "96": 9,
    "120": 10,
    "144": 12
};

function initUI(generate3DView, generate2DDiagram, generateReport) {
    const addHoleBtn = document.getElementById('add-hole');
    const holesContainer = document.getElementById('holes-container'); // This is now the tbody
    const generateBtn = document.getElementById('generate-btn');
    const wallThickness = document.getElementById('wall-thickness');
    let holeCount = 0;

    // Add initial holes
    addHole("12.00\" OD PIPE", 0);
    addHole("12.00\" OD PIPE", 180);

    addHoleBtn.addEventListener('click', () => addHole("12.00\" OD PIPE", holeCount * 90));

    /**
     * Adds a new hole row to the table.
     * @param {string} [hole="12.00\" OD PIPE"] - The default type of the hole.
     * @param {number} [angle=0] - The default angle offset of the hole.
     * @param {number} [invert=12] - The default vertical offset of the hole.
     */
    function addHole(hole, angle, invert) {
        let first = holeCount == 0;
        holeCount++;
        const holeRow = document.createElement('tr');
        holeRow.classList.add('hole-entry'); // Keep class for consistency in selectors
        holeRow.innerHTML = `
            <td><input type="text" class="hole-type" value="${hole}" list="pipe-options"></td>
            <td><input type="number" class="hole-angle" value="${angle}" step="5" ${first?'disabled':''}></td>
            <td><input type="number" class="hole-vertical" value="${invert || 100}" min="0" step="0.1"></td>
            <td><button class="remove-hole">X</button></td>
        `;
        holesContainer.appendChild(holeRow);

        let xbutton = holeRow.querySelector('.remove-hole');
        if (first) {
            xbutton.remove();
        } else {
            xbutton.addEventListener('click', () => {
                holeRow.remove();
            });
        }
    }

    // Tab switching logic
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    function generate() {
        let payload = generateData();
        // Generate 2D diagram first to avoid being blocked by 3D errors.
        generate2DDiagram(payload);
        generateReport(payload);
        setTimeout(() => generate3DView(payload));
    }
    document.querySelector("#inner-diameter").addEventListener("change", (e) => {
        let value = e.target.value;
        if (thicknessTable[value]) wallThickness.value = thicknessTable[value];
    });
    generateBtn.addEventListener('click', generate);
    generate();
}

function generateData() {
    const innerDiameter = parseFloat(document.getElementById('inner-diameter').value);
    const wallThickness = parseFloat(document.getElementById('wall-thickness').value);
    const manholeHeight = parseFloat(document.getElementById('manhole-height').value);

    const holes = [];
    const holeEntries = document.querySelectorAll('#holes-container .hole-entry');
    holeEntries.forEach((hole) => {
        const holeTypeInput = hole.querySelector('.hole-type');
        const holeTypeValue = holeTypeInput.value;

        let holeInnerDiameter = 12;
        let holeDiameter = 16;

        if (window.g_holes) {
            const pipe = window.g_holes[holeTypeValue];
            if (pipe) {
                holeInnerDiameter = pipe['ID(")'];
                holeDiameter = pipe['OD(")'] + 4; // +4 for annular space
            } else {
                const parsed = parseFloat(holeTypeValue);
                if (!isNaN(parsed)) {
                    holeInnerDiameter = parsed;
                    holeDiameter = parsed + 4;
                }
            }
        } else {
            // Fallback if g_holes not loaded yet
            const parsed = parseFloat(holeTypeValue);
            if (!isNaN(parsed)) {
                holeInnerDiameter = parsed;
                holeDiameter = parsed + 4;
            }
        }

        const angleOffset = parseFloat(hole.querySelector('.hole-angle').value);
        const verticalOffset = parseFloat(hole.querySelector('.hole-vertical').value);
        const annularSpace = 2;
        const materialName = holeTypeValue;

        holes.push({ holeDiameter, holeInnerDiameter, angleOffset, verticalOffset, materialName, annularSpace });
    });

    return {
        innerDiameter,
        wallThickness,
        manholeHeight,
        holes
    };
}