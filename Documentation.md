A basic ScrapRPG documentation as even I found myself struggling to remember some things sometimes

Name means the thing you have to use in the code

## Dialogue types
| Title      | Name (in code)       | Description
|:----------:|:--------------------:|:------------------------------:
| Normal     | normal               | The default dialogue type, with image, name, etc.
| Invisible  | invis                | Similiar to normal, but text only. No image, no name.
| Narrator   | narrator             | Text only, but in the middle of the screen, with a black bg behind it.
| Cinematic  | cinematic            | Narrator without black text.
| Cutscene   |                      | Automatically selected during cutscenes!



## Emotion animations
For emotionAnimation(...)   (other sprite)

| x, y       | Name (in code)       | Description
|:----------:|:--------------------:|:------------------------------:
| 0, 0       | disappointed         | 
| 32, 0      | love                 | 
| 64, 0      | crying               | 
| 0, 32      | laugh                | 
| 0, 64      | victory              | 
| 0, 96      | anger                | 



## Emotions
For getEmotion(...)    (portraits)

| x, y       | Name (in code)       | Description
|:----------:|:--------------------:|:------------------------------:
| 0, 0       | neutral              | Default
| 0, 64      | happy                | 
| 0, 128     | love                 | 
| 0, 192     | disappointed         | 
| 0, 256     | sad                  | 
| 0, 320     | angry                | 



## Status effects
| Title      | Name (in code)       | Description
|:----------:|:--------------------:|:------------------------------:
| Acid       | acid                 | 1/15 of MaxHP damage every round
| Poison     | poison               | 1/15 of MaxHP damage every round, 1 HP / tile in overworld
| Fire/Burn  | burn                 | 1/10 of MaxHP damage every round
| Enraged    | enraged              | Auto-assigns attack
| Paralysis  | paralysis            | No-assigns attack no no no
| Condemned  | condemned            | You die



## dline (used to create lines for dialogue)
| Name       | Default              | Description
|:----------:|:--------------------:|:------------------------------:
| text       | "ah"                 | The text
| portrait   | Portraits_Bleu       | Portrait image
| emotion    | neutral              | Emotion of the portrait (See emotions)
| name       | Bleu                 | The displayed name (can be unrelated to portrait and emotion)
| voice      | false (off)          | Voice (optional)
| script     | false (off)          | Script (optional)


## Usage of filters
| function name                  | Example usage                    | Description
|:------------------------------:|:--------------------------------:|:------------------------------:
| clearFilter()           | clearFilter()          | Clears current filter (single or multi)
| filterBlur(amount)      | filterBlur(0.5)        | Sets single filter blur (0+, in px, 0 is default)
| filterGray(amount)      | filterGray(25)         | Sets single filter gray (0 - 100, in %, 0 is default)
| filterSepia(amount)     | filterSepia(50)        | Sets single filter sepia (0 - 100, in %, 0 is default)
| filterInverted(amount)  | filterInverted(100)    | Sets single filter inverted (0 - 100, in %, 0 is default)
| setFilter(name, amount) | setFilter("gray", 100) | Sets one filter then renders, allows for multiple filters. Use clearFilter() to get rid of it


## Blend
| Name       | Alt. name            | Description
|:----------:|:--------------------:|:------------------------------:
| add        | lighter              | Where both shapes overlap the color is determined by adding color values.
| multiply   | mul                  | The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.
| overlap    | source-in            | The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.
| xor        |                      | Shapes are made transparent where both overlap and drawn normal everywhere else.



## Particles
| Name          | Default value | Description
|:-------------:|:-------------:|:------------------------------:
| anchor        | [0.5, 0.5]    | Starting pos on the screen
| offset        | [0, 0]        | Starting pos in pixels
| sizeAnchor    | [0, 0]        | Size in screen
| sizeOffset    | [0, 0]        | Size in pixels
| alpha         | 1             | Opacity [0 - 1]
| blend         | false         | Blend
|               |               | 
| type          | rect          | Type [rect or img]
| source        | false         | Image source (for img type)
| snip          | false         | Image snip (for img type)
| fill          | "none"        | Fill color (for rect type)
|               |               | 
| Note:         | The following | also exist as 2 (movable2, direction2, etc.), use the 2 ones to add a 2nd direction (for example for up and left)
| movable       | false         | If it moves or not. The following only work if it's movable'
| direction     | 0             | direction 0 Down, 1 Left, 2 Right, 3 Up
| speedAnchor   | 0             | Speed for anchor
| speedOffset   | 0             | Speed for offset
| speedMulti    | 1             | Speed multiplier (1 = default, less = slower, more = faster)
| moveRandom    | 0             | Random movement (keeps direction or goes opposite)
| acc           | 1             | Acceleration (1 does nothing, higher = faster acceleration)
|               |               | 
| amount        | 1             | Amount of particles
| p             | []            | You can technically use this to define the pos and size of every particle, but trust me you don't want to'
| spreadAnchor  | [0, 0]        | Spread on screen
| spreadOffset  | [0, 0]        | Spread in pixels
| sizeAnchorVary| [0, 0]        | Randomly increase the screen size of the particles (this is a multi)
| sizeOffsetVary| [0, 0]        | Randomly increase the pixel size of the particles (this is a multi)
| quadraticVary | false         | Varied size will be the same for x and y (quadratic)
|               |               | 
| lifespan      | 4             | How long the object lives in seconds (0 = never dies)
| life          | 0             | How many seconds it has lived for
| spawnTime     | 0             | How many seconds between spawns. 0 = instant. 2 = 1 spawn every 2 seconds.
| SpawnTimeTick | 0             | Time to next spawn (e. g. 1.6s/2s), can be manipulated or used to spawn the first one immediately by setting it to the same value as spawnTime
| lifeTickIdle  | false         | If set to true, it can get older (and eventually die) when it does not move
| dead          | false         | When it's dead, it stops doing stuff. Sad.
| repeatMode    | false         | 
| lifeMode      | true          | Ohh, this one's great. When enabled, every particle has an own age and the time of death depends on when it was spawned (see spawnTime). onDeath triggers every time someone dies if this is enabled. If repeatMode is also enabled, a new one will spawn every time one dies because of this. When enabled, all particles die at the same time and onDeath is triggered only once.
|               |               | 
| alphaChange   | 0             | Increase / decrease alpha (opacity) over time
| anchorChange  | [0, 0]        | Increase / decrease anchor over time
| offsetChange  | [0, 0]        | Increase / decrease offset over time
|               |               | 
| generate(ctx) |               | Creates particle (can surpass amount limit if used)
| onClick(args) |               | Function executed when any particle is clicked
| onParticleClick(args) |       | Function executed when a specific particle is clicked (does something for that 1 particle)
| onDeath(args) |               | Function executed on death


|            |                      | 