# ScrapRPG
## 1.0 (2025-08-13)
- Release 



## 1.0.1 (2025-08-14)
-> Maps:
- Bricky Town: expanded to the right side, with a Shop building!
- This first shop sells Very Small Potions, Energy Drinks, and at lvl 2 Small Potions
- Bricky Forest 3 (brfr3): Reduced max. enemies from 30 to 16
- Bricky Forest 3 (brfr3): New enemies can now spawn here
- Removed two stray tiles

-> Enemies:
- Enemies no longer spawn near you (4 tiles in every direction)
- After a fight, enemies near you despawn
- Evil Peter: EVA 20 -> 10, ACC 50 -> 70
- Living Hay: EVA 50 -> 10, ACC 70 -> 60
- Living Hay Map Enemy: moves far less often

-> Difficulty balancing:
- EXP gains: x8/x1/x0.5 -> x1.5/x1/x2
- Wrenches: x4/x1/x0.5 -> x2/x1/x3
- Bricks: x10/x1/x1 -> x2/x1/x3

-> Other:
- After going Game Over, you now get fully healed
- Inventory: Your Wrenches and Bricks are now visible
- Changed .ogg files to .mp3 to avoid iOS issues
- Fixed an issue that caused too high Wrench gains

-> Internal:
- Map Maker: added dialogue script Open Shop
- Made it easier for me to go into testing mode



