var shops = {
    default(args) {
        return {
            name: "none",
            dialogue: [],
            clv: 1,
            offers: [],

            ...args || {},
        }
    },
    placeholder(args) {
        return {
            ...shops.default(),

            name: "Yeeeaaaahhhh",
            dialogue: ["Welcome to my shop!", "This is actually just a placeholder text...", "But it works pretty well, doesn't it?", "Aw man, I appreciate you so much.", "I'm not a real merchant. I don't know how to sell stuff." , "I'm actually a critic.", "There is still a lot to do, huh? Not really. Some minor things. But there is already so much!"],
            offers: [["brickyleaf"], ["superswamp"]],

            ...args || {},
        }
    },
};