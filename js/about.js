document.querySelectorAll('.exhibit').forEach(section => {
    const items = Array.from(section.querySelectorAll('.wall li')); // Get all `li` items in the wall
    let currentIndex = 0; // Track the currently active index
    let isFirstLoad = true; // Flag to prevent scroll on first load

    // Function to update the active state and caption
    function updateActiveItem(index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active'); // Add active class to the current item
                // Prevent scroll on first load
                if (!isFirstLoad) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Ensure it's in view
                }
                const description = section.querySelector('#caption');
                const text = item.dataset.text;
                if (description && text) {
                    description.textContent = text;
                }
            } else {
                item.classList.remove('active'); // Remove active class from others
            }
        });
    }

    // Initialize the first item as active
    if (items.length > 0) {
        updateActiveItem(currentIndex);
    }

    // Listen for keydown events to navigate with arrow keys
    section.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % items.length; // Move to the next item, loop around
            updateActiveItem(currentIndex);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length; // Move to the previous item, loop around
            updateActiveItem(currentIndex);
        }
    });

    // Make the section focusable and focus it on load
    section.setAttribute('tabindex', '0'); // Enable focus
    section.focus(); // Ensure the section is focused immediately after load

    // IntersectionObserver to update the caption based on visible items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const description = section.querySelector('#caption');
                const text = entry.target.dataset.text;
                if (text && description) {
                    description.textContent = text;
                }
            }
        });
    }, {
        threshold: 1 // Trigger when 50% of the element is visible
    });

    // Observe all items within this section
    section.querySelectorAll('.wall li').forEach(item => {
        observer.observe(item);
    });

    // Set flag to prevent scroll on first load
    window.addEventListener('load', () => {
        isFirstLoad = false;
    });
});
