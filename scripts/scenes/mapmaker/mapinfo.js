scenes["mapinfo"] = new Scene(
    () => {
        // Init

        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Map Info", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            loadScene("mapmaker");
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);



        // CONTENTS
        // essential
        createText("section_essential", 0.05, 0.2, "Essential", { size: 24, color: colors.buttonbottompressed, align: "left" });

        createButton("essential_mapname", 0.05, 0.25, 0.18, 0.08, "button", (c) => {
            let newName = prompt("New map name?");
            if (isValid(newName)) mm_map.name = newName;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Map name", color: "black", size: 20, textBaseline: "middle" } });
        objects["essential_mapname"].uText = (c) => { c.text = "Map name: " + mm_map.name; };

        createButton("essential_mapID", 0.25, 0.25, 0.18, 0.08, "button", (c) => {
            let newName = prompt("New map ID?");
            if (isValid(newName)) {
                mm_map.id = newName;
                mapmaker.currentMap = newName; // changing ID
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Map ID", color: "black", size: 20, textBaseline: "middle" } });
        objects["essential_mapID"].uText = (c) => { c.text = "Map ID: " + mm_map.id; };

        createButton("essential_creator", 0.45, 0.25, 0.18, 0.08, "button", (c) => {
            let newName = prompt("Who made this?");
            if (isValid(newName)) {
                mm_map.creator = newName;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["essential_creator"].uText = (c) => { c.text = "Creator: " + mm_map.creator; };



        // music
        createText("section_music", 0.65, 0.2, "Music", { size: 24, color: colors.buttonbottompressed, align: "left" });

        createButton("music_musicintro", 0.65, 0.25, 0.18, 0.08, "button", (c) => {
            //mapInfoControls[6].onClick();
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["music_musicintro"].uText = (c) => { c.text = "Music intro: " + mm_map.intro; };

        createButton("music_musicloop", 0.85, 0.25, 0.18, 0.08, "button", (c) => {
            if (audio[selectedInfo] != undefined) {
                mm_map.music = selectedInfo;
                if (audio[selectedInfo + "/intro"] != undefined) mm_map.intro = selectedInfo + "/intro";
                else mm_map.intro = undefined;
                selectedInfo = "";

                hideInfo();
                this.uText();
            }
            else {
                showInfo();
                renderInfo("music");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["music_musicloop"].uText = (c) => { c.text = "Music loop: " + mm_map.music; };



        // weather
        createText("section_weather", 0.05, 0.4, "Weather", { size: 24, color: colors.buttonbottompressed, align: "left" });

        createButton("weather_weathertype", 0.05, 0.45, 0.18, 0.08, "button", (c) => {
            let co = objects[c];
            let weathers = ["none", "fog", "rain", "dust"];
            let newWeather = co.i < weathers.length - 1 ? weathers[co.i + 1] : weathers[0];
            co.i += 1;
            if (co.i >= weathers.length) co.i = 0;
            mm_map.weather = newWeather;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["weather_weathertype"].uText = (c) => { c.text = "Weather: " + mm_map.weather; };
        objects["weather_weathertype"].i = 0;

        createButton("weather_weatherstrength", 0.25, 0.45, 0.18, 0.08, "button", (c) => {
            let newWeather = prompt("New weather strength? (default is 1)");
            if (newWeather != undefined) {
                if (newWeather == "" || newWeather == false) newWeather = 1;
                mm_map.weatherStrength = parseInt(newWeather);
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["weather_weatherstrength"].uText = (c) => { c.text = "Weather Strength: " + mm_map.weatherStrength; };

        createButton("weather_worldmode", 0.45, 0.45, 0.18, 0.08, "button", (c) => {
            if (mm_map.worldmode != true) {
                mm_map.worldmode = true;
            }
            else {
                mm_map.worldmode = false;
                game.position[0] = Math.ceil(game.position[0]);
                game.position[1] = Math.ceil(game.position[1]);
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["weather_worldmode"].uText = (c) => { c.text = "Worldmode: " + (mm_map.worldmode ? "ON" : "OFF"); };



        // packs
        createText("section_packs", 0.65, 0.4, "Packs", { size: 24, color: colors.buttonbottompressed, align: "left" });

        createButton("packs_addpack", 0.65, 0.45, 0.18, 0.08, "button", (c) => {
            if (mm_map.packs == undefined) {
                mm_map.packs = [];
            }

            if (selectedInfoType == "mapPacks" && isValid(selectedInfo)) {
                if (packs[selectedInfo] != undefined) {
                    mm_map.packs.push(selectedInfo);
                    mm_map.tiles = Object.assign({}, mm_map.tiles, loadPacks({ packs: [selectedInfo] }));
                    hideInfo();
                }
                else {
                    alert("Not a valid pack!");
                }
            }
            else {
                showInfo();
                renderInfo("mapPacks");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Add map pack", color: "black", size: 20, textBaseline: "middle" } });

        createButton("packs_emptysprite", 0.85, 0.45, 0.18, 0.08, "button", (c) => {
            if (selectedInfoType == "t" && isValid(selectedInfo)) {
                if (images["tiles/" + selectedInfo] != undefined) {
                    mm_map.tiles.empty.sprite = selectedInfo;
                    updateTiles = true;

                    hideInfo();
                    this.uText();
                }
            }
            else {
                showInfo();
                renderInfo("t");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["packs_emptysprite"].uText = (c) => { c.text = "Empty sprite: " + mm_map.tiles.empty.sprite; };



        // spawns
        createText("section_spawns", 0.05, 0.6, "Spawns", { size: 24, color: colors.buttonbottompressed, align: "left" });

        createButton("spawns_maxenemies", 0.05, 0.65, 0.18, 0.08, "button", (c) => {
            mm_map.maxEnemies = Math.max(0, Math.round(prompt("New max.? (e. g. 8)")));
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["spawns_maxenemies"].uText = (c) => { c.text = "Max. enemies: " + mm_map.maxEnemies; };

        createButton("spawns_lvlrange", 0.25, 0.65, 0.18, 0.08, "button", (c) => {
            let neww = prompt("What range? (ie 1-10) (from 1 to 50)");
            if (isValid(neww) && neww.includes("-") && neww.split("-")[0] > 0 && neww.split("-")[1] <= 50) {
                mm_map.levelRange = [parseInt(neww.split("-")[0]), parseInt(neww.split("-")[1])];
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "middle" } });
        objects["spawns_lvlrange"].uText = (c) => { c.text = "Lvl Range: " + mm_map.levelRange; };

        createButton("spawns_addspawn", 0.45, 0.65, 0.18, 0.08, "button", (c) => {
            if (mm_map.spawns == undefined) mm_map.spawns = {};

            if (selectedInfoType == "mapEnemies" && isValid(selectedInfo)) {
                let spawnChance = prompt("Chance? (e. g. 10)");
                if (isValid(spawnChance)) {
                    mm_map.spawns[selectedInfo] = spawnChance;
                    hideInfo();
                }
            }
            else {
                showInfo();
                renderInfo("mapEnemies");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Add spawn", color: "black", size: 20, textBaseline: "middle" } });

        createButton("spawns_removespawn", 0.65, 0.65, 0.18, 0.08, "button", (c) => {
            if (selectedInfoType == "spawns" && isValid(selectedInfo)) {
                delete mm_map.spawns[selectedInfo.split(" |")[0]];
                hideInfo();
            }
            else {
                showInfo();
                renderInfo("spawns");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Remove spawn", color: "black", size: 20, textBaseline: "middle" } });

        // init - set all texts as far as ye can
        for (let o in objects) {
            if (objects[o].uText != undefined) {
                objects[o].uText(objects[o + ":text"]);
            }
        }
    },
    (tick) => {
        // Loop

    }
);