## 1.0.2 (2025-08-15)
-> New content:
- New Map: Bricky Forest - Mill
- Here you can find Myllermit, who gives a quest
- New Quest: Unhealthy Diet
- The reward is the first story item (you can't use it, but later it will be needed for something)
- Added Inns, where for 10 Bricks you can regenerate your HP and EP fully

-> Maps:
- Bricky Town: The huge building is an Inn
- Bricky Forest 3 (brfr3): added connection to the new map

-> EP:
- Defeating an enemy now gives 1 EP, +1 for every 20 HP they have
- EP are fully regenerated in an Inn
- Level ups regenerate EP too

-> Enemies:
- Enemies no longer spawn on water
- Reduced size of forest map enemies

-> Equipment:
- Equipped items you have 0 remaining of are displayed
- Clicking equipped items (green) always unequips them
- The equipment preview (on the character) can be clicked to unequip too (but has wonky hitboxes)

-> Shops:
- Items that require a higher Customer level are shown as locked (rather than not at all)
- Bricky Town Shop no longer sells limited amount of Small Potions

-> Other:
- Game keeps track of what songs you have heard, for a potential later Jukebox feature
- Inventory: (right side) images can be clicked through and are properly centered
- Fixed possibility of leader (the one visible on map) being someone locked
- Fixed funny space bar crash



## 1.0.3 (2025-08-16)
-> Items:
- Your items: improved rendering and handling of non-usable / story items
- Descriptions of non-usable items can now be seen
- Improved current mode text
- Page buttons disappear when irrelevant (same for magic and equipment)
- Story Items are no longer visible in fights
- Added circles under items too (blue)

-> Fights:
- DEF does something now: flat subtracts that much damage (after other calculations)
- Attacks can no longer deal 0 damage (min. 1)

-> Other:
- Doubled max EP scaling (ie Bleu lvl 10: 4 -> 6)
- Fixed single enemy spell crash

-> Internal (Map Maker):
- Easier access for project members
- Default mode is now move rather than move+place
- Dialogues can be deleted
- NPCs can be deleted
- Tile Picker correctly highlights in the prepicker
- Tile Maker: added Rotate
- Added support for rotated tiles



## 1.0.4 (2025-08-22)
-> New Maps:
- New map: Bricky Forest - brfr4 (by tomekbet)
- 1 quest
- New map: Oxbow Lake (by tomekbet)
- 1 quest, and find someone special here!
- New map: Bricky Forest - brfr5 (by Schrottii)
- first map with higher level enemies
- New map: Mythical Plains (by Meowy)
- 2 quests, largest map

-> Maps:
- Hay Maze: added some grass and trees to the left side
- brfr3: removed stronger enemies, now that they can appear in later maps

-> Other:
- Added the 4 new quests, and 3 new items connected to them
- Added tomekbet and Meowy to credits
- Enemies can no longer move when you can't move
- Fixed medusa bug

-> Internal (Maps):
- Added Creator to the existing maps (11x Schrottii, 2x tomekbet, 1x Meowy)
- Removed 2 typo dialogues

-> Internal (Map Maker):
- Map Info: Added button to set the map's Creator
- NPC Maker: Added condition (same as tiles)
- Dialogue Scripts: added Add Protagonist and Rem Protagonist
- Prepicked tiles are now kept after testing
- When loading a map, you get moved to its bottom right corner if you were far away
- Fixed issues with transparent NPCs and enemies
- Fixed issues when loading from a file (ie wrong ID)
- Fixed map level range issue



## 1.0.5 (2025-08-27)
-> Maps:
- New map: Plain Town
- South of Mythical Forest, relatively small, has Cows
- New map: Plain Town (inside)
- has a Shop, an INN and 3 NPCs
- 16 Maps total
- Mythical Forest: added a new Quest, at the bridge, which now unlocks the bottom path instead
- Mythical Forest: added more OOB deco, and another house

-> Notifications
- Added notifications, which help guide you (they look like a red square)
- They can appear for Quests, Items, Magic and the Monster Book
- Quests: when you get a new Quest or completed one you can directly claim
- Items: getting an item you did not have before
- Magic: getting a spell from a book (no other way to get spells yet)
- Monster Book: having killed an enemy for the first time, or scanning it
- Go into the respective menu to make it disappear

-> Fights:
- Increased size of protagonists and enemies by 50%
- Slide in/out for buttons, actions and inventory now all take 300ms (previously 500ms, except for buttons in)
- Fight log: added [P], [E], [I] depending on if a protagonist or enemy did it, or it's just info
- Fight log: changed start text when a battle starts
- Fight log: removed redundant EXP gain text
- Stats of selected protagonist now disappear when unselecting
- Fixed unavailable attacks briefly showing up when sliding out the actions

-> Other:
- Made paths (sand and stone) smoother

-> Internal:
- Added notifications
- Fights: added support for different grid/pos sizes
- Map Maker: added dialogue script for INN



## 1.0.6 (2025-09-24)
-> Stats:
- Added stats scene (accessible from inventory)
- Here all stats are visible
- Following stats already existed since release: 
- Play time, Wrenches, Bricks, Tiles walked, Times teleported, Total fights, Fights fled, Fights lost, Fights won, Saves, Auto saves, Game opened
- Following stats were added now: 
- Inventory opened, NPCs talked to, Items used, Items dropped, Items bought, Items sold

-> Other:
- Prettier loading bar (water and sand)
- Quests: added pages
- Title: added glow & slight moving animation for the game logo
- Title: brought back flying star particles
- Title: fixed text being misplaced after loading a save
- Title: fixed some stuff being misplaced after going to settings and back



## 1.0.7 (2025-11-06)
-> New Map:
- New map: Bricky Forest - brfr6 (by Schrottii)
- 2 quests: Lost Cards, Lost Cow

-> Items & Collecting:
- Added Chests system, allowing Chests and other containers to be actually opened
- Similar to items on the ground, Chests can only be opened once, and contain one Item each
- Put Items into the previously fake Chests on 3 maps (Castle, Castle, Bricky Town Inside)
- Put Items from the ground into Chests on 3 maps (Split, Bricky Forest 3, Plain Town)
- Added popup when an Item is found on the ground or in a Chest, showing its name, description and amount
- It disappears after 3 seconds, but can be clicked away, which also gets rid of the notification
- New items: Plush, Poker Card, Ace Card

-> Daytime effects:
- Changed color palette, to be more realistic and easier on the eyes
- Fixed color jumping bug

-> Internal:
- New quest type: find items (findItem), triggered by items on ground and chests only
- Tile info mode: added button to add chest, remove item button now also removes chest
- Tile info mode: item on tile can show the tile's chest item, and specifies if it's on the ground or in a chest