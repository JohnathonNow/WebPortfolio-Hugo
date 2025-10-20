/**
 * Initializes the user interface, setting up event listeners and initial state.
 * @param {Function} generate3DView - Callback function to generate the 3D view.
 * @param {Function} generate2DDiagram - Callback function to generate the 2D diagram.
 */
function initUI(generate3DView, generate2DDiagram) {
    const addHoleBtn = document.getElementById('add-hole');
    const holesContainer = document.getElementById('holes-container'); // This is now the tbody
    const generateBtn = document.getElementById('generate-btn');

    let holeCount = 0;

    // Add initial holes
    addHole();
    addHole();

    addHoleBtn.addEventListener('click', () => addHole());

    /**
     * Adds a new hole row to the table.
     * @param {number} [diameter=12] - The default diameter of the hole.
     * @param {number} [angle=90] - The default angle offset of the hole.
     * @param {number} [inset=12] - The default vertical offset of the hole.
     */
    function addHole(diameter, angle, inset) {
        holeCount++;
        const holeRow = document.createElement('tr');
        holeRow.classList.add('hole-entry'); // Keep class for consistency in selectors
        holeRow.innerHTML = `
            <td><input type="number" class="hole-diameter" value="${diameter || 12}" step="3" min="0"></td>
            <td><input type="number" class="hole-angle" value="${angle || (90 * holeCount)}" step="5"></td>
            <td><input type="number" class="hole-vertical" value="${inset || 12}" min="1"></td>
            <td>
                <select class="pipe-type">
                    <option>PVC</option>
                    <option>RCP</option>
                    <option>HDPE</option>
                </select>
            </td>
            <td><button class="remove-hole">X</button></td>
        `;
        holesContainer.appendChild(holeRow);

        holeRow.querySelector('.remove-hole').addEventListener('click', () => {
            holeRow.remove();
        });
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

    generateBtn.addEventListener('click', () => {
        // Generate 2D diagram first to avoid being blocked by 3D errors.
        generate2DDiagram();
        setTimeout(generate3DView);
    });
}