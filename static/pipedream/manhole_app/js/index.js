/**
 * Initializes the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    initUI(generate3DView, generate2DDiagram, generateReport);
    init3D();

    // load holes.json
    fetch('/static/holes.json')
        .then(response => response.json())
        .then(data => {
            window.g_holes = data;
            const dataList = document.getElementById('pipe-options');
            Object.keys(data).map(item => {
                const option = document.createElement('option');
                option.value = item;
                dataList.appendChild(option);
            });
        });
    // Initial generation
});
