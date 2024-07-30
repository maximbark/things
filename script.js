const draggables = Array.from(document.querySelectorAll('.draggable'));
const container = document.querySelector('.container');
let zIndexCounter = 1000; // Start with a higher initial z-index value
let currentDraggable = null; // To keep track of the currently selected image

function getRandomPosition(element) {
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - element.offsetWidth;
    const maxY = containerRect.height - element.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    return { x, y };
}

function randomizeAllImages() {
    draggables.forEach(image => {
        const { x, y } = getRandomPosition(image);
        image.style.position = 'absolute';
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
    });
}

function randomizeThreeImages() {
    // Shuffle the images array
    const shuffled = draggables.sort(() => 0.5 - Math.random());
    // Get the first three elements
    const selected = shuffled.slice(0, 3);

    selected.forEach(image => {
        const { x, y } = getRandomPosition(image);
        image.style.position = 'absolute';
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
    });
}

function copyImage() {
    if (!currentDraggable) return;

    const clone = currentDraggable.cloneNode(true);
    const containerRect = container.getBoundingClientRect();
    const randomPosition = getRandomPosition(clone);

    clone.style.position = 'absolute';
    clone.style.left = `${randomPosition.x}px`;
    clone.style.top = `${randomPosition.y}px`;
    clone.style.zIndex = zIndexCounter++; // Set a new z-index for the copied image

    container.appendChild(clone);
    draggables.push(clone); // Add the clone to the draggables array

    clone.addEventListener('mousedown', (event) => {
        if (currentDraggable) {
            currentDraggable.classList.remove('selected'); // Remove selected class from previously selected image
        }
        
        currentDraggable = clone; // Set the newly cloned image as currentDraggable
        currentDraggable.classList.add('selected'); // Add selected class to the current image
        currentDraggable.style.cursor = 'grabbing';

        // Bring the dragged element to the front
        currentDraggable.style.zIndex = ++zIndexCounter;

        // Calculate the initial offset considering the transformation
        const rect = currentDraggable.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        function onMouseMove(event) {
            currentDraggable.style.left = `${event.clientX - offsetX}px`;
            currentDraggable.style.top = `${event.clientY - offsetY}px`;
        }

        function onMouseUp() {
            currentDraggable.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    clone.addEventListener('dragstart', (event) => {
        event.preventDefault();  // Prevent default dragging behavior
    });
}

draggables.forEach(draggable => {
    draggable.style.zIndex = zIndexCounter++; // Set initial z-index

    draggable.addEventListener('mousedown', (event) => {
        if (currentDraggable) {
            currentDraggable.classList.remove('selected'); // Remove selected class from previously selected image
        }
        
        currentDraggable = draggable; // Set the currently selected image
        currentDraggable.classList.add('selected'); // Add selected class to the current image
        draggable.style.cursor = 'grabbing';

        // Bring the dragged element to the front
        draggable.style.zIndex = ++zIndexCounter;

        // Calculate the initial offset considering the transformation
        const rect = draggable.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        function onMouseMove(event) {
            draggable.style.left = `${event.clientX - offsetX}px`;
            draggable.style.top = `${event.clientY - offsetY}px`;
        }

        function onMouseUp() {
            draggable.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    draggable.addEventListener('dragstart', (event) => {
        event.preventDefault();  // Prevent default dragging behavior
    });
});

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
        let minZIndex = Math.min(...Array.from(draggables).map(d => parseInt(d.style.zIndex)));
        currentDraggable.style.zIndex = minZIndex - 1;
    }
});

document.getElementById('purchaseBtn').addEventListener('click', () => {
    alert('Your design has been saved! Proceed to purchase.');
    // Here you would add the code to handle the purchase process
});

// Handle the save button
document.getElementById('saveBtn').addEventListener('click', () => {
    const container = document.getElementById('designContainer');
    const containerRect = container.getBoundingClientRect();

    // Calculate the center of the container
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    // Define the capture area dimensions
    const captureWidth = 600;
    const captureHeight = 600;

    // Calculate the top-left corner of the capture area
    const offsetX = centerX - captureWidth / 2;
    const offsetY = centerY - captureHeight / 2;

    // Create a canvas element to manually crop the screenshot
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = captureWidth;
    canvas.height = captureHeight;

    // Use html2canvas to capture the entire container
    html2canvas(container, {
        scale: window.devicePixelRatio, // Adjust for high-DPI displays
        scrollX: -window.scrollX, // Account for horizontal scrolling
        scrollY: -window.scrollY  // Account for vertical scrolling
    }).then(fullCanvas => {
        // Draw the desired section onto the new canvas
        context.drawImage(
            fullCanvas,
            offsetX, offsetY, captureWidth, captureHeight, // Source rect
            0, 0, captureWidth, captureHeight // Destination rect
        );

        // Create a download link and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'design_screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});


// Handle the randomize button
document.getElementById('randomizeBtn').addEventListener('click', randomizeThreeImages);

// Randomize all images on page load
window.addEventListener('load', randomizeAllImages);

// Deselect image when clicking anywhere in the container
container.addEventListener('click', (event) => {
    if (currentDraggable && !currentDraggable.contains(event.target)) {
        currentDraggable.classList.remove('selected');
        currentDraggable = null;
    }
});

// Handle the copy button
document.getElementById('copyBtn').addEventListener('click', copyImage);
