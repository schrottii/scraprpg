scenes.title = () => {
    musicPlayer.src = audio["bgm/vaporlim"].src;
    musicPlayer.volume = .5;
    musicPlayer.play();

    let state = "title";

    let particles = [];
    
        
    let gameIcon = controls.image({
        anchor: [.5, .4], offset: [-277.5, -200], sizeOffset: [555, 300],
        source: "gameicon",
    });
    let contLabel = controls.label({
        anchor: [.5, .6], offset: [0, 75],
        text: "Click anywhere to continue...",
    });
    let infoLabel = controls.label({
        anchor: [.02, .98], offset: [5, -12],
        align: "left", baseline: "alphabetic", fontSize: 16, fill: "#afafaf",
        text: "©2022 Toast Technology",
    });
    let verLabel = controls.label({
        anchor: [.98, .98], offset: [-5, -12],
        align: "right", baseline: "alphabetic", fontSize: 16, fill: "#afafaf",
        text: "v0.2",
    });

    let save1Button = controls.button({
        anchor: [1.2, .5], offset: [0, -220], sizeAnchor: [.6, 0], sizeOffset: [0, 120],
        text: "New Game",
        onClick(args) {
            setScene(scenes.game());
        }
    });
    let save2Button = controls.button({
        anchor: [1.2, .5], offset: [0, -90], sizeAnchor: [.6, 0], sizeOffset: [0, 120],
        text: "New Game",
        onClick(args) {
            setScene(scenes.game());
        }
    });
    let save3Button = controls.button({
        anchor: [1.2, .5], offset: [0, 40], sizeAnchor: [.6, 0], sizeOffset: [0, 120],
        text: "New Game",
        onClick(args) {
            setScene(scenes.game());
        }
    });
    let deleteButton = controls.button({
        anchor: [-.8, .5], offset: [0, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Delete",
    });
    let optionButton = controls.button({
        anchor: [-.2, .5], offset: [-150, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Options",
    });

    return {
        // Pre-render function
        preRender(ctx, delta) {
            let w = ctx.canvas.width;
            let h = ctx.canvas.height;
            for (let a = 0; a < particles.length; a++) {
                let par = particles[a];
                let scale = 1 / ((20000 - par[2]) / 500);
                par[2] += delta;
                if (par[2] > 20000) {
                    particles.splice(a, 1);
                    a--;
                } else {
                    ctx.fillStyle = "#ffffff" + Math.min(Math.floor(par[2] / 20), 255).toString(16).padStart(2, "0");
                    ctx.beginPath();
                    ctx.arc(par[0] * scale * 20 + w / 2, par[1] * scale * 20 + h / 2, 5 * scale, 0, Math.PI * 2);
                }
                ctx.fill();
            }
            for (let a = 0; a < delta; a += 200) {
                particles.push(
                    [Math.random() * w * 2 - w, Math.random() * h * 2 - h, delta - a], 
                );
            }
            
            if (state == "title") {
                contLabel.fill = "#ffffff" + Math.floor((Math.cos(time / 1000) + 3) * 64).toString(16).padStart(2, "0");
            }
        },

        // Controls
        controls: [
            gameIcon, contLabel, infoLabel, verLabel,
            controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                onClick() {
                    state = "menu";
                    this.clickthrough = true;
                    addAnimator(function (t) {

                        gameIcon.anchor[1] = .4 - .5 * Math.min(t / 800, 1) ** 4;
                        gameIcon.offset[1] = -200 - 100 * Math.min(t / 800, 1) ** 4;
                        contLabel.anchor[1] = .6 + .5 * Math.min(t / 800, 1) ** 4;
                        contLabel.fill = "#ffffff" + Math.floor((Math.cos(t / 20) + 1) * 127).toString(16).padStart(2, "0");
                        infoLabel.offset[1] = verLabel.offset[1] = -12 + 120 * (t / 800) ** 4;

                        save1Button.anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        save2Button.anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        save3Button.anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        deleteButton.anchor[0] = -.8 + (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        optionButton.anchor[0] = -.2 + (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);

                        if (t > 3000) {
                            return true;
                        }
                        return false;
                    })
                }
            }),
            save1Button, save2Button, save3Button,
            deleteButton, optionButton,
        ],
    }
};