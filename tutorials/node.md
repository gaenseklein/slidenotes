# welcome! 
to the node tutorial


please press `ctrl/cmd + enter` or the **playbutton** ![](playbutton.svg) in the bottom left corner to start the tutorial presentation

---
## what are nodes? 
and why should i bother? 

some data can be best expressed by displaying some nodes and the relations it has to other nodes. a quick example would be the flow of a process: 

+++node
start->middle
middle->end
+++

to get data like that we implemented a node-tag with its own, very simple and intuitive syntax
---
## the syntax

node-tags follow a simple and human-friendly syntax—easy to remember and so intuitive that you will not spend much time learning it. 

the simplest form is by declaring a connection: 
+++code
 +++node
node -> second node:a message
 +++
+++

in this simple line you have done the following:
1. declare first node with content "***node***"
2. build an arrow-connection with "***->***"
3. declare a second node with content "***second node***"
4. attach message to arrow with "***:***" with content "***a message***"
---
## wasn't that simple?

let's see the result:

+++node
node -> second node:a message
+++

we intent to make the syntax as intuitive as possible and as easy as it could be to use. but of course, the **context-menu** ![](context-menu_node.svg) is always there to help you if you don't remember something. 

maybe it's time for you to play a little with the node-declaration for yourself now. press `escape` (or the *x* with your mouse in the presentation-controls) and alter the above node in this slide, then press `strg/cmd + enter` or the **playbutton** ![](playbutton.svg) to continue.
---
## different types of connections

sometimes you want different types of connections, sometimes you don't need connections at all. 
to declare a connection between two nodes you can use:
+++table
key | description
->  | a normal arrow
--> | a dashed arrow
->> | another type of arrow
=>  | a broad arrow
-   | a simple line
--  | a dashed line
+++

if you put a `:` after your declaration of connection you add a message to the connection. 

---
## declaring nodes

as we have seen in the previous examples you can enter nodes quite easily by declaring them *inline* while declaring connections between nodes. this is quite handy as shown in the next simple example: 
+++layout:inline

+++code
alice -> bob: hello
bob --> alice: hi
+++

+++node
alice -> bob: hello
bob --> alice: hi
+++
+++

but if you write more complex type of connections where you have to repeatedly enter the same name again and again—sometimes you want to declare the content of them otherwise. 
well, you can do that:
+++layout:inline
+++code
a->b: hello
b=>a: hi
a:alice
b:bob
+++

+++node
a->b: hello
b=>a: hi
a:alice
b:bob
+++
+++

---
## getting excited? 

thats pretty much it to the syntax ... or is it? 
no. we added another cool feature: node-shapes. 
sometimes you just want to have an easy mode to categorize your nodes into few different kinds to visualize them even better. 
so we added four easy to use visualizations: **squares, circles, diamonds and clouds**:

+++node
[square]
(circle)
<diamond>
{cloud}
+++

as we like to use *what you see is what you mean* our syntax tries to reflect that by wrapping the content simply in:

+++layout:inline
+++code
[square]
(circle)
<diamond>
{cloud}
+++


+++table
key-pair|description
[ ]| puts content into a square
( )| puts content into a circle
< >| puts content into a diamond  
{ }| puts content into a cloud
+++

+++
---
## enough of syntax already

there are some more cool features to play with the syntax of the data-structure, but for now we will take a look at the output.
when all our nodes and connections are declared we want to tinker with the output of the data. 
for now we have implemented three ways of output:
1. simpleflow
2. sequence
3. tree

to change the output of a node we declare what type of node-display we want to build in the head of the node. the same as in charts we put it with a `:` to the header:
+++code
 +++node:sequence
a->b:hello
b->a:hi
 +++
+++

if you don't declare a node-display in the header it defaults to *simpleflow*. 


---
## sequence

the one that inspired us to build this extension was the plugin [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) by Andrew Brampton.
unfortunately it did not work as intended when we tried to implement it in slidenotes.io. but as we liked this feature a lot we rebuilt our own version of it and altered the syntax a litle bit to be more open for other types of node-displays in the future (like trees, spread...)

a sequence is a nice visualization for how a lot of exchanges happen in sequences. its the *alice talks to bob*-graph so to say. 

lets have a look at an example:
---
## sequence-example
+++node:sequence
a->b: hi
b-->a: *hello*
a=>b: *what?*
b->>a: **i said hello!**
b=>a: again
a:alice
b:bob
+++

with few definitions we achieved a nice sequence-diagram. 

---
## sequence example with notes

lets add a little bit of syntax: we want to have *notes* to reflect things alice and bob are doing to achieve the following:

+++node:sequence
a->b: provides email + password
note right of b: generates token
b->a: provides token
note left of a: stores token
a-->b: asks for note, provides token
note right of b: checks token & looks up note in db
b-->a: sends note back
note over a: opens note
a:(client)
b:{server}
+++

---
## sequence code of example with notes

lets take a look at the code of the example

