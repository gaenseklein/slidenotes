
#welcome to slidenotes
your first tutorial

please press the play-button in the bottom left corner to start the tutorial, then go on to the next slide press `right`
---
##general overview

congratulations, you started your first presentation! 

the slidenote editor helps you to write your slidenotes and generates presentations out of it on the fly. 

this is in fact a preview of a slidenote. you can press `escape` anytime you want to look at the code in the editor and come back by clicking on the play button.

---

##navigate

while in the presentation, you can go back a slide by clicking `left` in the presentation.

if you want to go to a specific slide, you can enter its number and then hit `enter`

for example to go to the first slide you press `1` and then enter.

---
##slides

to write your slidenotes you can use the slidenote-interpretation of *mark-down-code.*

it aims to be as simple as possible while being as powerful as it can be. the slidenote editor helps you with writing the style, showing you mistakes and offers help in various forms. 

our goal is that you dont have to concentrate on managing the editor but instead of the content of your slidenote.

most of our mark-down-code is line-based. means a line starts with some markdown definition which then defines how to tread the specific line. but enough of the theory, lets drive just in. first of all lets talk about slides. 

---
###slides - a simple concept

as we aim to mark our presentation it makes sense to separate the code into slides. to define a slide we use `---` to distinguish between slides. so to start a new slide you begin a line with `---` and it separates the code into two slides:
 
+++code
my first page
---
my second page
+++

---
##titles and simple elements

a line started with a # defines a title.

using titles to order your notes gives meaning to a lot of screenreaders out there, so make sure to use them wisely if you want your presentation to be accessible.

+++code
# your presentation title
## slide or chapter titles
### subtitles
+++

to mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols:
+++code
to mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols
+++

simple elements are allowed to go over more than one line, but has to end before a new slide or complex elements like lists or blocks, otherwise they are not rendered at all. here is an overview of possible simple elements and how to write them:

+++table
italic, bold, deleted
*, **, ~~
_, __, 
+++

---
##hello world

thats all you really need to start your first presentation. so why not click `escape` and try it for yourself? play a bit with the text in this slide. if you are finished, start the presentation and continue on next slide

---
##complex elements: list

as you have mastered the simple elements time to go forward to the next level and look at some more complex elements you probably will use often: lists

lists can be divided into two families: ordered and unordered lists. ordered lists have a numeral or alphabetical counter while unordered lists are just a list. 
the most simple examples are:
+++layout:left
+++code
- unordered list
- unordered list
- unordered list
+++

+ unordered list
+ unordered list
+ unordered list
+++

+++layout:right
+++code
1. ordered list
2. ordered list
3. ordered list
+++

1. ordered list 
2. ordered list
3. ordered list
+++

---
##getting crazy with lists

as we said, lists are the first complex element. as a more complex element it has a context-menu. 
whenever your cursor is inside such an element you are offered the context-menu at the left side of the editor. the context-menu tells you the type of the actual element and gives you a helping hand in handling the element. in case of the list-element it offers you to change the list-type. 

this is especially useful because you can mix different list-types to get sub-lists and still keep an overview while in code:

1. my first point
a) first subpoint of first point
b) second subpoint of first point
2. my second point
+ a subpoint of second point
+ a subpoint of second point

why not hit escape now, see how the above is written, click inside the list to change their type and see what happenes? 

if you are unhappy with a change you can undo it by clicking on the undo-button on the top-right ![](undobutton) 

---
##the toolbar and the context-menu

the toolbar on the right side of the editor holds all elements you can insert into a slidenote. it opens when you press the toolbarbutton ![](toolbar). 
you can also *open* the toolbar by pressing cmd/ctrl+space. inside the toolbar you can move to your desired element with the arrow-keys or by pressing the first letter of its name. ![](undobutton)
of course you can also use your mouse or touchpad if you prefer. 
the toolbar and the context-menu (ctrl + contextmenu) together should give you a broad set of help whenever you need it. even without knowing our markdown syntax you should be able to design even complex presentations. as everything is reflected in the code you will learn by using it and soon you will not even be dependend on this buttons. 
 
whenever you want to go back to editing the text and you are inside such menu just press `escape`. 

---
##keyboard navigation

we altered the keyboard-navigation a bit in such ways that they adapt to the needs of a slidenote: 
with page up and page down you either jump to the begining of the actual slide or to the begining of the last / next slide. with this you can switch between the slides very fast. of course you can use shift to mark all text while jumping slides. deleting a whole slide is as fast as "page up" to jump to the begining of the slide, then "shift + page down" to mark the whole page. now delete it by pressing "delete"/"backspace", cut it with "ctrl+x" or simply overwrite it. 

> while home/end and ctrl+left/right work as you are used to be we added ctrl-up/down to jump between different elements. to mark a whole element just press ctrl+shift+up/down while being inside an element.
 

the menus are all controlable with your arrow-keys once you are inside them. and of course all menues are reachable with a shortcut. once you are inside a menu and want to go back to the editor just press **escape**. 

---
##faster writing with automagic closure 
(optional)

you are used to the automagic closure modern editors like *atom* offer? well, we invented our own version of it and adapted it to the markdown code of slidenotes.io. it automaticly closes our markdown-tags for you instead of just showing you that you should do that yourself.
 
at first its a bit uncommon feeling, but once you get used to it you dont want to switch back and will be asking yourself how you could ever write before without using this.

try it out yourself! 

 



