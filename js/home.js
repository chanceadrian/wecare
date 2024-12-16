document.querySelectorAll('.exhibit').forEach(section => {
    const wall = section.querySelector('.wall');
    const items = Array.from(wall.children).filter(child =>
        child.tagName === 'LI' || child.tagName === 'A'
    );
    const caption = section.querySelector('#caption');
    let currentIndex = 0;
    let isFirstLoad = true;

    // Function to update the active state and caption
    const updateActiveItem = (index) => {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        if (!isFirstLoad) {
            items[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (caption && items[index].dataset.text) {
            caption.textContent = items[index].dataset.text;
        }
    };

    // Initialize the first item as active
    if (items.length > 0) {
        updateActiveItem(currentIndex);
    }

    // Handle keyboard navigation
    const handleKeydown = (e) => {
        if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % items.length;
            updateActiveItem(currentIndex);
        } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateActiveItem(currentIndex);
        }
    };

    // Set up IntersectionObserver for better caption updates
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (caption && entry.target.dataset.text) {
                    caption.textContent = entry.target.dataset.text;
                }
            }
        });
    }, { threshold: 1 });

    // Observe all items in the wall
    items.forEach(item => observer.observe(item));

    // Focusable section and event listeners
    section.setAttribute('tabindex', '0');
    section.addEventListener('keydown', handleKeydown);

    // Prevent scroll on first load
    window.addEventListener('load', () => { isFirstLoad = false; });
});
