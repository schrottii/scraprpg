scenes.credits = () => {
    let BG = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "rgb(0, 0, 0)"
    });

    let backButton = controls.button({
        anchor: [0.89, 0.01], sizeAnchor: [0.1, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            leaveCredits();
        },
        text: "X",
        fill: "white"
    });

    function leaveCredits() {
        if (previousScene == "settings") fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
        if (previousScene == "title") fadeOut(500, false, () => setScene(scenes.title()));
    }



    let creditTexts = [];

    creditTexts.push(controls.label({
        text: "ScrapRPG: Credits",
        anchor: [0.5, 0.4],
        fontSize: 52, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "ScrapRPG team / Toast Tech Team",
        anchor: [0.5, 0.8],
        fontSize: 48, fill: "yellow", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "(2021 - 2023, Phase 1)",
        anchor: [0.5, 0.85],
        fontSize: 36, fill: "yellow", alpha: 1,
    }));



    // Barduzzi (left)
    creditTexts.push(controls.label({
        text: "Barduzzi",
        anchor: [0.2, 1],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 1.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 1.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Map Maker",
        anchor: [0.19, 1.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "help with early maps",
        anchor: [0.21, 1.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Idea Planner",
        anchor: [0.19, 1.15], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "lots of ideas",
        anchor: [0.21, 1.15], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Graphic Designer",
        anchor: [0.19, 1.2], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "early tiles and enemies,",
        anchor: [0.21, 1.2], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "buttons, 3D animations, concepts",
        anchor: [0.21, 1.225], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Story Writer",
        anchor: [0.19, 1.25], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "rough ideas",
        anchor: [0.21, 1.25], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // Decastar (right)
    creditTexts.push(controls.label({
        text: "Decastar",
        anchor: [0.8, 1],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 1.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 1.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "many early core concepts and visions",
        anchor: [0.79, 1.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "the things that shaped ScrapRPG",
        anchor: [0.79, 1.125], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Idea Planner",
        anchor: [0.81, 1.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "some designs, sprites, characters",
        anchor: [0.79, 1.15], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Graphic Designer",
        anchor: [0.81, 1.15], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "concepts and 20+ pages of story",
        anchor: [0.79, 1.2], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Story Writer",
        anchor: [0.81, 1.2], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "6 tracks:",
        anchor: [0.79, 1.25], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Battle Theme, Boss Battle*",
        anchor: [0.79, 1.275], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Title OST, Town*",
        anchor: [0.79, 1.3], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Lead Composer",
        anchor: [0.81, 1.25], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // Citrine (left)
    creditTexts.push(controls.label({
        text: "Citrine",
        anchor: [0.2, 1.5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 1.55], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 1.55], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Graphic Designer",
        anchor: [0.19, 1.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "early tiles and more",
        anchor: [0.21, 1.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Idea Planner",
        anchor: [0.19, 1.65], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "feedback on ideas",
        anchor: [0.21, 1.65], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Composer",
        anchor: [0.19, 1.7], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "-",
        anchor: [0.21, 1.7], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // Zedoreku (right)
    creditTexts.push(controls.label({
        text: "zedoreku",
        anchor: [0.8, 1.5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 1.55], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 1.55], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "house door and window",
        anchor: [0.79, 1.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Graphic Designer",
        anchor: [0.81, 1.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // TheKingofTrash (left)
    creditTexts.push(controls.label({
        text: "TheKingofTrash",
        anchor: [0.2, 2],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 2.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 2.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Graphic Designer",
        anchor: [0.19, 2.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "few enemies, all status effects, elements",
        anchor: [0.21, 2.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Idea Planner",
        anchor: [0.19, 2.15], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "help with rpg elements",
        anchor: [0.21, 2.15], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // elmenda452 (right)
    creditTexts.push(controls.label({
        text: "elmenda452",
        anchor: [0.8, 2],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 2.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 2.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "everyone's favorite",
        anchor: [0.79, 2.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Motivator",
        anchor: [0.81, 2.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // KGod (left)
    creditTexts.push(controls.label({
        text: "KGod",
        anchor: [0.2, 2.5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 2.55], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 2.55], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Game Tester",
        anchor: [0.19, 2.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "very early testing and feedback",
        anchor: [0.21, 2.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // DaGame (right)
    creditTexts.push(controls.label({
        text: "DaGame",
        anchor: [0.8, 2.5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 2.55], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 2.55], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "didn't test",
        anchor: [0.79, 2.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Game Tester",
        anchor: [0.81, 2.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "too inactive",
        anchor: [0.79, 2.65], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Motivator",
        anchor: [0.81, 2.65], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // ducdat0507 (left)
    creditTexts.push(controls.label({
        text: "ducdat0507",
        anchor: [0.2, 3],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 3.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 3.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Programmer",
        anchor: [0.19, 3.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "core (new system), asset loading",
        anchor: [0.21, 3.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // ziemniakbiznesu (right)
    creditTexts.push(controls.label({
        text: "ziemniakbiznesu",
        anchor: [0.8, 3],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 3.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 3.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "nothing that was kept",
        anchor: [0.79, 3.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Programmer",
        anchor: [0.81, 3.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // Schrottii
    creditTexts.push(controls.label({
        text: "Schrottii",
        anchor: [0.5, 3.5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.49, 3.55], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.51, 3.55], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Lead Idea Planner",
        anchor: [0.49, 3.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "many ideas and turning them into reality",
        anchor: [0.51, 3.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Lead Game Tester",
        anchor: [0.49, 3.65], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "testing while deving",
        anchor: [0.51, 3.65], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Main Developer",
        anchor: [0.49, 3.7], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "95% - 99% of phase 1's code",
        anchor: [0.51, 3.7], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "including most scenes, overworld, fights",
        anchor: [0.51, 3.725], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "and since phase 1.5 the internal map maker (fully)",
        anchor: [0.51, 3.75], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "+ particle system, save system & more",
        anchor: [0.51, 3.775], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    creditTexts.push(controls.label({
        text: "Solo development",
        anchor: [0.5, 4],
        fontSize: 48, fill: "yellow", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "(2024 - 2025, Phases 2, 3)",
        anchor: [0.5, 4.05],
        fontSize: 36, fill: "yellow", alpha: 1,
    }));



    // Schrottii
    creditTexts.push(controls.label({
        text: "Schrottii",
        anchor: [0.5, 4.2],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.49, 4.25], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.51, 4.25], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Developer",
        anchor: [0.49, 4.3], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "plenty of minor improvements, polishing and qol",
        anchor: [0.51, 4.3], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "(procrastinating from maps by doing other stuff instead)",
        anchor: [0.51, 4.325], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "credits scene, monster book, quest system",
        anchor: [0.51, 4.35], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Map Maker",
        anchor: [0.49, 4.4], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "all maps in the game (so far)",
        anchor: [0.51, 4.4], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Adding Content",
        anchor: [0.49, 4.5], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: ">100 items, >100 magic spells",
        anchor: [0.51, 4.5], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "enemies, dialogues, tiles, etc.",
        anchor: [0.51, 4.525], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Composer",
        anchor: [0.49, 4.6], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "13 tracks:",
        anchor: [0.51, 4.6], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Crewdiss, Desperate Forest, Introer",
        anchor: [0.51, 4.625], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Lex Alfred, Piasee*, Subzero Ooga*",
        anchor: [0.51, 4.65], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Ugliest Tree Alive*, Warmonger Walls*, theme05",
        anchor: [0.51, 4.675], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // Meowy (left)
    creditTexts.push(controls.label({
        text: "Meowy",
        anchor: [0.2, 5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Roles |",
        anchor: [0.19, 5.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Contributions",
        anchor: [0.21, 5.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Map Maker",
        anchor: [0.19, 5.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Mythical Plains map",
        anchor: [0.21, 5.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // tomekbet (right)
    creditTexts.push(controls.label({
        text: "tomekbet",
        anchor: [0.8, 5],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "Contributions |",
        anchor: [0.79, 5.05], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "| Roles",
        anchor: [0.81, 5.05], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "2 maps",
        anchor: [0.79, 5.1], align: "right",
        fontSize: 24, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "Map Maker",
        anchor: [0.81, 5.1], align: "left",
        fontSize: 24, fill: "white", alpha: 1,
    }));



    // notes
    creditTexts.push(controls.label({
        text: "songs with * have an intro and loop version",
        anchor: [0.5, 5.3],
        fontSize: 32, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "I tried to give everyone proper credits, let me know if something is missing",
        anchor: [0.5, 5.35],
        fontSize: 32, fill: "white", alpha: 1,
    }));
    creditTexts.push(controls.label({
        text: "After >500 hours of my time, it is finally there... I am free...",
        anchor: [0.5, 5.4],
        fontSize: 32, fill: "white", alpha: 1,
    }));

    creditTexts.push(controls.label({
        text: "ScrapRPG",
        anchor: [0.5, 5.5],
        fontSize: 64, fill: "yellow", alpha: 1,
    }));



    playMusic("bgm/credits");

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (let ct in creditTexts) {
                creditTexts[ct].anchor[1] -= 0.00003 * delta; // move speed
            }

            if (currentKeys[" "]) {
                for (let ct in creditTexts) {
                    creditTexts[ct].anchor[1] += 0.0003 * delta; // - x9
                }
            }
            if (currentKeys["arrowright"]) {
                for (let ct in creditTexts) {
                    creditTexts[ct].anchor[1] -= 0.0006 * delta; // x21
                }
            }

            if (creditTexts[creditTexts.length - 1].anchor[1] < 0) leaveCredits();
        },
        // Controls
        controls: [
            BG, backButton, ...creditTexts
        ],
        name: "credits"
    }
}