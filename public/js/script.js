document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle'); // Selektuj sve elemente za uključivanje podmenija

    if (hamburger && dropdownMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('is-active'); // Dodaj/ukloni klasu za animaciju hamburgera
            dropdownMenu.classList.toggle('active'); // Uključi/isključi 'active' klasu na padajućem meniju
        });

        // Zatvori padajući meni ako se klikne van njega
        document.addEventListener('click', function(event) {
            if (!dropdownMenu.contains(event.target) && !hamburger.contains(event.target)) {
                dropdownMenu.classList.remove('active');
                hamburger.classList.remove('is-active'); // Deaktiviraj ikonicu hamburgera
                // Zatvori i sve otvorene podmenije kada se klikne van glavnog menija
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

    // Rukovanje otvaranjem/zatvaranjem podmenija
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault(); // Spreči podrazumevano ponašanje linka
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                // Zatvori sve ostale podmenije pre otvaranja novog
                submenuToggles.forEach(otherToggle => {
                    if (otherToggle !== this) { // Ne zatvaraj trenutni
                        otherToggle.classList.remove('rotated');
                        const otherSubmenu = otherToggle.nextElementSibling;
                        if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                            otherSubmenu.classList.remove('active');
                        }
                    }
                });

                submenu.classList.toggle('active');
                this.classList.toggle('rotated'); // Rotira ikonicu strelice
            }
        });
    });
});