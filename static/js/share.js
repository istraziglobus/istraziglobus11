document.addEventListener('DOMContentLoaded', () => {
    const shareButtons = document.querySelectorAll('.share-button');

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const platform = button.getAttribute('data-share-platform');
            const url = encodeURIComponent(button.getAttribute('data-share-url'));
            const title = encodeURIComponent(button.getAttribute('data-share-title'));

            let shareUrl = '';

            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                    break;
                case 'viber':
                    shareUrl = `viber://forward?text=${title}%20${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${title}%0A%0APročitajte više na: ${url}`;
                    break;
                default:
                    return;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
});