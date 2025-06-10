document.addEventListener('DOMContentLoaded', () => {
    const mysticalCursor = document.querySelector('.mystical-cursor');
    let cursorActiveTimeout;

    function updateCursorPosition(e) {
        mysticalCursor.style.left = e.clientX + 'px';
        mysticalCursor.style.top = e.clientY + 'px';

        mysticalCursor.classList.add('active');

        clearTimeout(cursorActiveTimeout);

        cursorActiveTimeout = setTimeout(() => {
            mysticalCursor.classList.remove('active');
        }, 1500);
    }

    document.addEventListener('mousemove', updateCursorPosition);

    document.addEventListener('mouseenter', () => {
        mysticalCursor.classList.add('active');
        clearTimeout(cursorActiveTimeout);
    });

    document.addEventListener('mouseleave', () => {
        mysticalCursor.classList.remove('active');
        clearTimeout(cursorActiveTimeout);
    });

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mousedown', () => {
            item.style.transform = 'scale(0.98)';
            item.style.filter = 'brightness(1.2)';
        });
        item.addEventListener('mouseup', () => {
            item.style.transform = '';
            item.style.filter = '';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.filter = '';
        });
    });
});