#welcome to slidenotes
your first tutorial

please press the `play-button` in the bottom left corner to start the tutorial

then press `right` or `spacebar` to go to the next slide 

---
##general overview

congratulations, you started your first presentation!

the slidenote editor helps you to write your slidenotes and generates presentations out of it on the fly. 
this is in fact a preview of a slidenote. you can press `escape` anytime you want to look at the code in the editor and come back by clicking on the `play button`.

---
##navigate

while in the presentation, you can go back a slide by clicking `left` in the presentation.

if you want to go to a specific slide, you can *enter its number* and then hit `enter`

for example to go back to the first slide you press `1` and then `enter`.

---
##slides

to write your slidenotes you can use the slidenote-interpretation of **markdown code.**

our **markdown code** aims to be as simple as possible while being as powerful as it can be. the slidenote editor helps you with writing the style, shows you mistakes and offers help in various forms. 

we want you to be able to concentrate on the content of you slidenote instead of managing the editor.

most of our **markdown code** is line-based. meaning a line starts with some markdown definition which then defines how to treat the specific line. but enough of the theory, lets dive just in. 
first of all lets talk about slides ➡︎

---
###slides: a simple concept

when you open a new slidenote, you automatically start typing on slide **1**.
in order to start slide **2**, simply type:
`---`
this works wherever you want to separate your text into slides. in the editor, it looks like this:
 
+++code
my first slide
---
my second slide
+++

---
##titles

a line started with a `#` defines a title.

+++code:options
language=html
---
# your presentation title
your presentation subtitle
+++

+++code:options
language=html
---
## slide or chapter titles
### section titles
+++

titles order your notes not only visually, but give meaning to screenreaders as well. so make sure to use them wisely if you want your presentation to be accessible.

---
##simple elements

to mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols:
+++code
to mark ~~all~~ parts of your code as *italic* or **bold** you have to include them in symbols
+++

those simple elements are allowed to go over more than one line, so that you can set **a whole angry paragraph in bold.** 
but they have to be closed before you start a *new slide* or complex elements like *lists* or *blocks*, otherwise they are not rendered at all. here is an overview of possible simple elements and how to write them:

+++table
italic, bold, deleted
*, **, ~~
_, __, 
+++

---
##hello world

that's all you really need to start your first presentation.
so why don't you click `escape` and try it for yourself? 
play a bit with the text on *this slide.* 
when you are finished, continue on the next slide ➡︎

---
##complex elements: list

now that you have mastered the simple elements, it's time to go forward to the next level and look at some more complex elements you probably will use often: lists
lists can be divided into two families: *ordered* and *unordered* lists. 
*ordered* lists have a numeral or alphabetical counter while unordered lists are just lists. 
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

as we said, lists are the first complex element. as complex element it has a `context-menu`. 
whenever your cursor is inside such an element you are offered the `context-menu` at the left side of the editor. 
it tells you the type of the element you are in and gives you a helping hand in handling the element. in case of the list-element it offers you to change the list-type. 
this is especially useful because you can mix different list-types to get sub-lists and still keep an overview while in code:

1. my first point
a) first subpoint of first point
b) second subpoint of first point

2. my second point
+ a subpoint of second point
+ a subpoint of second point

why not hit escape now, see how the above is written, click inside the list to change their type and see what happenes? 
if you are unhappy with a change you can undo it by clicking on the `undo-button` on the top-right ![](undo.svg)

---
##toolbar and context-menu

the toolbar on the right side of the editor holds all elements you can insert into a slidenote. it opens when you press the `toolbarbutton` ![](toolbar.svg)
you can also open the toolbar by pressing `cmd/ctrl+space`. inside the toolbar you can move to your desired element with the arrow-keys or by pressing the first letter of its name. 
of course you can also use your mouse or touchpad if you prefer. 
the toolbar and the context-menu together should give you a broad set of help whenever you need it. even without knowing our markdown syntax you should be able to design complex presentations. as everything is reflected in the code you will learn by using it and soon you will not even depend on this buttons.  

---
##keyboard navigation

