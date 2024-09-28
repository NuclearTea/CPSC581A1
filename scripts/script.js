$(document).ready(function() {
    const crosshair = $('.crosshair');
    const image = $('#mainImage');
    const liveCanvas = $('#liveCanvas')[0];
    const liveCtx = liveCanvas.getContext('2d');
    const snapshotCanvas = $('#snapshotCanvas')[0];
    const snapshotCtx = snapshotCanvas.getContext('2d');
    let startTime = Date.now();

    // Use loop??
    const images = [
        'images/HCI581A11.png',
        'images/HCI581A12.png'
    ];

    let imageIndex = 0;

    // initial image
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

        // actual hardcoded image dimensions
        let actualWidth = 1600;
        let actualHeight = 1600;

        // scale factor
        let scaleX = actualWidth / displayedWidth;
        let scaleY = actualHeight / displayedHeight;

        // Adjust coordinates based on scale factor
        let sourceX = crosshairLeft * scaleX;
        let sourceY = crosshairTop * scaleY;

        // Set live canvas dimensions equal to crosshair dimensions
        liveCanvas.width = crosshair.width();
        liveCanvas.height = crosshair.height();

        // Clears the live canvas before drawing
        liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);

        // Draw the live preview
        liveCtx.drawImage(
            image[0],
            sourceX,
            sourceY,
            crosshair.width() * scaleX,
            crosshair.height() * scaleY,
            0, 
            0, 
            liveCanvas.width,
            liveCanvas.height 
        );
    });

    // Capture the portion of the image inside the crosshair
    $('.image-container').click(function() {
        snapshotCanvas.width = crosshair.width();
        snapshotCanvas.height = crosshair.height();

        // Clear snapshot canvas before drawing
        snapshotCtx.clearRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);

        // Copy live canvas to snapshot canvas
        snapshotCtx.drawImage(liveCanvas, 0, 0);
    });

    // Next images
    $('#nextButton').click(function() {
        imageIndex = (imageIndex + 1) % images.length;
        image.attr('src', images[imageIndex]);
    });

    // Timer
    function updateTimeElapsed() {
        let currentTime = Date.now();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        $('#timeElapsed').text(`Time Elapsed: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    setInterval(updateTimeElapsed, 1000);
});
