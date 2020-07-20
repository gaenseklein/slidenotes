# image tutorial

welcome to the image-tutorial!

this tutorial explains how to implement and use images in slidenotes.io. 

to begin the presentation press `ctrl+escape` or the `play button`
---
## images in slidenotes - the image-tag

using images in presentations is quite common nowadays. although slidenotes are not meant to be heavily image based (sincerely there are better aproaches to that kind of presentations) it is of course possible and easy to use images in slidenotes. 

images are represented in the slidenote-code with the image-tag you know from markdown: 

+++code
![imagedescription / alt-text](imagename)
+++

the text inside the square brackets "[]" will be interpreted as the imagedescription or alt-text, which will be displayed on devices where its not possible to show the actual image itself - such as screenreaders or terminal-browsers. 

the imagename in the brackets "()" is the name of the image you want to use. this can, but is not necessary the same as the filename of the image you choose to use. in fact, it is up to you how you call your image. we will come back to that later. for now, lets continue with how we can implement your imagefiles to have something to work with:
---
## attaching an imagefile to a slidenote

while in the code all images are represented by image-tags, the actual image-file must be attached to the slidenote-document. in the process of attaching the image to the slidenote it will have the same encription as you are used to, making handling images in slidenotes a secure and easy to use method to share documents even with images inside. 

all attached image-files to a slidenote are stored together with the slidenote. in the image gallery you can get an overview over the image-files attached to the slidenote-document and if or where in the document it is used. 

to attach a image-file to a document you have not one, but two ways:
 
+++layout:inline
## the image-selection-dialog
1. whenever you write a new image-tag inside the note with an image-name not yet used, the selection dialog of the image-gallery will open up. there you can "add image" to the image-gallery to attach a new image-file to the image-gallery and use it directly in the new image-tag
2. inserting an image-tag via the toolbar-buttons also opens the image-selection-dialog from the image-gallery. you can either choose a yet attached image or attach a new image-file to the image-gallery
3. open the image-selection-dialog via the context-menu while the cursor is inside the image-tag you want to apply the image-file to

## the image-gallery 
opening the image-gallery and attach a new image-file there. in contrast to the attaching via image-selection-dialog, this only attaches the image-file to the image-gallery - without using it yet. the newly attached image-file can later on be selected by connecting it to a imagename via the image-selection-dialog. 

+++



---
## imagenames and image-gallery

as slidenotes is a solely text-based aproach to write presentations, images can not directly be displayed and used inside the code of the presentation - as it is not text and cannot be altered as such. therefore we have the concept of the image-tags in the code to define where and how an image should be used and the image-gallery as the container, where all the actual image-files are stored. 

to connect both, we make use of the image-names. this makes it convenient to re-use images in the document and replace them in one go if you decide to do so. you could for example use the tag `![](my example image)` on several diferent slides in the document. if you changed your mind later on, you can replace the image the name uses by opening the image-selection dialog and selecting (or uploading) another image. to open up the image-selection dialog for an image-tag you can simply go with your cursor inside the image-tag you want to alter and click either in the toolbar on the button for image or open up the context-menu and press the button for image-selection there. 

---
![](background)
## images as background

images will be displayed as background-images of a slide or layout-block, whenever they are declared in the first line of the slide or block:

+++code
---
![](first background)

## my first slide with backgroundimage

---
![](second background)

## this slide has another backgroundimage

---
![](first background)

## this slide uses the same image as background as the first slide 

---
## slide with a layoutblock filled with background:

 +++layout:left
![](background-left)

some text on the left side of the slide above the background-image named "background-left"
 +++

the text used on the right side of the slide, as following the layout-declaration

+++

---
![](first background)

## time to play

change the background-image of this slide and the following slides. [if you want to skip this part click here](#slide10)

---
![](second background)

## this slide has another backgroundimage

as you can see it has yet no image-file connected to its tag. therefore its displayed in red inside the editor. 

---
![](first background)

## this slide uses the same image as background as the first slide 

if you change the imagefile connected with the name "first background" via the image-selection-dialog it will have effect here and everywhere the same name is used in imagetags. 

---
## slide with a layoutblock filled with background:

+++layout:left
![](background-left)

some text on the left side of the slide above the background-image named "background-left"
+++

the text used on the right side of the slide, as following the layout-declaration
---
## positioning the images

with the background-image-definition you have mastered the first of the declarations how you can position the images inside the presentation: 
the slidenote-editor makes use of how you position the image-tag inside your code. we use this concept to make it as easy to use as possible, without ever touching your mouse or defining complicated syntax-driven positioning of the image. you just write it down and the slidenoteeditor will take care of all the rest. 
therefore we have some simple and logical ways of how you can define the positioning of images:

###definitions of image-positioning
1. images inside the line of a title are positioned inside the title - on the left if they are the first element, on the right if they are the last element. they will be displayed in the height of the corresponding title, keeping its aspect-ratio. you can use this for example for a logo inside the title of a slidenote. 
2. images at the begining of a block of text will be interpreted as that they are on the left side, the following text will float around the image. 
3. images at the end of a block of text will be interpreted as that they are on the right side of the textblock and the text will float around the image
4. images inside a textblock will be displayed as icons inside the text, calculated by the height of the line of text.  
5. images, which are the sole content of the slide, but not in the first line of the slide, will be displayed as big as possible, centered on the slide

---
## imagedescriptions and image-subtitles

images can have descriptions or alt-text, which will be displayed whenever or wherever the browser dont want to display the image. the most known example is a screenreader, which reads this text to the user instead of displaying an image. but also some other browsers, for example in phones, have disabled images by default. giving your image an alt-text is a good way to keep your content more accessible and is highly recommended. the alt-text is **not bound to the image-name**. you can use different alt-texts in several image-tags if you want to. 

also you can give your images some subtitles: 
if a image-tag is the sole element of a line and in the following line comes a line with text, the text is used as subtitle and will be displayed directly under the image: 
+++layout:inline

![image of a dog](example)
this is lapa, a friendly dog

+++code
---
## a slide to demonstrate images with subtitles

![an example image](example)
subtitle to the image

some more text, following, disconnected with the image
+++

+++

---
## quality of images

as all images are directly attached to the document, the size of the image-files used in the document reflect directly the size of the document in general. as they are encripted, the size even blows higher than what is used in your filesystem directly. 
therefore it is good practice to think about the quality you use when attaching a image-file to the slidenote by loading it in the image-gallery. 

the best ratio between quality and image can be reached by resizing your image with an image-editing application like gimp or photoshop. but this can be rather bothersome and most of all time consuming. we therefore builded inside the posibility to choose the quality in the process of adding the image to the image-gallery. you can choose between three different options (small, medium and large) and the slidenoteeditor will take care of resizing the image to the desired quality. keep in mind that in this process the image will be changed to a .png-image. if you want to add a .gif-animation the animation would not be used at all. 
therefore - or if you have used another image-manipulation-application for resizing your image to the desired size - you should use the option "original". 

---
## that's it

congratulations! 
you have mastered the use of images in slidenotes. wasn't that hard, was it? 
feel free to experiment more inside the tutorial or [go back to the editor](/editor) and work within your slidenote

something still bothering you? 
please write us your feedback so we can improve the tutorials and the slidenoteeditor for you.

