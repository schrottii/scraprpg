let cancel = false;

scenes["pretitle"] = new Scene(
    () => {
        // Init
        createSquare("BG", 0, 0, 1, 1, "#000000");
        createImage("imageAnimation", 0, 0, 1, 1, "tttanimation", { alpha: 0 });
        objects["imageAnimation"].snip = [3200, 9000, 800, 450];

        /*
        pre-wggj:
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
        */

        createButton("devbtn1", 0.7, 0.85, 0.2, 0.08, "button", () => {
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
            loadScene("overworld");
            //openShop("placeholder");
        }, { aText: { textBaseline: "bottom", text: "Dev Mode", size: 24 }, power: isDevMode() });

        createButton("devbtn2", 0.7, 0.75, 0.2, 0.08, "button", () => {
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
        }, { aText: { textBaseline: "bottom", text: "Fight", size: 24 }, power: isDevMode() });

        createButton("devbtn3", 0.7, 0.65, 0.2, 0.08, "button", () => {
            cancel = true;
            musicPlayer.muted = true; // false?
            soundPlayer.muted = false;

            loadSettings();
            changeSoundVolume(settings.soundVolume);
            playSound("titletransition");

            stopMusic();
            loadScene("mapmaker");
        }, { aText: { textBaseline: "bottom", text: "Map Maker", size: 24 }, power: isDevMode() });

        createButton("devbtn4", 0.7, 0.55, 0.2, 0.08, "button", () => {
            cancel = true;
            loadScene("title");
        }, { aText: { textBaseline: "bottom", text: "Skip", size: 24 }, power: isDevMode() });



        // image animations (schrott games)
        createImageAnimation("schrottgamesanimation", 5, 15, 2000, 3375, 50);
        setTimeout(() => {
            if (!cancel) createImageAnimation("tttanimation", 5, 21, 4000, 9450, 25)
        }, 3250);

        setTimeout(() => {
            if (!cancel) {
                objects["imageAnimation"].alpha = 1;

                createAnimation("fade", "imageAnimation", (t, d, a) => t.alpha = 1 - a.pct, 1.5, true);
            }

            /*
            pre-wggj:
            addAnimator(function (t) {
                tokenStay.alpha = 1 - Math.max(0, ((t / 500) - 1));

                if (t > 1499) {
                    tokenStay.alpha = 0;
                    return true;
                }
                return false;
            })
            */
        }, 3250 + 2250);

        setTimeout(() => {
            if (!cancel) {
                loadScene("title");
            }
        }, 3250 + 2250 + 2000);

        playMusic("bgm/intro");
    },
    (tick) => {
        // Loop
        updateImageAnimation(tick * 1000);

        if (currentKeys["w"] && currentKeys["u"]) {
            currentKeys["w"] = false;
            currentKeys["u"] = false;
            if (!isElectron() && prompt("?") == "NOOBVSPRO") {
                localStorage.setItem("SRPGcheats", ["devmode"]);
                loadScene("pretitle");
            }
        }
    }
);

/*
return {
    // Pre-render function
    preRender(ctx, delta) {
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
                    
                }
            }
        }),
        controls.button({
            anchor: [.9, .9], sizeOffset: [100, 50],
            clickthrough: false, fontSize: 16, alpha: isDevMode() ? 1 : 0,
            text: "Fight",
            onClick() {
                if (this.alpha == 1) {
                    
                }
            }
        }),
        controls.button({
            anchor: [.9, .6], sizeOffset: [100, 50],
            clickthrough: false, fontSize: 16, alpha: isDevMode() ? 1 : 0,
            text: "Map Maker",
            onClick() {
                if (this.alpha == 1) {
                    
                }
            }
        }),
    ],
    name: "pretitle"
}
*/