we designed our keyboard-navigation of the editor so that it adapts to the needs of a slidenote: 
with `page up` and `page down` you either jump to the begining of the actual slide or to the begining of the last / next slide. with this you can switch between the slides very fast. of course you can use `shift` to mark all text while jumping slides. 
deleting a whole slide is as fast as `page up` to jump to the begining of the slide, then `shift + page down` to mark the whole page. now delete it by pressing `delete / backspace`, cut it with `ctrl+x` or simply overwrite it. 

while `home/end` and `ctrl+left/right` work like you are used to we added `ctrl-up/down` to jump between different elements. to mark a whole element just press `ctrl+shift+up/down` while being inside an element.
 
the menus are all controllable with your arrow-keys once you are inside them. and of course all menues are reachable with a shortcut. once you are inside a menu and want to go back to the editor just press `escape`.
> personalize your navigation under **advanced options**

---
##faster writing with automagic closure 
(optional)

you are used to the automagic closure modern editors like *atom* offer? well, we invented our own version of it and adapted it to the markdown code of slidenotes.io. it automatically closes our markdown-tags for you instead of just showing you that you should do that yourself.
 
at first its a bit of an uncommon feeling, but once you get used to it you don't want to switch back and will be asking yourself how you could ever write before without using this.

try it out yourself! 

*but wait*

---
#there's more!

we're constantly working on implementing more features and improving the ones we have.
if you have any suggestion—drop us a message under `options → feedback` or [hi@slidenotes.io](mailto:hi@slidenotes.io)

 




