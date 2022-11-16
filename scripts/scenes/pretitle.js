scenes.pretitle = () => {

    let cancel = false;
    let tokenStay = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        source: "tttanimation", snip: [3200, 9000, 800, 450],
        alpha: 0,
    });

    image_animation(images.schrottgamesanimation, 5, 15, 2000, 3375, 50);
    setTimeout(() => {
        if (!cancel) image_animation(images.tttanimation, 5, 21, 4000, 9450, 25)
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
            musicPlayer.loop = true;
            setScene(scenes.title());
        }
    }, 5150 + 2625);

    return {
        // Pre-render function
        preRender(ctx, delta) {

        },
        // Controls
        controls: [
            tokenStay,
            controls.button({
                anchor: [.5, .5], offset: [-100, 5], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Start Muted",
                onClick() {
                    playSound("buttonClickSound");
                    musicPlayer.muted = true;
                    soundPlayer.muted = true;
                    setScene(scenes.title());
                }
            }),

            controls.button({
                anchor: [.9, .8], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Dev Mode",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    //playMusic("bgm/boss", "bgm/placeholder");
                    //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                    saveNR = 3;
                    loadGame();
                    loadSettings();
                    canMove = true;
                    setScene(scenes.game());
                    //openShop("placeholder");
                }
            }),
            controls.button({
                anchor: [.9, .9], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Fight",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    //playMusic("bgm/boss", "bgm/placeholder");
                    //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                    saveNR = 3;
                    loadGame();
                    loadSettings();
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    setScene(scenes.fight());
                }
            }),
            controls.button({
                anchor: [.9, .6], sizeOffset: [100, 50],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Map Maker",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    setScene(scenes.mapmaker());
                }
            }),
        ],
        name: "pretitle"
    }
}