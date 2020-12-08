
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.createImageData(canvas.width, canvas.height);

    const dataOffset = (w, h) => ((canvas.width * w) + h) * 4;
    const offsetRgb = data => (offset, [r, g, b]) => {
        data[offset] = r;
        data[offset+1] = g;
        data[offset+2] = b;
    };
    const getImageData = () => ctx.getImageData(0, 0, canvas.width, canvas.height);

    function paintPixel(w, h, [r, g, b]) {
        const imageData = getImageData();
        const data = imageData.data;

        const offset = dataOffset(w, h);
        offsetRgb(data)(offset, [r, g, b]);

        ctx.putImageData(imageData, 0, 0);
    }

    let i = 0;
    function loop() {
        paintPixel(0 + ~~(i/canvas.height), i % canvas.height, [0, 255, 0]);
        i += 1;
    }

    function main() {
        createjs.Ticker.addEventListener('tick', loop);
        createjs.Ticker.framerate = 120;
    }

    main();

}());