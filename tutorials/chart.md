# chart-tutorial
welcome to the chart-tutorial! 

this tutorial explains how to use charts in slidenotes.io. 

to begin the presentation press `ctrl+escape` or the `play button`
---
## a simple chart

a chart is a **graphical interpretation of data**. therefore all you need is to write down a chart-section and inside of it the data:

+++code
\+++chart
identifier: 10
identifier2: 22
identifier3: 33
\+++
+++

and you get a simple chart like this:

+++chart
identifier: 10
identifier2: 22
identifier3: 33
+++
---
## real world example

as you saw, the ***datastructure*** is quiet simple. you need an **identifier** and a **value** in form of **a number**. lets take a more realistic example and say we want to demonstrate the maximum temperatures of last week: 

+++code
\+++chart
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
\+++
+++

as you can see, its quite easy to write down and it makes a clean linear graph out of it:

+++chart
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
+++

---
## different chart types: bar

charts can have different *types*. as now, slidenotes.io supports *8 different types* for you to select, which are divided into three groups: **linear**, **bar** and **pie**. each different type has its own chart-header as `\`\`\`chart:type`. so to write the same example as before, but this time as a **bar**-chart you would write in the header: `\`\`\`chart:bar`

+++code
\+++chart:bar
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
\+++
+++

you will get:

+++chart:bar
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
+++

---
## different chart-types: pie 

as the example before does not make any sense to a pie lets just bake a pie. 

+++layout:left
##recipe
+++code
\+++chart:pie
flour:300
sugar:100
butter:100
baking powder:5
apple:1000
\+++
+++

1. mix everything except the apples and fill your form with 2/3 of the mass
2. cut apples very fine and fill your form up
3. top it with the mass you have left in crumbles, so that apples still are visible
4. put it in the oven for 40 minutes...

+++

###baked result:

+++chart:pie
flour:300
sugar:100
butter:100
baking powder:10
aplle:1000
+++


well... enough of that. lets continue. 

---
## experiment yourself

so why not try it yourself now? hit escape and alter the following chart. note: you can use the elements insert-menu to help you with the task whenever your carret is inside a chart-section. windows-keyboard-user can also press "control"+"contextmenu" to open up the insert-menu.   
graph-types are: 
a) line, arealine
b) bar, horizontalbar, stackbar, horizontalstackbar
c) pie, halfpie 

+++chart:line
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
+++

---
## datastructure

as we mentioned before: charts are the representation of data. this data has to be accessible in a certain form. in the previous example we always used the form which is the best and easiest way for us humans to get it right. for small graphs like this, mostly written by hand on the fly, its the best. so lets say its the slidenote-style.  unfortunately this is seldom the case with real data you want to use. 
because data in the real world comes from other sources and certainly you dont want to write them again by hand to use them. so what to do? write your own regex or changing it by hand? hopefully not. 

###supported datastructures:

the datastructure needs the following: an **identifier** and its related **value**. most real world data comes in tables. so we support the following structures: 

+++layout:left
###horizontal

1. line with identifiers, separated by an separator
2. line with values, separated by an separator

+++

+++layout:right

###vertical
column with **identifiers** - **separator** - **value**

lets make that clearer with an example on the following page.

+++

---
## example datastructures
lets write the datastructure in the two ways and as a separator we use a comma. 
+++layout:left
## the horizontal way:
+++code
monday,tuesday,wednesday,thursday,friday,saturday,sunday
33,28,26,28,28,37,36
+++

## the vertical way:
+++code
monday,33
tuesday,28
wednesday,26
thursday,28
friday,28
saturday,37
sunday,36
+++
+++

##output:
horizontal:
+++chart
monday,tuesday,wednesday,thursday,friday,saturday,sunday
33,28,26,28,28,37,36
+++

vertical:
+++chart:line
monday,33
tuesday,28
wednesday,26
thursday,28
friday,28
saturday,37
sunday,36
+++
---
## datastructure: separator

