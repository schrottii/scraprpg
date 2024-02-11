// basic animations
let animators = [];

function addAnimator(fs) {
    animators.push({ time: 0, func: fs });
}

function updateAnimators(delta) {
    for (let a = 0; a < animators.length; a++) {
        animators[a].time += delta;
        let val = animators[a].func(animators[a].time)
        if (val) {
            //console.log(val)
            animators.splice(a, 1);
            a--;
        }
    }
}

/* data/images/protagonists
 | battle       | battleAnimation()
 | map          | overworld (game.js)
 | other        | emotionAnimation()
 | portraits    | getEmotion()
 | worldmode    | overworld (game.js)
*/

// emotional stuff

// takes from the portrait files, used for dialogues
function getEmotion(emotion) {
    // This function returns image for portrait
    switch (emotion) {
        case "neutral":
            return [0, 0, 64, 64];
            break;
        case "happy":
            return [0, 64, 64, 64];
            break;
        case "love":
            return [0, 128, 64, 64];
            break;
        case "disappointed":
            return [0, 192, 64, 64];
            break;
        case "sad":
            return [0, 256, 64, 64];
            break;
        case "angry":
            return [0, 320, 64, 64];
            break;
        default:
            return [0, 0, 64, 64];
            break;
    }
}

// takes from the other files, used in fight and cutscenes
function emotionAnimation(char, emotion) { // Epic rhyme
    // This function returns, well, emotion animation pics (laughing, victory, etc.)
    let file = char + "_ani";
    if (images[file] == undefined) return false;
    let snip = [];
    let size = 32;
    let amount = 1;
    switch (emotion) {
        case "disappointed":
            snip = [0, 0, size, size];
            break;
        case "love":
            snip = [size, 0, size, size];
            break;
        case "crying":
            snip = [size * 2, 0, size, size];
            break;
        case "laugh":
            snip = [0, size, size, size];
            amount = 2;
            break;
        case "victory":
            snip = [size * 2, size, size, size];
            amount = 2;
            break;
        case "anger":
            snip = [size * 4, size, size, size];
            break;
    }
    return [file, snip, amount];
}

// takes from the battle sprite sheets, used in fight / battle
function battleAnimation(char, emotion, anit = 0) {
    // This function returns, well, emotion animation pics (laughing, victory, etc.)
    let file = char + "_battle";
    if (images[file] == undefined) return false;
    let snip = [];
    let size = 32;
    anit *= size;

    switch (emotion) {
        case "unassigned": // not ass
            // >1/4 HP | >1/8 HP | >0 HP | dead
            if (game.characters[char].HP > getStat(char, "maxHP") / 4) snip = [0, anit, size, size];
            else if (game.characters[char].HP > getStat(char, "maxHP") / 8) snip = [size * 2, size * 2 + anit, size, size];
            else if (game.characters[char].HP > 0) snip = [size * 3, size * 2 + anit, size, size];
            else snip = [0, size * 4, size, size]; // dead
            break;

        // first/second row
        case "attack":
            snip = [size, anit, size, size];
            break;
        case "item":
            snip = [size * 2, anit, size, size];
            break;
        case "magic":
            snip = [size * 3, anit, size, size];
            break;
        case "defend":
            snip = [size * 4, anit, size, size];
            break;
        case "flee":
            snip = [size * 5, anit, size, size];
            break;

        // third/fourth row
        case "hurt": // normal damage
            snip = [0, size * 2 + anit, size, size];
            break;
        case "hurt2": // critical hit damage
            snip = [size, size * 2 + anit, size, size];
            break;
        case "sleep":
            snip = [size * 4, size * 2 + anit, size, size];
            break;
        case "???":
            snip = [size * 5, size * 2 + anit, size, size];
            break;
        case "poison": // poison AND acid
            snip = [size * 6, size * 2 + anit, size, size];
            break;
        case "burn": // burn / fire
            snip = [size * 7, size * 2 + anit, size, size];
            break;
        case "rage": // rage / enraged
            snip = [size, size * 2 + anit, size, size];
            break;

        // fifth row
        case "dead": // dead - replaces old dead files
            snip = [0, size * 4, size, size];
            break;
        case "block": // block / shield
            snip = [size, size * 4, size, size];
            break;
        case "useitem": // you use da item
            snip = [size * 2, size * 4, size, size];
            break;
        case "silence":
            snip = [size * 3, size * 4, size, size];
            break;
        case "condemned":
            snip = [size * 4, size * 4, size, size];
            break;
        case "paralysis":
            snip = [size * 5, size * 4, size, size];
            break;

        // attack animation (top right)
        case "attacking0":
            snip = [size * 6, 0, size, size];
            break;
        case "attacking1":
            snip = [size * 7, 0, size, size];
            break;
        case "attacking2":
            snip = [size * 8, 0, size, size];
            break;
        case "attacking3":
            snip = [size * 9, 0, size, size];
            break;
    }
    return snip;
}