+++code
a->b: provides email + password
§§note right of b: checks email + password, generates token
b->a: provides token
§§note left of a: stores token
a->b: asks for note, provides token
§§note right of b: checks token, looks up note in db
b->a: sends note back
§§note over a: opens note
a: client
b: server
+++

we declared notes and positioned them left from *client* and right from *server*, then at last we put a note *over* the client. 

---
## sequence example with notes

why not hit escape and play a little bit with this sequence? 

+++node:sequence
a->b: provides email + password
note right of b: *generates token*
b->a: provides token
note left of a: *stores token*
a-->b: asks for note, *provides token*
note right of b: *checks token & looks up note in db*
b-->a: *sends note back*
note over a: **opens note**
a: client
b: server
+++

when you are finished continue on next slide

---
##tree

trees are a bit more complicated, as they have additional rules to build up a valid tree. lines which would break this rules are simply ignored. the rules are simple: 

1. each node has only one parent—so only one note pointing to it—but "backarrows" are allowed on yet established good connections
2. nodes cannot be connected over more then one line backwards

+++code
a->b: downward-arrow text
a->c: arrow to c
b->a: points back to a
b->b1: first child of b
b->b2: second child of b
c->c1: last arrow
a->c1: this line does not comply first rule and is ignored
c1->a: this line does not comply second rule and is ignored
+++

+++node:tree
a->b: downward-arrow text
a->c: arrow to c
b->a: points back to a
b->b1: first child of b
b->b2: second child of b
c->c1: last arrow
a->c1: this line does not comply first rule and is ignored
c1->a: this line does not comply second rule and is ignored
+++
---
## using declarations and markdown

we forgot to mention but as you saw in the examples you can use markdown-code inside a node-block 
if you want to use markdown in nodes we highly recommend using a declaration for the node. 
which brings us to the last syntax we did not touch until now: 
multiline declaration of nodes. 
as normal nodes are declared either inside a connection-declaration (arrow) or inside a declaration by itself its normaly limited to one line. 
to avoid this we implemented the declaration-block. 
it starts with a line with `alias::` and ends with a line soley containing `::alias`. for 
example:
+++code
alice::
a multiline
declaration
::alice
+++

+++node
alice::
a multiline
declaration
::alice
+++
---
# that's it folks

did you like the tutorial? are you missing some parts or some modes how to interprete your node-data? tell us what you need most and what we should implement next. 
our ideas are to implement:
- flow-diagrams *(similar to simple-flow but allowing more complex connections)*
- dot-tree *(connections dont show text anymore, nodes are small like dots) *
- sunshine *(spreads the nodes in a sunshine-like way, has only 1 parent for all sub-nodes) *
- mindmap *(spreads nodes around a centered start-node) *
- pyramid *(builds a pyramid-like tree)*
---
##your saved time with writing nodes in slidenote instead of constructing it within powerpoint

+++chart
xaxis: numbers of nodes in presentation
yaxis: time saved in minutes
---
1: 20
2: 45
3: 70
4: 100
+++