||€€imagepart€€||
[{"names":["undo.svg"],"filename":"undo.svg","base64url":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCA3MCA2NSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxuczpzZXJpZj0iaHR0cDovL3d3dy5zZXJpZi5jb20vIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Ij48cGF0aCBpZD0idW5kbyIgZD0iTTI5Ljk1OSwzOS45OTFjLTE3LjU2LC0xMS44MzUgLTMwLjczOCwtMy4zMDggLTI5LjU5NCwtMjIuOTE4YzAuODU0LC0xNC42NTMgMjguOTM1LC0yMi4zNzEgNDkuMDg1LC0xMi4yNjFjMTYuNjY5LDguMzY1IDI2LjQ1NSwzOC40NjIgMTUuNTg1LDUxLjkwNWMtMTcuNzcyLDIxLjk4MSAtMjMuMjYsLTguNzYyIC0zNS4wNzYsLTE2LjcyNloiIHN0eWxlPSJmaWxsOnVybCgjX0xpbmVhcjEpOyIvPjxjbGlwUGF0aCBpZD0iX2NsaXAyIj48cGF0aCBkPSJNMjkuOTU5LDM5Ljk5MWMtMTcuNTYsLTExLjgzNSAtMzAuNzM4LC0zLjMwOCAtMjkuNTk0LC0yMi45MThjMC44NTQsLTE0LjY1MyAyOC45MzUsLTIyLjM3MSA0OS4wODUsLTEyLjI2MWMxNi42NjksOC4zNjUgMjYuNDU1LDM4LjQ2MiAxNS41ODUsNTEuOTA1Yy0xNy43NzIsMjEuOTgxIC0yMy4yNiwtOC43NjIgLTM1LjA3NiwtMTYuNzI2WiIvPjwvY2xpcFBhdGg+PGcgY2xpcC1wYXRoPSJ1cmwoI19jbGlwMikiPjxwYXRoIGQ9Ik0yOC43NTIsMTkuODczbDUuMDkyLDIuODA0YzAuODQ2LDAuNDY2IDEuMTU1LDEuNTMxIDAuNjg5LDIuMzc3Yy0wLjQ2NiwwLjg0NiAtMS41MzEsMS4xNTUgLTIuMzc3LDAuNjg5bC0xMC41NDYsLTUuODA2bDYuNTc5LC05LjA1NmMwLjU2OCwtMC43ODIgMS42NjMsLTAuOTU1IDIuNDQ1LC0wLjM4N2MwLjc4MSwwLjU2NyAwLjk1NCwxLjY2MyAwLjM4NywyLjQ0NGwtMi40MjksMy4zNDNjMTQuMjU0LC0zLjc0IDIyLjcyNiw5LjU3NCAyMi40MzMsMTcuMjkxYy0wLjAzNywwLjk2NSAtMC44NSwxLjcxOSAtMS44MTUsMS42ODJjLTAuOTY2LC0wLjAzNyAtMS43MTksLTAuODUgLTEuNjgzLC0xLjgxNWMwLjI0MSwtNi4zMTYgLTYuOTE5LC0xNy4xOTIgLTE4Ljc3NSwtMTMuNTY2WiIgc3R5bGU9ImZpbGw6I2ZmZjsiLz48L2c+PHBhdGggaWQ9InVuZG8xIiBzZXJpZjppZD0idW5kbyIgZD0iTTI5Ljk1OSwzOS45OTFjLTE3LjU2LC0xMS44MzUgLTMwLjczOCwtMy4zMDggLTI5LjU5NCwtMjIuOTE4YzAuODU0LC0xNC42NTMgMjguOTM1LC0yMi4zNzEgNDkuMDg1LC0xMi4yNjFjMTYuNjY5LDguMzY1IDI2LjQ1NSwzOC40NjIgMTUuNTg1LDUxLjkwNWMtMTcuNzcyLDIxLjk4MSAtMjMuMjYsLTguNzYyIC0zNS4wNzYsLTE2LjcyNloiIHN0eWxlPSJmaWxsOnVybCgjX1JhZGlhbDMpOyIvPjxwYXRoIGQ9Ik0yOS41NjQsMGM5LjU5MywwLjA5IDE5LjUwOCwyLjcgMjYuNDU1LDkuMTk5YzkuMjkyLDguNjkyIDE0LjQ4MSwyMi4xMDQgMTMuNzY1LDM0LjQ3Yy0wLjQyMyw3LjMwNSAtMy45MzksMTQuNDkxIC0xMC41NzEsMTkuMDM0Yy0yLjQ5OCwxLjcxMSAtNS43OTgsMi42MjUgLTguNzIzLDEuMzg2Yy01LjkxOSwtMi41MDUgLTkuMTg0LC05LjYxIC0xMi45ODIsLTE1LjI1Yy0yLjgwNiwtNC4xNCAtNS45MjksLTcuODM4IC0xMC42OTksLTEwLjUzMmMtNS44NDYsLTMuMzAyIC0xMi41ODcsLTQuNTEgLTE4Ljk4NCwtNi43MzJjLTIuMjQ1LC0wLjc3OSAtNC40NzEsLTEuOTM4IC01Ljg0NiwtMy45ODljLTIuMDkxLC0zLjExOSAtMi4xOTEsLTcuMjI5IC0xLjc5NywtMTEuMDQ5YzAuNzk1LC03LjY4OCA5LjA0OSwtMTMuMDI5IDE3Ljg4OSwtMTUuMjE0YzMuNzU0LC0wLjkyOCA3LjYzMSwtMS4zMzcgMTEuNDkzLC0xLjMyM1ptLTAuNTA4LDAuNDVjLTguNzYxLDAuMDU2IC0xNy45NDksMi4xNTEgLTI0LjAzOCw3Ljg5NGMtMy42MDEsMy4zOTYgLTUuMDI0LDguNDI3IC00LjMyNSwxNC4wMjRjMC4yOTMsMi4zNSAxLjA5NCw0Ljc1OCAyLjg4OSw2LjM5MmMzLjE4OSwyLjkwNSA3LjkyOSwzLjM3NSAxMi4yMTgsNC41ODljNi45MjMsMS45OTMgMTMuOSw0Ljg4OCAxOC42MjUsMTAuNTUyYzQuNTA4LDUuNDAzIDcuNDY0LDEyLjA5OCAxMi4zMjMsMTYuOTY0YzIuMDM3LDIuMDQgNC42NTYsMy43MTEgNy42MjYsMy4zNTljNC41MjMsLTAuNTM3IDguMTM0LC00LjQ5OSAxMC44NTUsLTguMTIxYzQuMjAyLC01LjU5MiA0LjgxNiwtMTMuMzM2IDMuNjUsLTIwLjY4MmMtMi4wMjcsLTEyLjc2OSAtOC44MjcsLTI1LjUwMSAtMjAuNzEzLC0zMC45NzZjLTUuOTU4LC0yLjc0NSAtMTIuNjI2LC00LjAwMSAtMTkuMTEsLTMuOTk1WiIgc3R5bGU9ImZpbGw6dXJsKCNfTGluZWFyNCk7Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJfTGluZWFyMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDIwMC43MDMsLTI1Ni4yMTksMjU2LjIxOSwyMDAuNzAzLDE5LjEwOTksMTYyLjU5NSkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzliY2ZkMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMC41OCIgc3R5bGU9InN0b3AtY29sb3I6I2RmZjBmMTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmZjtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJfUmFkaWFsMyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOC4xNTgxLDQ5LjY5NDYsLTQ5LjY5NDYsMTguMTU4MSwzNC45NjAyLDIzLjg2OTYpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWZmZmU7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMTAwMDE7c3RvcC1vcGFjaXR5OjAuMiIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJfTGluZWFyNCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0zNi40NTAzLC01NS40Mjg3LDU1LjQyODcsLTM2LjQ1MDMsNTguMzYwOSw2NC4yNzEpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM5OTlhOWE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWZmZmU7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4="},{"names":["toolbar.svg"],"filename":"toolbar.svg","base64url":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMTUgMTE3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxnIGlkPSJ0b29sYmFyIj48cGF0aCBkPSJNNjMuODg2LDM1LjcxN2MxNy45NjYsLTE5LjQ2NSAxNC40NDcsLTM3LjY5NyAyOC43MDEsLTM1LjEyN2M2LjAxNCwxLjA4NSAxNi40MjEsMjAuNDIzIDE4LjkyNywzMy40MDdjNy4xMiwzNi44ODQgMS4wNTQsNTguMzgyIC0zMC4xMDEsNzMuODUzYy0zNC4zMDMsMTcuMDM2IC04MC4zMjQsNS4xNDYgLTgwLjUwNiwtMzAuNzc1Yy0wLjE3NiwtMzQuODMyIDM3LjAwMiwtMTMuMjEzIDYyLjk3OSwtNDEuMzU4WiIgc3R5bGU9ImZpbGw6dXJsKCNfTGluZWFyMSk7Ii8+PHBhdGggZD0iTTYzLjg4NiwzNS43MTdjMTcuOTY2LC0xOS40NjUgMTQuNDQ3LC0zNy42OTcgMjguNzAxLC0zNS4xMjdjNi4wMTQsMS4wODUgMTYuNDIxLDIwLjQyMyAxOC45MjcsMzMuNDA3YzcuMTIsMzYuODg0IDEuMDU0LDU4LjM4MiAtMzAuMTAxLDczLjg1M2MtMzQuMzAzLDE3LjAzNiAtODAuMzI0LDUuMTQ2IC04MC41MDYsLTMwLjc3NWMtMC4xNzYsLTM0LjgzMiAzNy4wMDIsLTEzLjIxMyA2Mi45NzksLTQxLjM1OFoiIHN0eWxlPSJmaWxsOnVybCgjX1JhZGlhbDIpOyIvPjxwYXRoIGQ9Ik05MC4xOTUsMC4wMDFjMC41OTQsMC4wMTMgMS4xODQsMC4wNjEgMS43NzIsMC4xNDRjNC4xOTgsMC41ODkgNy4wMTUsNC43MzcgOS41MzUsOC41OTJjOC40NjcsMTIuOTU3IDExLjcyMiwyOC45MTkgMTIuNTc1LDQ1LjMyMWMwLjU3OSwxMS4xNSAtMC43OTgsMjIuNzY5IC02LjY4OCwzMi41ODJjLTYuNTY1LDEwLjk0IC0xNy44NywxOC41ODMgLTI5LjQ3NCwyMy42MzRjLTE0LjgyNiw2LjQ1MyAtMzEuNzgyLDguMjA2IC00Ny40MDIsMy43ODNjLTExLjQyMSwtMy4yMzQgLTIyLjA4MywtMTAuMzY1IC0yNy4xNDcsLTIxLjE0NGMtMi43OCwtNS45MTkgLTMuNzYzLC0xMi42MDIgLTMuMjI1LC0xOS4xNzFjMC40MDIsLTQuOTEgMS45NDQsLTkuOTcyIDUuNTkyLC0xMy40NTVjNi4xMTQsLTUuODM3IDE1Ljg2MywtNi41NTEgMjQuNDI5LC04LjIyM2MxMS40NTIsLTIuMjczIDIyLjY1MiwtNi4zMjQgMzEuMDc1LC0xNC42OTljNy41NDIsLTcuNDk5IDEzLjA0MSwtMTcuNzE2IDE3LjU5LC0yNy4zOWMwLjI4NywtMC42MDYgMC41NzgsLTEuMjEgMC44ODEsLTEuODA4YzAuMjM5LC0wLjQ3MSAwLjQ4NCwtMC45MzkgMC43NCwtMS40YzEuODc1LC0zLjM4MSA0LjcyMiwtNi42NDEgOS4yOTEsLTYuNzY1YzAuMTUyLC0wLjAwMiAwLjMwNCwtMC4wMDMgMC40NTYsLTAuMDAxWm0tMC4yOTgsMC44OTFjLTEuNTc2LDAuMDI0IC0zLjE0MywwLjQwNiAtNC40NjQsMS4yNjJjLTMuMzA1LDIuMTQxIC00LjgxNyw2LjA1OSAtNi4zOTEsOS40NzRjLTEuOTExLDQuMTQ3IC00LjQyMSw4Ljc2NyAtNi43MjgsMTIuNzA5Yy02LjM3LDEwLjg4NyAtMTUuNjc1LDIwLjA2OSAtMjcuNTk1LDI0LjY3OGMtOS42NjMsMy43MzYgLTIwLjQwMiw0LjE1NCAtMzAuMTc5LDcuMzY4Yy00LjI5NywxLjQxMyAtOC40NDIsMy44MDggLTEwLjgxOSw3Ljg4M2MtMS45NDIsMy4zMjggLTIuNjE4LDcuMjUxIC0yLjc4MSwxMS4wMThjLTAuMzA2LDcuMDU5IDEuMjE1LDE0LjI0NCA0Ljg0NSwyMC4yNmM2Ljk1MywxMS41MjEgMjEuMDgxLDE3Ljg0NyAzMy45OTksMTkuNDc1YzE2LjA1NywyLjAyMyAzMi42NjYsLTEuOTE3IDQ2LjgzLC0xMC4yMDJjMTAuNzUxLC02LjI4OSAyMC4wNzMsLTE1LjM5MSAyNC4wMzcsLTI3LjQ4M2M0LjM1NCwtMTMuMjg0IDIuNzY3LC0yNy43OTkgMC4yNDEsLTQxLjM0MmMtMS45NjcsLTEwLjU0NiAtNS43MTQsLTIxLjE2NyAtMTIuMDc2LC0yOS41MjVjLTEuODQ4LC0yLjQyOCAtMy45MjcsLTQuOTgxIC02LjgxMywtNS40MTVjLTAuNjk3LC0wLjEwNSAtMS40LC0wLjE2MSAtMi4xMDYsLTAuMTZaIiBzdHlsZT0iZmlsbDp1cmwoI19SYWRpYWwzKTsiLz48cGF0aCBpZD0iUGZhZF80NyIgZD0iTTc4LjQwNiw5OS45ODVsLTIsMGwwLC0xNi42ODFjLTAuMTI0LDAuMDU0IC0wLjI2MSwwLjA4NCAtMC40MDQsMC4wODRjLTAuMDI0LDAgLTAuMDQ3LC0wLjAwMSAtMC4wNzEsLTAuMDAzbC02LjEsMGwtMC45LDYuMWMtMC4wNTcsMC4yODQgLTAuMTk2LDAuNTQ0IC0wLjQsMC43NWMtMC4xOTcsMC4xOTkgLTAuNDY5LDAuMzA4IC0wLjc1LDAuM2wtMS43LDBjLTAuMjg3LDAuMDA1IC0wLjU2NSwtMC4xMDIgLTAuNzc1LC0wLjNjLTAuMjExLC0wLjE4NyAtMC4zMTUsLTAuNDcgLTAuMjc1LC0wLjc1bDAuOTUsLTYuMWwtNy41LDBsLTAuOSw2LjFjLTAuMDU3LDAuMjg0IC0wLjE5NiwwLjU0NCAtMC40LDAuNzVjLTAuMTk3LDAuMTk5IC0wLjQ2OSwwLjMwOCAtMC43NSwwLjNsLTEuNywwYy0wLjI4NywwLjAwNSAtMC41NjUsLTAuMTAyIC0wLjc3NSwtMC4zYy0wLjIxMSwtMC4xODcgLTAuMzE1LC0wLjQ3IC0wLjI3NSwtMC43NWwwLjk1LC02LjFsLTUsMGMtMC4zMDMsMC4wMTEgLTAuNTk5LC0wLjA5NiAtMC44MjUsLTAuM2MtMC4yMTksLTAuMjA2IC0wLjMzOCwtMC40OTkgLTAuMzI1LC0wLjhsMCwtMS42Yy0wLjAxMywtMC4zMDEgMC4xMDYsLTAuNTkzIDAuMzI1LC0wLjhjMC4yMjYsLTAuMjAzIDAuNTIyLC0wLjMxMSAwLjgyNSwtMC4zbDUuNTUsMGwxLjMsLTguOWwtNS41NSwwYy0wLjMwMywwLjAxMSAtMC41OTksLTAuMDk2IC0wLjgyNSwtMC4zYy0wLjIxOSwtMC4yMDYgLTAuMzM4LC0wLjQ5OSAtMC4zMjUsLTAuOGwwLC0xLjZjLTAuMDEzLC0wLjMwMSAwLjEwNiwtMC41OTMgMC4zMjUsLTAuOGMwLjIyNiwtMC4yMDMgMC41MjIsLTAuMzExIDAuODI1LC0wLjNsNi4xNSwwbDAuOSwtNi4xYzAuMDU4LC0wLjI4MyAwLjE5NywtMC41NDQgMC40LC0wLjc1YzAuMTk4LC0wLjE5OSAwLjQ3LC0wLjMwNyAwLjc1LC0wLjNsMS43LDBjMC4yODEsLTAuMDA3IDAuNTUzLDAuMTAxIDAuNzUsMC4zYzAuMTk5LDAuMTk2IDAuMjkyLDAuNDc1IDAuMjUsMC43NWwtMC45LDYuMWw3LjUsMGwwLjksLTYuMWMwLjA1OCwtMC4yODMgMC4xOTcsLTAuNTQ0IDAuNCwtMC43NWMwLjE5OCwtMC4xOTkgMC40NywtMC4zMDcgMC43NSwtMC4zbDEuNywwYzAuMjgxLC0wLjAwNyAwLjU1MywwLjEwMSAwLjc1LDAuM2MwLjE5OSwwLjE5NiAwLjI5MiwwLjQ3NSAwLjI1LDAuNzVsLTAuOSw2LjFsNC4xMjUsMGwwLC0xNS45bDIsMGwwLDQ5Wm0tMiwtMjAuMzE5bDAsLTguOTgxbC00LjY3NSwwbC0xLjMsOC45bDUuNSwwYzAuMDI0LC0wLjAwMSAwLjA0NywtMC4wMDIgMC4wNzEsLTAuMDAyYzAuMTQzLDAgMC4yOCwwLjAzIDAuNDA0LDAuMDgzWm0tOC41NzUsLTguOTgxbC03LjQ1LDBsLTEuMyw4LjlsNy40NSwwbDEuMywtOC45WiIgc3R5bGU9ImZpbGw6I2ZmZjtmaWxsLXJ1bGU6bm9uemVybzsiLz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJfTGluZWFyMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0xNjAuMjM4LDI1MS45ODEsLTI1MS45ODEsLTE2MC4yMzgsMTg4Ljk2NiwtMTM5LjYpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjAuNDIiIHN0eWxlPSJzdG9wLWNvbG9yOiNkZmYwZjE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM5YmNmZDM7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iX1JhZGlhbDIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTYzLjc2ODgsNTYuMzEzMywtMzYuODUzOCwtNDEuNzMyOSw3MC40MzE1LDU4LjI1MjUpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9IjAuNDIiIHN0eWxlPSJzdG9wLWNvbG9yOiNhZWFlYWU7c3RvcC1vcGFjaXR5OjAuMDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDE7c3RvcC1vcGFjaXR5OjAuMiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJfUmFkaWFsMyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg1MS4xMzg5LDU1Ljg3ODYsLTU1LjkwNjYsNTEuMTEzMyw1MC4wNDcyLDM5LjM4NjIpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWZmZmU7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNhOWE5YTk7c3RvcC1vcGFjaXR5OjEiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="}]