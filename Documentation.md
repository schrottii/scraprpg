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
| Poison     | poison               | 1/15 of MaxHP damage every round, 1 HP / tile on overworld
| Fire/Burn  | burn                 | 1/10 of MaxHP damage every round
| Enraged    | enraged              | Auto-assigns attack



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
| setFilter(name, amount) | setFilter("gray", 100) | Sets one filter then renders, allows for multiple filters. Use clearFilter() to get rid of it


|            |                      | 