# Code Tutorial
Welcome to the Code-Tutorial. This tutorial explains how to implement and use images in slidenotes.io. 

To begin the presentation press ctrl+Escape or the play button

---
# How to use Code-Blocks in Slidenotes

We love to code. But what we dont like is this weekly drama of making a presentation about the new development. Often at the latest moment we have to work fast. But copying it in the GUI is not nearly enough - you have to reformat it, give your code some meaning, give it some syntax-highlightning and structure it in a way that your clients or your CEO understands and sees the beauty in it. 

Well, don't suffer anymore - Slidenotes will help you to work fast, easy and reliable to make your Code look good inside your presentation whilest keeping the amount of work at a minimum. Maybe you shouldn't tell it your boss how fast it is, otherwise he wants a presentation every day?

Lets dive in this topic and get it done

---
# Code inline

A "Code" in Slidenotes means, that the content of it will not be interpreted as MD-Code but as Text and rendered likewise.
So if you want to put some Code into a line of normal text you put it inside two back-ticks: `\`**some code here**\``

As you can see, the `**` are not interpreted but displayed as normal text and/or depending on the theme you choose will be highlighted as a code-segment. 

This is the inline-style of baking code into your presentations. Inline code can not be altered or configured more than that, as they are meant only for small inline-segments. Of course its very limited, but can be usefull a lot of times. 

If you want to write backticks inside the code-segment you simply put a `\ ` in front of it like so: `\\``.
 
Next we are looking at Code-Blocks
---
# Code as blocks 

More often we use Code-Blocks to transform a bunch of written code into a beautiful rendered block. The Codeblock makes automagicaly use of Syntax-Highlightning and can be altered in some ways that it makes them very convenient to use as standard-method to present your Coding. 

A Code-Block is written as any other special blocks in Slidenotes: It starts with a line containing the code-block ***head*** `+++code`, followed by lines of code and closed by a line containing the end-sign of the block `+++`. So a codeblock looks like this: 

```code
+++code
var mycode = "is super beautiful";
+++
```

Alternatively you can use the ***GitHub Syntax*** for code-blocks:
+++code
```
var mycode = "is super beautiful";
```
+++

---
# Entering Codeblocks via Toolbar

The Toolbar figures out automaticaly which one you want to enter. So if you just `click on it while the cursor is inside a line` it will create a simple inline-code-tag around the cursor. 
If your cursor is at the beginning of a line it will insert a codeblock.

If you mark **some text inside the editor** and then hit the Toolbarbutton it will wrap the text with simple inline-code-tags *if the text is in one line*. If you marked *more than one line* it will wrap it inside a codeblock instead. 

Why not hitting escape and try it out on this slide, then come back? 

---
# Advanced configuration of your codeblocks

We put some more love into codeblocks then just some syntax-highlightning. To make use of the advanced options you have to declare it inside the code-block-head by giving it the *options-flag* `:options`

Now you can insert a new-slide symbol `---` into a line in the codeblock to separate between config-options (all above the ---)  and your code. 

So a codeblock could look like this: 

+++layout:inline
## SourceCode
```
+++code:options
linehighlight=3
---
my_superfunction(){
  //the following line is what i want to focus your attention on:
  parentElement.doSomethingVerySpecial();
}
+++
```

## Result:
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
  parentElement.doSomethingVerySpecial();
}
+++
+++


---
# Overview over advanced options

As for now we support following options: 

## linenumbering
linenumbering controls if you want to make linenumbers appear in the output. Can be *"on"* or *"off"*, default is *"on"*

## linenumberingstart
linenumberingstart defines the start-line for the output if linenumbering is activated. If your original Code-Snippet you want to present starts in line 50 and you want the output to reflect that put it to 50. expects a number, default is 1. 

## language
While the editor tries to figure out automaticaly which language it should use for syntaxhighlightning, sometimes it does not get it right. If this happens you can try it by directly defining it here. 

## linehighlight
Often you want to highlight some lines of your code to make them more attractive. "linehighlight" is one easy solution to that - just type in the numbers of lines you want to highlight. make shure the linenumber is counted in the md-code. so first line in your md-code is line 1 and so forth. 
You can enter multiple numbers separated by comma and also line-spans like `1-3`

## speciallinemarker
If you have a lot of code or dont want to rely on fixed line-numbers because you may alter the number of lines of code you use for the presentation but wants the same lines to be highlighted, you can make use of the speciallinemarker - it "marks" a line to be used as highlighted line. therefore you insert the speciallinemarker at the beginning of the target line. With the option `speciallinemarker` you can define what signs should be interpreted as such markers. Default is `§§`. 

## specialstartmarker and specialendmarker
You want to highlight only part of a line? You can do that by marking them as special with a start- and end-marker. The option `specialstartmarker` lets you define the syntax used for the beginning and `specialendmarker`the end of your marks. 
Defaults: `specialstartmarker=§a` and `specialendmarker=§e` 

---
# Context-Menu to the help

You dont have to remember every option to use them. Whenever your cursor is inside a code-block you can use the context-menu on the left side of the textarea to help you out. It will insert the option at the right place, giving you also hints how to use it. Just press Escape and try it for yourself. 
Here are some examples for you

+++code:options
linenumbering=off
---
my_function_call(lets, test, it){
 //here comes my logic
 return lets[test.length - it].result;
};
+++

```code:options
linehighlight=1,3
---
my_function_call(lets, test, it){
 //here comes my logic
 return lets[test.length - it].result;
};
```


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

