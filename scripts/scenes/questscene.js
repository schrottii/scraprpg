scenes.questscene = () => {
    let background = [];
    let questButtons = [];
    let questText = [];

    // Background
    background.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.01], sizeAnchor: [0.98, 0.98],
        alpha: 1,
        fill: colors.topcolor
    }));
    background.push(controls.button({
        anchor: [0.89, 0.01], sizeAnchor: [0.1, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
        },
        text: "X"
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Quests",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));
    background.push(controls.label({ // 5
        anchor: [0.305, 0.06],
        text: "",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    // Generate our lovely buttons
    for (let a = 0; a < 5; a++) {
        questButtons.push(controls.button({
            anchor: [0.1, 0.125 + (a * 0.16)], sizeAnchor: [0.8, 0.15],
            text: "", q: undefined,
            onClick(args) {
                // insta claim
                if (isQuestComplete(this.q) && this.q != undefined && quests[this.q].instaclaim && !isQuestClaimed(this.q)) {
                    claimQuest(this.q);
                }
            }
        }))

        questText.push(controls.label({
            anchor: [0.12, 0.15 + (a * 0.16)],
            align: "left", fontSize: 48, fill: "black",
            text: "", // name
            alpha: 1,
        }));
        questText.push(controls.label({
            anchor: [0.12, 0.2 + (a * 0.16)],
            align: "left", fontSize: 32, fill: "black",
            text: "", // description
            alpha: 1,
        }));
        questText.push(controls.label({
            anchor: [0.12, 0.25 + (a * 0.16)],
            align: "left", fontSize: 32, fill: "black",
            text: "", // progress
            alpha: 1,
        }));

        questText.push(controls.label({
            anchor: [0.875, 0.15 + (a * 0.16)],
            align: "right", fontSize: 32, fill: "black",
            text: "", // ID
            alpha: 1,
        }));
        questText.push(controls.label({
            anchor: [0.875, 0.25 + (a * 0.16)],
            align: "right", fontSize: 32, fill: "black",
            text: "", // time
            alpha: 1,
        }));

        questText.push(controls.image({
            anchor: [0.05, 0.15 + (a * 0.16)], offset: [0, 32],
            sizeOffset: [64, 64],
            source: "items/scroll", alpha: 0
        }));
    }

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            let jj = 0;
            let k = 0;
            let quest;

            for (let q = 0; q < 5; q++) {
                k = q * 6; // things per button

                questText[0 + k].text = "";
                questText[1 + k].text = "";
                questText[2 + k].text = "";

                questText[3 + k].text = "";
                questText[4 + k].text = "";

                questText[5 + k].source = "";
                questText[5 + k].snip = false;
                questText[5 + k].alpha = 0;

                questButtons[q].q = undefined;
                questButtons[q].fillTop = colors.topcolor;
                questButtons[q].fillBottom = colors.bottomcolor;
            }

            for (let q in game.quests) {
                if (quests[q] != undefined && game.quests[q] != undefined) {
                    quest = quests[q];
                    quest.id = (jj + 1);

                    // skip claimed quests
                    if (isQuestClaimed(q)) {
                        continue;
                    }

                    // update texts
                    k = 6 * jj;
                    questText[0 + k].text = quest.name;
                    questText[1 + k].text = quest.description;

                    if (!isQuestComplete(q)) questText[2 + k].text = game.quests[q][0] + "/" + quest.goal[2] + " (" + (getQuestProgress(q) * 100).toFixed(0) + "%)";
                    else if (!isQuestClaimed(q)) {
                        if (quest.instaclaim) questText[2 + k].text = "Complete. Click to claim" + (quests.items != undefined ? Object.keys(quest[q].items.length) + " items" : "");
                        else questText[2 + k].text = "Complete. Go back to the NPC to claim";
                    }
                    else questText[2 + k].text = "* Claimed *";

                    questText[3 + k].text = "Nr." + quest.id;
                    questText[4 + k].text = isQuestClaimed(q) ? getTime(calcQuestDuration(q)) : "-";

                    questText[5 + k].source = quest.source != undefined ? quest.source : "items/scroll";
                    questText[5 + k].snip = quest.snip != undefined ? quest.snip : false;
                    questText[5 + k].alpha = 1;

                    questButtons[jj].q = q;
                    if (isQuestComplete(q)) {
                        questButtons[jj].fillTop = colors.buttontopgreen;
                        questButtons[jj].fillBottom = colors.buttonbottomgreen;
                    }
                    else {
                        questButtons[jj].fillTop = colors.buttontop;
                        questButtons[jj].fillBottom = colors.buttonbottom;
                    }

                    jj++;
                }
            }
        },
        // Controls
        controls: [
            ...background, ...questButtons, ...questText
        ],
        name: "questscene"
    }
}