
# Welcome to Slidenote Tutorial

please press the Play-Button in the bottom left Corner to start Tutorial, then go on to next Slide (press right)
---
# General Overview

Congratulations, you started your first Presentation. The Slidenoteeditor helps you to write your Slidenotes and generates Presentations out of it on the fly. 

This is in fact a Preview of a Slidenote. You can press "Escape" anytime you want to look at the Code in the Editor and come back by clicking on the Play Button. 

While in the Presentation, you can go back a Slide by clicking "Left" in the Presentation. 
If you want to go to a specific Slide, you can enter its Number and then hit "Enter". For example to go to the first Slide you press 1 and then Enter.

---
# Slides

To write your Slidenotes you can use the slidenote-interpretation of Mark-Down-Code. 
It aims to be as simple as possible while being as powerfull as it can be. The Slidenote-Editor helps you with writing the style, showing you mistakes and offers help in various forms. Our goal is that you dont have to concentrate on managing the editor but instead in the content of your Slidenote.

Most of our Mark-Down-Code is Line-Based. Means a Line starts with some markdown definition which then defines how to tread the specific line. But enough of the Theory, lets drive just in. First of all lets talk about Slides. 

---
#Slides - a simple Concept

As we aim to mark our Presentation it makes sense to separate the Code into Slides. To define a Slide we use
 `"---` to distinguish between Slides. So to Start a new slide you begin a line with `---` and it separates the code into two Slides:
 
```code
My first Page
---
My second Page
```

---
# Titles and simple elements

A Line started with a # defines a Title. Subtitles begin with ##, Subsubtitles with ###. 
Using Titles to order your Notes gives meaning to a lot of Screenreaders out there, so make shure to use them wisely if you want your Presentation to be accessible.

```code
# some title
## a sub-title
### a sub-sub-title
```

To mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols:
```code
To mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols
```

Simple Elements are allowed to go over more then one line, but has to end before a new Slide or complex Elements like Lists or Blocks, otherwise they are not rendered at all. Here is an overview of possible simple Elements and how to write them:

```table
italic, bold, deleted
*, **, ~~
_, __, 
```

---
# Hello World

Thats all you really need to start your first presentation. So why not click **Escape** and try it for yourself? Play a bit with the Text in this Slide. If you are finished, start the Presentation and continue on next Slide

---
# complex Elements: list

As you have mastered the simple Elements time to go forward to the next Level and look at some more complex Elements you probably will use often: Lists

Lists can be divided into two families: ordered and unordered lists. Ordered lists have a numeral or alphabetical counter while unordered lists are just a list. 
the most simple examples are:
```layout:left
```code
- unordered list
- unordered list
- unordered list
```

+ unordered list
+ unordered list
+ unordered list
```

```layout:right
```code
1. ordered list
2. ordered list
3. ordered list
```

1. ordered list 
2. ordered list
3. ordered list
```

---
# Getting crazy with Lists

As we said, Lists are the first complex Element. As a more complex Element it has a Context-Menu. 
Whenever your Cursor is inside such an Element you are offered the Context-Menu at the left Side of the Editor. The Context-Menu tells you the Type of the actual Element and gives you a helping hand in handling the element. In case of the List-Element it offers you to change the List-Type. 

This is especially usefull because you can mix different List-Types to get sub-lists and still keep an overview while in code:

1. My first point
a) first subpoint of first point
b) second subpoint of first point
2. My second point
+ a subpoint of second point
+ a subpoint of second point

Why not hit Escape now, see how the above is written, click inside the List to change their Type and see what happenes? 

If you are unhappy with a change you can undo it by clicking on the undo-button on the top-right ![](undobutton) 

---
# The Toolbar and the Context-Menu

The Toolbar on the right Side of the Editor holds all Elements you can insert into a Slidenote. It opens when you press the Toolbarbutton ![](toolbar). 
You can also *open* the Toolbar by pressing Cmd/Ctrl+Space. Inside the Toolbar you can move to your desired Element with the Arrow-Keys or by pressing the First Letter of its Name. ![](undobutton)
Of course you can also use your Mouse or Touchpad if you prefer. 
The Toolbar and the Context-Menu (Ctrl + ContextMenu) together should give you a broad set of help whenever you need it. Even without knowing our Markdown Syntax you should be able to design even complex presentations. As everything is reflected in the Code you will learn by using it and soon you will not even be dependend on this buttons. 
 
Whenever you want to go back to editing the Text and you are inside such Menu just press **Escape**. 

---
# Keyboard Navigation

We altered the Keyboard-Navigation a bit in such ways that they adapt to the needs of a Slidenote: 
With Page Up and Page Down you either jump to the begining of the actual Slide or to the begining of the last / next Slide. With this you can switch between the Slides very fast. Of course you can use Shift to mark all text while jumping Slides. Deleting a whole Slide is as fast as "Page up" to jump to the begining of the Slide, then "Shift + Page down" to mark the whole Page. Now delete it by pressing "delete"/"backspace", cut it with "ctrl+x" or simply overwrite it. 

While Home/End and ctrl+left/right work as you are used to be we added ctrl-up/down to jump between different elements. To mark a whole element just press ctrl+shift+up/down while being inside an element. 

The Menus are all controlable with your Arrow-Keys once you are inside them. And of course all Menues are reachable with a Shortcut. Once you are inside a Menu and want to go back to the Editor just press **Escape**. 

---
# Faster Writing with Automagic Closure (optional)

You are used to the automagic closure modern editors like *atom* offer? Well, we invented our own version of it and adapted it to the Markdown Code of Slidenotes.io. It automaticly closes our markdown-tags for you instead of just showing you that you should do that yourself. 
At first its a bit uncommon feeling, but once you get used to it you dont want to switch back and will be asking yourself how you could ever write before without using this.
Try it out yourself. 

 



