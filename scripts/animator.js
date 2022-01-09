let animators = [];

function addAnimator(fs) {
    animators.push({ time: 0, func: fs });
}

function updateAnimators(delta) {
    for (let a = 0; a < animators.length; a++) {
        animators[a].time += delta;
        let val = animators[a].func(animators[a].time)
        if (val) {
            console.log(val)
            animators.splice(a, 1);
            a--;
        }
    }
}