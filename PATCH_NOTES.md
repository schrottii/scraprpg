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