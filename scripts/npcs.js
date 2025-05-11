// Non Player Characters (not to be confused with Non Fungible Tokens)

// Movement type:
// 0: Do not move (like a stone)
// 1: Move randomly (like a stupid guy)
// 2: Move in a set pattern (booooring)

let npcs = {
    default: {
        position: [8, 8],
        map: "test",
        alpha: 1,
        head: 0,
        source: "enemies/evil",
        kofs: [0, 0, 0],
        dialogues: {
            1: {
                "type": "normal",
                "lines": [
                    { text: "Hello this is a test dialogue", portrait: "Portraits_Bleu", emotion: "happy", name: "Bleu" },
                    { text: "Second text", portrait: "Portraits_Bleu", emotion: "neutral", name: "Bleu" },
                    { text: "Don't forget to subscribe to my channel", portrait: "Portraits_Bleu", emotion: "angry", name: "Bleu" },
                ],
            }
        },
        movement: 0,
        talk: false,
        path: false, // 0 down 1 left 2 right 3 up
        pathProgress: 0,

        movementTime: 0,
        walkingInterval: 0.5, // time between walks
        walkingSpeed: 1, // how long it takes to walk from one tile to another (in seconds)
    },
    blue: {
        position: [5, 1],
        map: "map2",
        source: "bleu",
        dialogues: {
            1: {
                "type": "normal",
                "lines": [
                    { text: "Hii I'm Blue", portrait: "Portraits_Bleu", emotion: "happy", name: "Blue" },
                    { text: "No I'm not Bleu! I'm not you! I'm Blue!", portrait: "Portraits_Bleu", emotion: "angry", name: "Blue" },
                    { text: "Hey man, I think you're me.", portrait: "Portraits_Bleu", emotion: "neutral", name: "Bleu" },
                    { text: "I'm a greek emo. I hate you!!!", portrait: "Portraits_Bleu", emotion: "sad", name: "Blue" },
                    { text: "Why are you blue like me that can't be you're a clone", portrait: "Portraits_Bleu", emotion: "sad", name: "Blue" },
                    { text: "Idiots.", portrait: "Portraits_Corelle", emotion: "neutral", name: "The girl", script: () => { openShop("placeholder"); } },
                ],
            }
        },
        movement: 1,
    },
    evilskro: {
        position: [17, 1],
        map: "test",
        source: "skro",
        dialogues: {
            1: {
                "type": "normal",
                "lines": [
                    { text: "I am friendly Skro.", portrait: "Portraits_Skro", emotion: "sad", name: "Skro", voice: "female_young" },
                    { text: "NO! I am evil Skro!!!", portrait: "Portraits_Skro", emotion: "angry", name: "Skro" },
                    { text: "Guys, I think he is evil!", portrait: "Portraits_Gau", emotion: "happy", name: "Gau" },
                    { text: "Spam is not allowed!", portrait: "Portraits_Gau", emotion: "angry", name: "Gau" },
                    { text: "Skro? More like oh no", portrait: "Portraits_Corelle", emotion: "neutral", name: "Corelle" },
                    { text: "Good Night.", portrait: "Portraits_Skro", emotion: "love", name: "oh no" },
                    {
                        text: "Good Night.", portrait: "Portraits_Skro", emotion: "love", name: "oh no", script: () => {
                            startFight("nogameover", [["itsalive", 2, 0], ["itsalive", 2, 1], ["itsalive", 2, 2], ["nottoofresh", 0, 1]]);
                        }
                    },
                ],
            }
        },
        movement: 1,
    },
    cowboy: {
        position: [15, 1],
        map: "test",
        source: "skro",
        dialogues: {
            1: {
                "type": "normal",
                "lines": [
                    { text: "Yeehaw! I'm a cowboy", portrait: "Portraits_Skro", emotion: "happy", name: "Skro" },
                    { text: "What? We are not in the Wild West?!", portrait: "Portraits_Skro", emotion: "disappointed", name: "Skro" },
                    { text: "Time to change that", portrait: "Portraits_Skro", emotion: "love", name: "Skro", script: () => { filterSepia(50); } },
                    { text: "BBQ, horses, tumbleweeds... the usual cowboy stuff.", portrait: "Portraits_Skro", emotion: "happy", name: "Skro" },
                    { text: "You're a robot.", portrait: "Portraits_Kokitozi", emotion: "angry", name: "Koki", script: () => { filterGray(50); } },
                    { text: "Beep boop.", portrait: "Portraits_Skro", emotion: "neutral", name: "Skro" },
                    { text: "I am the S-K-R-O-B-O-T-3 0 0 0 . . .", portrait: "Portraits_Skro", emotion: "love", name: "Skro" },
                    { text: "Sigh.", portrait: "Portraits_Kokitozi", emotion: "disappointed", name: "Koki", script: () => { clearFilter(); } },
                ],
            }
        },
        movement: 0,
    },
    placeholder3: {
        position: [3, 22],
        map: "test",
        source: "bleu",
        dialogues: {
            1: ["normal", ["Ey", "Portraits_Bleu", "happy", "Bleu"],
                ["Ayo (+1 Potion!)", "Portraits_Bleu", "angry", "Bleu", () => {
                    addItem("potion", 1);
                }]]
        },
        movement: 2,
        walkingInterval: 0.2,
        path: [2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    }
};