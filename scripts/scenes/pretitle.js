scenes.pretitle = () => {
    let cancel = false;

    let BG = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "rgb(0, 0, 0)",
        onClick(args) {
            if (musicPlayer.paused) playMusic("bgm/intro");
        }
    })

    let tokenStay = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        source: "tttanimation", snip: [3200, 9000, 800, 450],
        alpha: 0,
    });

    playMusic("bgm/intro");

    // image animations (schrott games)
    createImageAnimation(images.schrottgamesanimation, 5, 15, 2000, 3375, 50);
    setTimeout(() => {
        if (!cancel) createImageAnimation(images.tttanimation, 5, 21, 4000, 9450, 25)
    }, 3650);
    setTimeout(() => {
        tokenStay.alpha = 1;
        addAnimator(function (t) {
            tokenStay.alpha = 1 - Math.max(0, ((t / 500) - 1));

            if (t > 1499) {
                tokenStay.alpha = 0;
                return true;
            }
            return false;
        })
    }, 3650 + 2625);
    setTimeout(() => {
        if (!cancel) {
            setScene(scenes.title());
        }
    }, 5150 + 2625);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            if (currentKeys["w"] && currentKeys["u"]) {
                currentKeys["w"] = false;
                currentKeys["u"] = false;
                if (prompt("?") == "NOOBVSPRO") {
                    localStorage.setItem("SRPGcheats", ["devmode"]);
                }
            }
        },
        // Controls
        controls: [
            BG, tokenStay,

            controls.button({
                anchor: [.9, .8], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: isDevMode() ? 1 : 0,
                text: "Dev Mode",
                onClick() {
                    if (this.alpha == 1) {
                        cancel = true;
                        //musicPlayer.muted = true; // false?
                        soundPlayer.muted = false;

                        loadSettings();
                        changeSoundVolume(settings.soundVolume);
                        playSound("titletransition");

                        stopMusic();
                        //playMusic("bgm/boss", "bgm/placeholder");
                        //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                        saveNR = 0;

                        loadGame();
                        loadSettings();

                        if (maps[game.map] == undefined) game.map = "test";
                        canMove = true;
                        setScene(scenes.game());
                        //openShop("placeholder");
                    }
                }
            }),
            controls.button({
                anchor: [.9, .9], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: isDevMode() ? 1 : 0,
                text: "Fight",
                onClick() {
                    if (this.alpha == 1) {
                        cancel = true;
                        musicPlayer.muted = false; // false?
                        soundPlayer.muted = false;

                        loadSettings();
                        changeSoundVolume(settings.soundVolume);
                        playSound("titletransition");

                        stopMusic();
                        playMusic("bgm/fight");
                        //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                        saveNR = 0;

                        loadGame();
                        loadSettings();

                        game.map = "test";

                        exampleFight();

                        setScene(scenes.fight());
                    }
                }
            }),
            controls.button({
                anchor: [.9, .6], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: isDevMode() ? 1 : 0,
                text: "Map Maker",
                onClick() {
                    if (this.alpha == 1) {
                        cancel = true;
                        musicPlayer.muted = true; // false?
                        soundPlayer.muted = false;

                        loadSettings();
                        changeSoundVolume(settings.soundVolume);
                        playSound("titletransition");

                        stopMusic();
                        setScene(scenes.mapmaker());
                    }
                }
            }),
        ],
        name: "pretitle"
    }
}