/**
 * Initializes the user interface, setting up event listeners and initial state.
 * @param {Function} generate3DView - Callback function to generate the 3D view.
 * @param {Function} generate2DDiagram - Callback function to generate the 2D diagram.
 */
function initUI(generate3DView, generate2DDiagram) {
    const addHoleBtn = document.getElementById('add-hole');
    const holesContainer = document.getElementById('holes-container');
    const generateBtn = document.getElementById('generate-btn');

    let holeCount = 0;

    // Add initial holes
    addHole();
    addHole();

    addHoleBtn.addEventListener('click', () => addHole());

    /**
     * Adds a new hole input section to the UI.
     * @param {number} [diameter=12] - The default diameter of the hole.
     * @param {number} [angle=90] - The default angle offset of the hole.
     * @param {number} [inset=12] - The default vertical offset of the hole.
     */
    function addHole(diameter, angle, inset) {
        holeCount++;
        const holeDiv = document.createElement('div');
        holeDiv.classList.add('hole-entry');
        holeDiv.innerHTML = `
            <div class="hole-header">
                <h4>Hole ${holeCount}</h4>
                <button class="remove-hole">Remove</button>
            </div>
            <div class="hole-body">
                <label for="hole-diameter-${holeCount}">Diameter (in):</label>
                <input type="number" id="hole-diameter-${holeCount}" class="hole-diameter" value="${diameter || 12}" step="3" min="0">

                <label for="hole-angle-${holeCount}">Angle Offset (°):</label>
                <input type="number" id="hole-angle-${holeCount}" class="hole-angle" value="${angle || (90 * holeCount)}" step="5">

                <label for="hole-vertical-${holeCount}">Vertical Offset (in):</label>
                <input type="number" id="hole-vertical-${holeCount}" class="hole-vertical" value="${inset || 12}" min="1">
            </div>
        `;
        holesContainer.appendChild(holeDiv);

        holeDiv.querySelector('.remove-hole').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the collapse toggle
            holeDiv.remove();
            // Re-number remaining holes
            const remainingHoles = holesContainer.querySelectorAll('.hole-entry');
            remainingHoles.forEach((hole, index) => {
                hole.querySelector('h4').textContent = `Hole ${index + 1}`;
            });
            holeCount = remainingHoles.length;
        });

        holeDiv.querySelector('.hole-header').addEventListener('click', () => {
            holeDiv.classList.toggle('collapsed');
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
