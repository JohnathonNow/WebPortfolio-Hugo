/**
 * Initializes the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    initUI(generate3DView, generate2DDiagram);
    init3D();

    // Initial generation
    setTimeout(generate2DDiagram);
    setTimeout(generate3DView);
});
