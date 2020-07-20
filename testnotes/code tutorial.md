# code tutorial
welcome to the code tutorial! 

this tutorial explains how to implement and use images in slidenotes.io. 

to begin the presentation press `ctrl+escape` or the play button

---
## how to use code-blocks in slidenotes

we love to code. but what we dont like is this weekly drama of making a presentation about the new development. often at the latest moment we have to work fast. but copying it in the gui is not nearly enough - you have to reformat it, give your code some meaning, give it some syntax-highlightning and structure it in a way that your clients or your ceo understands and sees the beauty in it. 

well, don't suffer anymore - slidenotes will help you to work fast, easy and reliable to make your code look good inside your presentation whilest keeping the amount of work at a minimum. maybe you shouldn't tell it your boss how fast it is, otherwise he wants a presentation every day?

lets dive in this topic and get it done

---
## code inline

a "code" in slidenotes means, that the content of it will not be interpreted as md-code but as text and rendered likewise.
so if you want to put some code into a line of normal text you put it inside two back-ticks: `**some code here**`

as you can see, the `**` are not interpreted but displayed as normal text and/or depending on the theme you choose will be highlighted as a code-segment. 

this is the inline-style of baking code into your presentations. inline code can not be altered or configured more than that, as they are meant only for small inline-segments. of course its very limited, but can be usefull a lot of times. 

if you want to write backticks inside the code-segment you simply put a `\ ` in front of it like so: `\\`.
 
next we are looking at code-blocks
---
## code as blocks 

more often we use code-blocks to transform a bunch of written code into a beautiful rendered block. the codeblock makes automagicaly use of syntax-highlightning and can be altered in some ways that it makes them very convenient to use as standard-method to present your coding. 

a code-block is written as any other special blocks in slidenotes: it starts with a line containing the code-block ***head*** `+++code`, followed by lines of code and closed by a line containing the end-sign of the block `+++`. so a codeblock looks like this: 

```code
+++code
var mycode = "is super beautiful";
+++
```

alternatively you can use the ***github syntax*** for code-blocks:
+++code
```
var mycode = "is super beautiful";
```
+++

---
## entering codeblocks via toolbar

the toolbar figures out automaticaly which one you want to enter. so if you just `click on it while the cursor is inside a line` it will create a simple inline-code-tag around the cursor. 
if your cursor is at the beginning of a line it will insert a codeblock.

if you mark **some text inside the editor** and then hit the toolbarbutton it will wrap the text with simple inline-code-tags *if the text is in one line*. if you marked *more than one line* it will wrap it inside a codeblock instead. 

why not hitting escape and try it out on this slide, then come back? 

---
## advanced configuration of your codeblocks

we put some more love into codeblocks then just some syntax-highlightning. to make use of the advanced options you have to declare it inside the code-block-head by giving it the *options-flag* `:options`

now you can insert a new-slide symbol `---` into a line in the codeblock to separate between config-options (all above the ---)  and your code. 

so a codeblock could look like this: 

+++layout:inline
### sourcecode
+++
+++code:options
linehighlight=3
---
my_superfunction(){
  //the following line is what i want to focus your attention on:
  parentelement.dosomethingveryspecial();
}
+++
+++

### result:
+++code:options
linehighlight=3
linenumbering=off
linenumberingstart=1
language=
speciallinemarker=§§
specialstartmarker=§a
specialendmarker=§e
---
my_superfunction(){
  //the following line is what i want to focus your attention on:
  parentelement.dosomethingveryspecial();
}
+++
+++


---
## overview over advanced options

as for now we support following options: 

### linenumbering
linenumbering controls if you want to make linenumbers appear in the output. can be *"on"* or *"off"*, default is *"on"*

### linenumberingstart
linenumberingstart defines the start-line for the output if linenumbering is activated. if your original code-snippet you want to present starts in line 50 and you want the output to reflect that put it to 50. expects a number, default is 1. 

### language
while the editor tries to figure out automaticaly which language it should use for syntaxhighlightning, sometimes it does not get it right. if this happens you can try it by directly defining it here. 

---

### linehighlight
often you want to highlight some lines of your code to make them more attractive. "linehighlight" is one easy solution to that - just type in the numbers of lines you want to highlight. make shure the linenumber is counted in the md-code. so first line in your md-code is line 1 and so forth. 
you can enter multiple numbers separated by comma and also line-spans like `1-3`

### speciallinemarker
if you have a lot of code or dont want to rely on fixed line-numbers because you may alter the number of lines of code you use for the presentation but wants the same lines to be highlighted, you can make use of the speciallinemarker - it "marks" a line to be used as highlighted line. therefore you insert the speciallinemarker at the beginning of the target line. with the option `speciallinemarker` you can define what signs should be interpreted as such markers. default is `§§`. 

### specialstartmarker and specialendmarker
you want to highlight only part of a line? you can do that by marking them as special with a start- and end-marker. the option `specialstartmarker` lets you define the syntax used for the beginning and `specialendmarker`the end of your marks. 
defaults: `specialstartmarker=§a` and `specialendmarker=§e` 

---
## context-menu to the help

you dont have to remember every option to use them. whenever your cursor is inside a code-block you can use the context-menu on the left side of the textarea to help you out. it will insert the option at the right place, giving you also hints how to use it. just press escape and try it for yourself. 
here are some examples for you

+++code:options
linenumbering=off
---
my_function_call(lets, test, it){
 //here comes my logic
 return lets[test.length - it].result;
};
+++

+++code:options
linehighlight=1,3
---
my_function_call(lets, test, it){
 //here comes my logic
 return lets[test.length - it].result;
};
+++


+++code
my_function_call(lets, test, it){
 //here comes my logic
§§ return lets[test.length - it].result;
};
+++


+++code:options
specialstartmarker=§a
specialendmarker=§e
---
my_function_call(lets, test, it){
 //here comes my logic
 return §a lets[test.length - it]§e.result;
};
+++

