let currentDraggable = null; // To keep track of the currently selected image
let zIndexCounter = 10; // Initialize z-index counter

// Function to handle both mouse and touch events for dragging
function makeDraggable(image) {
    image.style.zIndex = zIndexCounter++; // Set initial z-index

    function onStart(event) {
        currentDraggable = image;
        currentDraggable.style.cursor = 'grabbing';
        currentDraggable.style.zIndex = ++zIndexCounter;

        const isTouchEvent = event.type.startsWith('touch');
        const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        // Calculate the initial offset considering the transformation
        const rect = currentDraggable.getBoundingClientRect();
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;

        function onMove(event) {
            const moveX = isTouchEvent ? event.touches[0].clientX : event.clientX;
            const moveY = isTouchEvent ? event.touches[0].clientY : event.clientY;

            currentDraggable.style.left = `${moveX - offsetX}px`;
            currentDraggable.style.top = `${moveY - offsetY}px`;
        }

        function onEnd() {
            if (currentDraggable) {
                currentDraggable.style.cursor = 'grab';
                currentDraggable = null;
            }
            document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
            document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
        }

        document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
        document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    }

    image.addEventListener('mousedown', onStart);
    image.addEventListener('touchstart', onStart);

    image.addEventListener('dragstart', (event) => {
        event.preventDefault();  // Prevent default dragging behavior
    });
}

// Initialize draggable images
const draggables = document.querySelectorAll('.draggable');
draggables.forEach(makeDraggable);

// Handle the rotate button
document.querySelector('.rotateBtn').addEventListener('click', () => {
    if (currentDraggable) {
        let rotation = (parseInt(currentDraggable.style.transform.replace(/[^\d.]/g, '')) || 0) + 90;
        currentDraggable.style.transform = `rotate(${rotation}deg)`;
    }
});

// Handle the to front button
document.querySelector('.frontBtn').addEventListener('click', () => {
    if (currentDraggable) {
        currentDraggable.style.zIndex = ++zIndexCounter;
    }
});

// Handle the to back button
document.querySelector('.backBtn').addEventListener('click', () => {
    if (currentDraggable) {
        currentDraggable.style.zIndex = --zIndexCounter;
    }
});

// Handle the copy button
document.getElementById('copyBtn').addEventListener('click', () => {
    if (currentDraggable) {
        const clone = currentDraggable.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = `${currentDraggable.offsetLeft + 10}px`;
        clone.style.top = `${currentDraggable.offsetTop + 10}px`;
        clone.style.zIndex = zIndexCounter++;
        document.querySelector('.container').appendChild(clone);
        makeDraggable(clone);
    }
});

// Handle the save button
document.getElementById('saveBtn').addEventListener('click', () => {
    const container = document.getElementById('designContainer');
    const containerRect = container.getBoundingClientRect();

    // Calculate the center area for a 1080x1080 screenshot
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    const captureWidth = 1080;
    const captureHeight = 1080;
    const offsetX = centerX - captureWidth / 2;
    const offsetY = centerY - captureHeight / 2;

    html2canvas(container, {
        x: offsetX,
        y: offsetY,
        width: captureWidth,
        height: captureHeight,
        scale: window.devicePixelRatio // Adjust for high-DPI displays
    }).then(canvas => {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'design_screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});

// Handle the randomize button
document.getElementById('randomizeBtn').addEventListener('click', () => {
    const container = document.querySelector('.container');
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach((draggable) => {
        const containerRect = container.getBoundingClientRect();
        const randomX = Math.random() * (containerRect.width - draggable.offsetWidth);
        const randomY = Math.random() * (containerRect.height - draggable.offsetHeight);

        draggable.style.left = `${randomX}px`;
        draggable.style.top = `${randomY}px`;
    });
});

// Randomize all images on page load
window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach((draggable) => {
        const containerRect = container.getBoundingClientRect();
        const randomX = Math.random() * (containerRect.width - draggable.offsetWidth);
        const randomY = Math.random() * (containerRect.height - draggable.offsetHeight);

        draggable.style.left = `${randomX}px`;
        draggable.style.top = `${randomY}px`;
    });
});

// Deselect image when clicking anywhere in the container
document.querySelector('.container').addEventListener('click', (event) => {
    if (!event.target.classList.contains('draggable')) {
        if (currentDraggable) {
            currentDraggable.classList.remove('selected');
            currentDraggable = null;
        }
    }
});
