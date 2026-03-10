function addListeners() {
    const animasterApi = animaster();
    let stopper;
    let moveAndHideControl;

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
            moveAndHideControl = animasterApi.moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideControl) {
                moveAndHideControl.reset();
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animasterApi.showAndHide(block, 2000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopper = animasterApi.heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (stopper)
                stopper.stop();
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

function animaster() {
    return {
        _steps: [],
        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation
            })
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                ratio: ratio
            })
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration
            })
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration
            })
            return this;
        },
        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration: duration
            })
            return this;
        },
        play(element, cycled = false) {
            let timeouts = [];
            const runCycle = () => {
                timeouts = timeouts.filter(id => {
                    clearTimeout(id);
                    return false;
                });
                let currentDelay = 0;
                this._steps.forEach(anim => {
                    const timerId = setTimeout(() => {
                        switch (anim.name) {
                            case 'move':
                                this.move(element, anim.duration, anim.translation);
                                break;
                            case 'scale':
                                this.scale(element, anim.duration, anim.ratio);
                                break;
                            case 'fadeIn':
                                this.fadeIn(element, anim.duration);
                                break;
                            case 'fadeOut':
                                this.fadeOut(element, anim.duration);
                                break;
                        }
                    }, currentDelay);
                    timeouts.push(timerId);
                    currentDelay += anim.duration;
                });
            };
            runCycle();
            let intervalId;
            if (cycled) {
                const totalDuration = this._steps.reduce((sum, step) => sum + step.duration, 0);
                intervalId = setInterval(runCycle, totalDuration);
            }
            return {
                stop: () => {
                    if (intervalId) clearInterval(intervalId);
                    timeouts.forEach(id => clearTimeout(id));
                },
                reset: () => {
                    if (intervalId) clearInterval(intervalId);
                    timeouts.forEach(id => clearTimeout(id));
                    resetMoveAndScale(element);
                    resetFadeIn(element);
                    resetFadeOut(element);
                }
            };
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration) {
            const moveDuration = duration * (2 / 5);
            const fadeDuration = duration * (3 / 5);
            return animaster()
                .addMove(moveDuration, {x: 100, y: 20})
                .addFadeOut(fadeDuration)
                .play(element);
        },
        showAndHide(element, duration) {
            const fadeDuration = duration / 3;
            return animaster()
                .addFadeIn(duration)
                .addDelay(fadeDuration)
                .addFadeOut(duration)
                .play(element);
        },
        heartBeating(element) {
            return animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        }
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
}


addListeners();
