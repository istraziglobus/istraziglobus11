document.addEventListener('DOMContentLoaded', function () {
    // HAMBURGER + DROPDOWN
    const hamburger = document.querySelector('.hamburger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    if (hamburger && dropdownMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('is-active');
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownMenu.contains(event.target) && !hamburger.contains(event.target)) {
                dropdownMenu.classList.remove('active');
                hamburger.classList.remove('is-active');

                submenuToggles.forEach(toggle => {
                    toggle.classList.remove('rotated');
                    const submenu = toggle.nextElementSibling;
                    if (submenu && submenu.classList.contains('submenu')) {
                        submenu.classList.remove('active');
                    }
                });
            }
        });
    }

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenuToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.classList.remove('rotated');
                        const otherSubmenu = otherToggle.nextElementSibling;
                        if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                            otherSubmenu.classList.remove('active');
                        }
                    }
                });

                submenu.classList.toggle('active');
                this.classList.toggle('rotated');
            }
        });
    });

    // KLIK NA ZELENI TAG – OTVORI SEKCIJU
    document.addEventListener('click', function (e) {
        const tag = e.target.closest('.article-section-tag[data-section-url]');
        if (!tag) return;

        console.log('Klik na TAG:', tag.dataset.sectionUrl); // TEST

        e.preventDefault();
        e.stopPropagation();
        window.location.href = tag.dataset.sectionUrl;
    });
});