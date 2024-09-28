// script.js

$(document).ready(function() {
    const crosshair = $('.crosshair');
    const image = $('#mainImage');
    const liveCanvas = $('#liveCanvas')[0];
    const liveCtx = liveCanvas.getContext('2d');
    const snapshotCanvas = $('#snapshotCanvas')[0];
    const snapshotCtx = snapshotCanvas.getContext('2d');
    let startTime = Date.now();

    // Images in the sequence
    const images = [
        'images/HCI581A11.png',
        'images/HCI581A12.png'
    ];

    let imageIndex = 0;

    // Set the initial image
    image.attr('src', images[imageIndex]);

    // Update crosshair position to follow the mouse
    $('.image-container').mousemove(function(event) {
        let offset = $(this).offset();
        let mouseX = event.pageX - offset.left - crosshair.width() / 2;
        let mouseY = event.pageY - offset.top - crosshair.height() / 2;

        crosshair.css({
            top: mouseY + 'px',
            left: mouseX + 'px'
        });

        // Get crosshair position
        let crosshairLeft = parseFloat(crosshair.css('left'));
        let crosshairTop = parseFloat(crosshair.css('top'));

        // Get displayed image dimensions
        let displayedWidth = image.width();
        let displayedHeight = image.height();

        // Actual image dimensions (1600x1600)
        let actualWidth = 1600;
        let actualHeight = 1600;

        // Calculate scale factor
        let scaleX = actualWidth / displayedWidth;
        let scaleY = actualHeight / displayedHeight;

        // Adjust coordinates based on scale factor
        let sourceX = crosshairLeft * scaleX;
        let sourceY = crosshairTop * scaleY;

        // Set live canvas dimensions equal to crosshair dimensions
        liveCanvas.width = crosshair.width();
        liveCanvas.height = crosshair.height();

        // Clear the live canvas before drawing
        liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);

        // Draw the live preview of the image in the live canvas
        liveCtx.drawImage(
            image[0],
            sourceX, // Source X (scaled to the actual image size)
            sourceY, // Source Y (scaled to the actual image size)
            crosshair.width() * scaleX, // Source Width (scaled)
            crosshair.height() * scaleY, // Source Height (scaled)
            0, // Destination X (canvas)
            0, // Destination Y (canvas)
            liveCanvas.width, // Destination Width (canvas)
            liveCanvas.height // Destination Height (canvas)
        );
    });

    // Capture the portion of the image when clicking inside the container
    $('.image-container').click(function() {
        // Set snapshot canvas dimensions to match the crosshair
        snapshotCanvas.width = crosshair.width();
        snapshotCanvas.height = crosshair.height();

        // Clear the snapshot canvas before drawing
        snapshotCtx.clearRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);

        // Copy the current live canvas to the snapshot canvas
        snapshotCtx.drawImage(liveCanvas, 0, 0);
    });

    // Move to the next image in the sequence
    $('#nextButton').click(function() {
        imageIndex = (imageIndex + 1) % images.length;
        image.attr('src', images[imageIndex]);
    });

    // Timer to show elapsed time
    function updateTimeElapsed() {
        let currentTime = Date.now();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        $('#timeElapsed').text(`Time Elapsed: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    setInterval(updateTimeElapsed, 1000);
});
