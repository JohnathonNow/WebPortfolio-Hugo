/**
 * @namespace viewer3d
 */

let worker;

/**
 * Initializes the 3D viewer.
 * @memberof viewer3d
 */
function init3D() {
    const container = document.getElementById('viewer');
    const canvas = document.getElementById('canvas-3d');
    const offscreen = canvas.transferControlToOffscreen();

    worker = new Worker('js/worker.js');
    worker.postMessage({
        type: 'init',
        payload: {
            canvas: offscreen,
            width: container.clientWidth,
            height: container.clientHeight,
            pixelRatio: window.devicePixelRatio
        }
    }, [offscreen]);

    const mouseEventHandler = (type, event) => {
        // console.log(event);
        event.preventDefault();
        event.stopPropagation();
        worker.postMessage({
            type: 'mouseEvent',
            payload: {
                type: type,
                clientX: event.clientX,
                clientY: event.clientY,
                button: event.button,
                buttons: event.buttons,
                deltaY: event.deltaY,
                ctrlKey: event.ctrlKey,
                pointerType: event.pointerType,
                touches: event.touches,
                shiftKey: event.shiftKey,
                metaKey: event.metaKey
            }
        });
    };

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('touchstart', (e) => mouseEventHandler('touchstart', e));
    canvas.addEventListener('touchend', (e) => mouseEventHandler('touchend', e));
    canvas.addEventListener('touchmove', (e) => mouseEventHandler('touchmove', e));
    canvas.addEventListener('wheel', (e) => mouseEventHandler('wheel', e));
    canvas.addEventListener('pointerdown', (e) => mouseEventHandler('pointerdown', e));
    window.document.addEventListener('pointermove', (e) => mouseEventHandler('pointermove', e));
    window.document.addEventListener('pointerup', (e) => mouseEventHandler('pointerup', e));
}

/**
 * Generates and displays the 3D view of the manhole.
 * @memberof viewer3d
 */
function generate3DView(data) {
    worker.postMessage({
        type: 'render',
        payload: data
    });
}