||€€imagepart€€||
[{"names":["context-menu_node.svg"],"filename":"context-menu_node.svg","base64url":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCA4OCAyOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxuczpzZXJpZj0iaHR0cDovL3d3dy5zZXJpZi5jb20vIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Ij48Zz48cGF0aCBkPSJNNzUuNTI0LDguODAxYzAsLTQuODU3IC0zLjk0NCwtOC44MDEgLTguODAxLC04LjgwMWwtNTcuOTIyLDBjLTQuODU3LDAgLTguODAxLDMuOTQ0IC04LjgwMSw4LjgwMWwwLDExLjMzNWMwLDQuODU3IDMuOTQ0LDguODAxIDguODAxLDguODAxbDU3LjkyMiwwYzQuODU3LDAgOC44MDEsLTMuOTQ0IDguODAxLC04LjgwMWwwLC0xMS4zMzVaIiBzdHlsZT0iZmlsbDojMTI1ZTY5OyIvPjxwYXRoIGQ9Ik03OC40MTMsNC4wOTVjMC4yMjYsMC4wMjggMC40MzMsMC4xMiAwLjYwNiwwLjI3Mmw3Ljc3MSw3LjM4NmMwLjM5OCwwLjQwOCAwLjM5MiwxLjA1NCAtMC4wMDcsMS40NTVsLTcuNzU1LDcuMjQ4Yy0xLjE5MiwxLjAzNCAtMS42NTYsLTAuMDQ1IC0xLjY4MywtMC43MjlsLTAuMDE1LC0xNC42MzRjMC4wMjEsLTAuNTgxIDAuMzMyLC0xLjAzMiAxLjA4MywtMC45OThaIiBzdHlsZT0iZmlsbDojMTI1ZTY5OyIvPjxwYXRoIGQ9Ik02MC41MzYsMTEuODYxYzAuMjY2LDAuMDI0IDAuNTA1LDAuMTQgMC42ODgsMC4zMzVsMy43ODIsNC4yNjZjMCwtMCA0LjA5MywtNC4xNzkgNC4wOTMsLTQuMTc5YzAuNzU1LC0wLjY0NCAyLjIzMiwwLjQwOCAxLjQyNiwxLjM5NmMtMS41NjMsMS42OTcgLTMuMjI2LDMuMyAtNC44NCw0Ljk0OWMtMC4zOTQsMC4zNzggLTEuMDI0LDAuMzgyIC0xLjQyMiwwLjAwOGMtMS41NjIsLTEuNjU4IC0zLjAyNCwtMy40MDkgLTQuNTM1LC01LjExNGMtMC41MTksLTAuNjIxIC0wLjE4MiwtMS42OTEgMC44MDgsLTEuNjYxWiIgc3R5bGU9ImZpbGw6I2ZmZjsiLz48dGV4dCB4PSIxMC40MTVweCIgeT0iMjAuODU0cHgiIHN0eWxlPSJmb250LWZhbWlseTonUnViaWstUmVndWxhcicsICdSdWJpayc7Zm9udC1zaXplOjE3cHg7ZmlsbDojZmZmOyI+bjx0c3BhbiB4PSIyMC41NDdweCAzMC4xMzVweCA0MC4wOHB4ICIgeT0iMjAuODU0cHggMjAuODU0cHggMjAuODU0cHggIj5vZGU8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+"},{"names":["playbutton.svg"],"filename":"playbutton.svg","base64url":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNDcgMTQ2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxwYXRoIGQ9Ik04MS4xMzQsMjEuNjY1YzMxLjQ1Nyw2LjY3MiA2Ny4wNTEsMjMuMzA5IDY1LjM4MSw3NC4xNjZjLTAuNzI2LDIyLjExIC04LjE5OSwzOC40MzYgLTIwLjE4Miw1MC4xNjlsLTEyNi4zMzMsMGwwLC0xNDZjMS43NTgsMC42MjUgMy41NDEsMS42ODggNS4zNDEsMy4yNGMxNS4zNDIsMTMuMjE2IDU2LjA5LDE0LjI0NSA3NS43OTMsMTguNDI1WiIgc3R5bGU9ImZpbGw6dXJsKCNfTGluZWFyMSk7Ii8+PHBhdGggZD0iTTUzLjUyNCw2NS41MTNjMC42ODEsMC4wOTkgMC43MjgsMC4xOTkgMS4wMjIsMC40MDNsMzIuMjQyLDI0LjY3MmMxLjAzNCwwLjg3IDAuOTU1LDIuNTU1IC0wLjE5OSwzLjMxMWwtMzIuMjQyLDE5LjAyNGMtMS4yODEsMC42NzggLTIuOTQ3LC0wLjIgLTMuMDE3LC0xLjcyM2wwLC00My42OTZjMC4wNTMsLTEuMTQ5IDEuMDA4LC0yLjA1MSAyLjE5NCwtMS45OTFaIiBzdHlsZT0iZmlsbDojZmZmO2ZpbGwtb3BhY2l0eTowLjg4OyIvPjxwYXRoIGQ9Ik03Ny4xNDMsMjguMDU3YzEyLjc4NCwzLjA5OCAyMi42MzUsOC41MTcgMTkuNTEsMTQuMjE2Yy0zLjQxOCw2LjIzNCAtMTQuNzgxLDUuODg0IC0yNy41NjUsMi43ODZjLTEyLjc4MywtMy4wOTggLTIzLjYzOCwtNy4zMTYgLTIxLjk2NCwtMTQuMjI1YzEuNjc1LC02LjkxIDE3LjIzNSwtNS44NzUgMzAuMDE5LC0yLjc3N1oiIHN0eWxlPSJmaWxsOiNmZmY7ZmlsbC1vcGFjaXR5OjAuMTU7Ii8+PHBhdGggZD0iTTExNC42NDgsNDQuMDc1YzMuMjgzLDEuOTAyIDUuOTg2LDYuNjE4IDMuNjQzLDEwLjVjLTIuMzQzLDMuODgzIC02LjgxOSwyLjc3NCAtMTAuMjM2LDAuODIyYy02LjMxOCwtMy42MDggLTUuNDQyLC02LjkwNiAtNC4xNjYsLTkuMTc2YzIuMjIyLC0zLjk1MyA2LjY3NCwtNC41MTIgMTAuNzU5LC0yLjE0NloiIHN0eWxlPSJmaWxsOiNmZmY7ZmlsbC1vcGFjaXR5OjAuMTU7Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJfTGluZWFyMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDE3Ny41NjUsLTI0OC44ODYsMjQ4Ljg4NiwxNzcuNTY1LDMuOTU1MTksMTc5LjM5KSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojY2Q3YjY3O3N0b3Atb3BhY2l0eTowLjg4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojNzJjM2QzO3N0b3Atb3BhY2l0eTowLjg4Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+"}]