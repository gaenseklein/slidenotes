# chart-tutorial
welcome to the chart-tutorial! 

this tutorial explains how to use charts in slidenotes.io. 

to begin the presentation press `ctrl/cmd+Enter` or the `play button`
---
## a simple chart

a chart is a **graphical interpretation of data**. so you only need to open a chart-section and type in your data:

+++code
 +++chart
identifier: 10
identifier2: 22
identifier3: 33
 +++
+++

and you get a simple chart like this:

+++chart
identifier: 10
identifier2: 22
identifier3: 33
+++
---
## real world example

as you saw, the datastructure is quite simple. you need an **identifier** and a **value** in form of a number. lets take a more realistic example and say we want to demonstrate the maximum temperatures of last week: 

+++code
 +++chart
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
 +++
+++

it's quite easy to write down and slidenotes generates a clean linear graph out of it:

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

charts can have different *types*. at the moment slidenotes.io supports *8 different types* for you to select, which are divided into three groups: **linear**, **bar** and **pie**. each different type has its own chart-header as `+++chart:type`. so to write the same example as before, but this time as a **bar**-chart you would write in the header: `+++chart:bar`

+++code
 +++chart:bar
monday:33
tuesday:28
wednesday:26
thursday:28
friday:28
saturday:37
sunday:36
 +++
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

the example before does not make any sense for a pie, so let's just bake a pie. 

+++layout:left
##recipe
+++code
 +++chart:pie
flour:300
sugar:100
butter:100
baking powder:5
apple:1000
 +++
+++

1. mix everything except the apples and fill your form with two thirds of the mass
2. cut apples and fill your form
3. top it with the mass you have left in crumbles, so that the apples are still visible

+++

###baked result:

+++chart:pie
flour:300
sugar:100
butter:100
baking powder:10
apple:1000
+++


now put it in the oven for 40 minutes! 

---
## experiment yourself

so why not try it yourself now? hit `escape` and alter the following chart. note: you can use the elements' insert-menu to help you with the task whenever your carret is inside a chart-section. windows-keyboard-user can also press `control+contextmenu` to open up the insert-menu.   
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

as we mentioned before: charts are the representation of data. this data has to be accessible in a certain form. in the previous example we always used the form which is the best and easiest way for us humans to get it right. for small graphs like this, mostly written by hand on the fly, its the best. so lets say it's the *slidenotes-style*.  unfortunately this is seldom the case with real data you want to use. 
because data in the real world comes from other sources and you certainly don't want to write them again by hand. so what to do? write your own regex or changing it by hand? hopefully **not**. 

###supported datastructures:

the datastructure needs the following: an **identifier** and its related **value**. most real world data comes in tables. so we support the following structures: 

+++layout:inline



###horizontal
1. line with identifiers, separated by a separator
2. line with values, separated by a separator


###vertical
column with **identifiers** - **separator** - **value**

+++


lets make that clearer with an example on the following page.


---
## example datastructures
let's write the datastructure in two ways
+++layout:left
### horizontal datastructure:
+++code
monday,tuesday,wednesday,thursday,friday,saturday,sunday
33,28,26,28,28,37,36
+++

### vertical datastructure:
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

###output:

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
or: copy and paste

the separator used in the previous example was the comma. it is compliant with the *.csv-structure* so you should be able to input your data directly from *.csv-files* you either exported from a database or your excell-sheet. 
but this can be inconvenient as you don't want to export your sheet to csv... it's just simple text. 
to make things easier for you we support different separators. as of now they are:
**":"     "tab"      ","      ";"**

with this, we have covered most if not all sheet-programs, so that you can just mark your data in your excell-sheet, copy it `ctrl+c` and insert it here `ctrl+v`. was it ever easier or faster to create a graph out of your data? 

---
## but wait... there is more...

already getting excited how easy it is? well, what happens if you have more then one dataset? let's say we want to compare last year's average temperatures with this year's average temperatures by month. what does this mean? first of all it means that each **identifier** has **more than *one* value**. 
this sounds more complicated than it is. lets write it down the slidenotes-way:
*month* : *value last year* : *value this year*
+++code:options
language=html
---
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

as we have seen, it's easy to get more data into it. in the horizontal style you add just one line with separated values:

+++code:options
language=html
---
january,february,march,april
9.8,10.1,12.2,16.0
12.3,11.3,14.1,15.4
+++

in the vertical style you add it with a separator similar to the slidenotes-style:

+++code:options
language=html
---
january,9.8,12.3
february,10.1,11.3
march,12.2,14.1
april,16.0,15.4
+++

---
## let's try this one
+++code:options
language=html
---
january,february,march,april
9.8,10.1,12.2,16.0
1,2,6,8
4.9,5.6,8.8,11.4
+++

###temperatures in athenas, paris, frankfurt:
+++chart
january,february,march,april
9.8,10.1,12.2,16.0
1,2,6,8
4.9,5.6,8.8,11.4
+++



---
## something is missing... metadata

you want more control? well, here it comes—the options-area. 
with a `---` as a separator inside your chart-section you divide the chart-section in two areas. the upper one (or everthing before the separator) is the *options-area*, where you can define certain options for this chart specifically. 
let's look at an example:
+++code
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
+++

as you can see, there are four entries in the *options-area*. the first two define the labels as they would appear aside or under the axis. then there is **dataset1**  and **dataset2**. with this we set a title for each set of values. let's see that in action on the next slide ➡︎

---
## experiment with it

here you see the result of the chart-code of the slide before. press escape and experiment with it as you like, then come back or continue on the next slide. you are almost through the tutorial! 

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
## overview: chart-options

chart types can have different options. for example an x-axis-label does not make any sense on a pie-chart. if you ever wonder, the **insert-menu** from the charts block helps you in finding the right ones. you don't have to remember them all. but nevertheless here is an overview:

1.) xaxis: displays a label under the x-axis
2.) yaxis: displays a label aside the y-axis
3.) dataset$: displays a label atop the graph with the text in this line
4.) summary: displays an alternative text *to screenreaders* which should summarise the graph's output. dont copy your data here, as your data already is accessible to screenreaders in form of a table! give a summary instead
---
## more options to come   

you want more options? well, we are eager to implement more in the future. tell us what you think would be a usefull option, we are open for feedback as always :)

drop us a message under `options → feedback` or [hi@slidenotes.io](mailto:hi@slidenotes.io)

---
## thats it!

thank you for using this tutorial. we hope it helped you. 

also special thanks to gion kunz and all the contributers to the project [chartistjs](http://gionkunz.github.io/chartist-js/index.html) which delivers the magic of the graph. 

