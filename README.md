# Minesweeper
The old game from our childhood, now available to be played quickly and easy on this site. Reveal fields, be aware of mines, put flags in suspicious places, play with caution

## Used Technologies 
### HTML
Simpliest as its should be, some divs inside divs to organize the game layout, the table is manipulated all in js

### CSS
Medium, had to use media queries to make the site responsive for mobile, considering the 3 levels of difficult and the numbers of fiels in the last, was needed to balance between a good visualization of an "easy" board without turn it tight, while possibiliting the "hard" gameplay either in PC or mobile. I choose to copy that "root" design from the game in Windows XP

### JavaScript
The pillar of the game, i learned to many things while go deeping inside that challenge. The game operation looks simply but i had to:
1. Create a matrix to be the game board, firstly all with "0" value. Then, select random fields to be the mines, and increase the numbers around them
2. Print a (undiscovered yet) field in html, manipulating the table. Assigning `onclick` events to reveal and `contextmenu` events to put a flag inside the field, who is picked with `event.target`
3. Recursive functions to clear adjacent fields from an empty (value 0) one. A way to move a mine and reorganize the matrix numbers, to prevent death in first clck
4. Putting the game rules inside an object to better use, doing verifications if the remain undiscovered are all mines to declare win, or death if a mine is releved. And stoping other game functions while table isnt reseted in emoji 
6. The "emoji" thing in the middle, changing his face on player's mouse actions. A lot of mouse events to create a decent "hover" and "active" like effect. Flag and time counters, the second using `setInterval` and needing to reset with the board too. Sounds for actions and OST