the separator in the previous example used was the comma. it is compliant with the .csv-structure so you should be able to input your data directly from .csv-files you either exported from a database or your excell-sheet. 
but this can be inconvenient as you dont want to export your sheet to csv... its just simple text. 
to make things easier for you we support different separators - as of now they are:
**":"     "tab"      ","      ";"**

with this, we have covered most if not all sheet-programs, so that you can just mark your data in your excell-sheet, copy it (ctrl+c) and insert it here (ctrl+v). was it ever easier or faster to create a graph out of your data? 

---
## but wait... there is more...

getting exited yet how easy it is? well, what happens if you have more then one dataset? lets say we want to compare last years average temperatures with this years average temperatures by month. what does this means? first of all it means that each **identifier** has **more than *one* value**. 
this sounds more complicated than it is. lets write it down the slidenote-way:
*month* : *value last year* : *value this year*
+++code
january: 9.8:12.3
february: 10.1:11.3
march: 12.2:14.1
april: 16.0:15.4
+++ 

+++chart
january: 9.8:12.3
february: 10.1:11.3
march: 12.2:14.1
april: 16.0:15.4
+++

---
## multiple datavalues in datastructure

as we have seen, its easy to get more data into it. in the horizontal style you add just one line with separated values:

+++code
january,february,march,april
9.8,10.1,12.2,16.0
12.3,11.3,14.1,15.4
+++

in the vertical style you add it with a separator similar to the slidenote-style:

+++code
january,9.8,12.3
february,10.1,11.3
march,12.2,14.1
april,16.0,15.4
+++

---
## more than one means exactly that...
lets try this one:
+++code
january,february,march,april
9.8,10.1,12.2,16.0
1,2,6,8
4.9,5.6,8.8,11.4
+++

###temperatures athenas, paris, frankfurt:
+++chart
january,february,march,april
9.8,10.1,12.2,16.0
1,2,6,8
4.9,5.6,8.8,11.4
+++



---
## something is missing... metadata
getting fixed on? you want more control? well, here it comes - the options-area. 
with a `---` as a line inside your chart-section you divide the chart-section in two areas. the upper one (or "everything before the line with ---") is the options-area, where you can define certain options for this chart specificly. we will go over them briefly, but first lets look at an example:
+++code
\+++chart
xaxis: months 
yaxis: temperature in celsius
dataset1: this year 
dataset2: last year
---
january:9.8:12.3
february:10.1:11.3
march:12.2:14.1
april:16.0:15.4
\+++
+++

as you can see, there are four entrys in the options-area. the first two define the labels as they would apear aside or under the axis. then there is **dataset1**  and **dataset2**. with this we set a title for each set of values. lets see that in action on the next slide.

---
## experiment with it

here you see the result of the chart-code of the last example. press escape and experiment with it as you like, then come back or continue on next slide. you are nearly through. 

+++chart
xaxis: months 
yaxis: temperature in celsius
dataset1: this year 
dataset2: last year
---
january:9.8:12.3
february:10.1:11.3
march:12.2:14.1
april:16.0:15.4
+++

  
---
## overview over chart-options

charttypes can have different options. for example an x-axis-label does not make any sense on a pie-chart. if you ever wonder, the insert-menu from charts helps you in finding the right ones. you dont have to remember them all. but nevertheless here is an overview:

1.) xaxis: displays a label under the x-axis
2.) yaxis: displays a label aside the y-axis
3.) dataset$: displays a label atop the graph with the text in this line
4.) summary: displays to screenreader an alternative text which should summarise the graphs output. dont copy your data here, as your data is accessible to screenreaders in form of a table! instead give a sumarize
---
## more options to come   

you want more options? well, we are eager to implement more in the future. tell us what you think would be a usefull option, we are open for feedback as always :)


---
## thats it!

thank you for using this tutorial. we hope it helped you. 

also special thanks to gion kunz and all the contributers to the project [chartistjs](http://gionkunz.github.io/chartist-js/index.html) which delivers the magic of the graph. 

