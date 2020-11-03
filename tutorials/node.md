# welcome to the node-tutorial


please press `ctrl/cmd + enter` or the playbutton in the bottom left corner to start the tutorial presentation

---
## what are nodes? and why should i bother? 

some data can be best expressed by displaying some nodes and the relations it has to other nodes. a quick example would be the flow of a process: 

+++node
start->middle
middle->end
+++

to get data like that we implemented a node-tag with its **own, very simple and intuitive syntax**
---
## the syntax

node-tags follow a simple and human-friendly syntax - easy to remember and so intuitive that you will not spend much time learning it. 

the simplest form is by declaring a connection: 
+++code
 +++node
node -> second node:a message
 +++
+++

in this simple line you have done the following:
1. declare first node with content "***node***"
2. build an arrow-connection with "***->***"
3. declare a second node with content "***second node***
4. attach message to arrow with "***:***" with content "***a message***"
---
## wasnt that simple?

lets see the result:

+++node
node -> second node:a message
+++

we intent to make the syntax as intuitive as possible and as easy as it could be to use. but of course, the **context-menu** is always there to help you if you dont remember something. 

maybe its time for you to play a little with the node-declaration for yourself now. press `escape` (or the *x* with your mouse in the presentation-controls) and alter the above node in this slide, then press `strg/cmd + enter` or the playbutton to continue.
---
## different types of connections

sometimes you want different types of connections, sometimes you dont need connections at all. 
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

but if you write more complex type of connections where you have to repeatidly enter the same name again and again - sometimes you want to declare the content of them otherwise. 
well - you can do that:
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
## getting exited? 

thats pretty much it to the syntax... or is it? 
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
## enough of syntax allready

well, there are some more cool features to play with the syntax of the data-structure, but for now we will look at the output.
when we have declared all our nodes and connections we want to tinker the output of the data. 
for now we have implemented three ways of output yet:
1. simpleflow
2. sequence
3. tree

to change the output of a node we declare in the head of the node what type of node-display we want to build. the same as in charts we put it with a `:` to the header:
+++code
 +++node:sequence
a->b:hello
b->a:hi
 +++
+++

if you dont declare a node-display in the header it defaults to simpleflow. 


---
## sequence

the one that inspired us to build this extension was the plugin [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) of Andrew Brampton.
unfortunately it did not work as intended when we tried to implement it in slidenotes.io. but as we liked this feature a lot we rebuild our own version of it and altered the syntax a litle bit to be more open for other types of node-displays in the future (like trees, spread...)

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
## simple-flow example with backarrows

just another example to show some possibilitys with simple-flow graphs

+++node
a=>b: to b
b->c: to c
c->a: c to a
a:[A]
b:<b>
c:(C)

+++

---
##tree

trees are a bit more complicated, as they have additional rules to build up a valid tree. lines which would break this rules are simply ignored. the rules are simple: 

1. each node has only one parent - means only one note pointing to it - but "backarrows" are allowed on yet established good connections
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
# thats it folks

did you like the tutorial? are you missing some parts or some modes how to interprete your node-data? tell us what you need most and what we should implement next. 
our ideas are to implement:
- flow-diagrams *(similar to simple-flow but allowing more complex connections)*
- dot-tree *(connections dont show text anymore, nodes are small like dots) *
- sunshine *(spreads the nodes in a sunshine-like way, has only 1 parent for all sub-nodes) *
- mindmap *(spreads nodes around a centered start-node) *
- pyramide *(builds a pyramid-like tree)*
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

