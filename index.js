function addListeners() {
    const animasterApi = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animasterApi.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animasterApi.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animasterApi.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animasterApi.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animasterApi.moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animasterApi.showAndHide(block, 2000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animasterApi.heartBeating(block);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster(){
    return {
        move (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide (element, duration) {
            const moveDuration = duration * (2/5);
            const fadeDuration = duration * (3/5);
            this.move(element, moveDuration, { x: 100, y: 20 });
            setTimeout(() => {
                this.fadeOut(element, fadeDuration);
            }, moveDuration);
        },
        showAndHide (element, duration) {
            const fadeDuration = duration / 3;
            this.fadeIn(element, fadeDuration);
            setTimeout(() => {
                this.fadeOut(element, fadeDuration);
            }, fadeDuration * 2);
        },
        heartBeating(element) {
            const beat = () => {
                this.scale(element, 0.5, 1.4);
                setTimeout(() => {
                    this.scale(element, 0.5, 1);
                }, 500);
            };
            beat();
            setInterval(beat, 1000);
        }
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList().add('hide');
        element.classList().remove('show')

    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList().add('hide');
        element.classList().remove('show')
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, null);
    }
}


addListeners();
