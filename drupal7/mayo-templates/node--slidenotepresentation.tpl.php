<?php

/**
 * @file
 * Default theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined, e.g. $node->body becomes $body. When needing to access
 * a field's raw values, developers/themers are strongly encouraged to use these
 * variables. Otherwise they will have to explicitly specify the desired field
 * language, e.g. $node->body['en'], thus overriding any language negotiation
 * rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 */
?>
<style>
.ppage{
  display:none;
}
.ppage.active{
  display:block;
}

#controlarea{
  position:fixed;
  width:100%;
  left:0;
  bottom:0;
  background:black;
}
.controlbutton{
  background:black;
  border: 1px solid;
  color:rgb(50,50,50);
  padding: 5px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.controlbutton:hover{
  background:rgb(50,50,50);
}
#controlarea:hover .controlbutton{
  color:white;
}

#slidenotepresentation > div {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}

#comments {
    position: fixed;
    top: 0;
    right: 0;
    display: none;
}

#comments.show {
    display: block;
}

.comment{
	display:none;
}
.comment.show{
	display:block;
}

div#edit-author--2 {
    display: none;
}

fieldset#edit-comment-body-und-0-format {
    display: none;
}

div#edit-field-pagenr {
    display: none;
}

input#edit-preview, input#edit-submit {
    display: none;
}

.comment-form{
	display:none;
}
.comment-form.show{
	display:block;
}

</style>
<script language="javascript" src="/sites/all/libraries/slidenotes/slidenotes.js"></script>
<script language="javascript">
var slidenoteguardian = {
	actthemesstring: "extraoptions;hiddenobjects;blocks;stickytitles;azul;redalert;tufte;prototyp;highlight;transition;chartist;table;imgtourl;klatex;switchparseelements;sections;",	
	ivlength: 12,
	decText: null,
	crypto: window.crypto,
    options:'<?php print($field_optionstring[0]["value"]);?>',
	iv:null,
	encBufferString : "<?php print($field_encryptednote[0]['value']);?>",
	notetitle: "<?php print($title);?>"			
}

slidenoteguardian.extensionoptions = {
	basicThemes: [
		{name:"hiddenobjects"},
		{name:"blocks"},
		{name:"stickytitles", css:true},
		{name:"azul"},
		{name:"redalert"},
		{name:"luminoso"},
//		{name:"prototyp"},
		{name:"highlight"},
		{name:"transition"},
		{name:"chartist"},
		{name:"table", css:true},
		{name:"imgtourl"},
		{name:"klatex", css:true},
		{name:"switchparseelements", css:true},
		{name:"sections"}
	]
}

var slidenote;

slidenoteguardian.init = function(){
	this.decryptPresentation();
};
slidenoteguardian.autoSaveToLocal = function(){};

slidenoteguardian.loadConfigString = function(){
	//disable texteditor:
	slidenote.texteditorerroractivated=false;
	//load Themes-Config:
    var saveobject;
  try {
  saveobject = JSON.parse(this.options);
  }catch{
  //load old config style? naa, just delete it...
    console.log("old config found");
//    this.loadConfigOld(destination);
    return;
  }

  //activate and disable Themes depending on config:
  for(var x=0;x<slidenote.extensions.themes.length;x++){
      var act=slidenote.extensions.themes[x];
      if(saveobject.activethemes.indexOf(act.classname)>-1){
          act.changeThemeStatus(true);
      }else{
          act.changeThemeStatus(false);
      }
  }
  
  //load themes-config:
  for(var x=0;x<saveobject.themeConfigs.length;x++){
      var theme = slidenote.extensions.getThemeByName(saveobject.activethemes[x]);
      theme.loadConfigString(saveobject.themeConfigs[x]);
  }
    /*
  var savedConfigString = this.options;
  var savedThemeString = savedConfigString.substring(0,savedConfigString.indexOf("$$"));
  var themes = new Array();
  for(var x=0;x<slidenote.extensions.themes.length;x++){
    var act = slidenote.extensions.themes[x];
    if(this.actthemesstring.indexOf(act.classname)>=0 && savedThemeString.indexOf(act.classname)>=0){
      slidenote.extensions.changeThemeStatus(x,true);
      themes.push(act);
    }else{
      slidenote.extensions.changeThemeStatus(x,false);
    }
  }


  var savedConfigStrings = new Array();
  for(var x=0;x<themes.length;x++){
  	var pos = savedConfigString.indexOf("{["+themes[x].classname+"]}");
  	if(pos>=0)savedConfigStrings.push({name:themes[x].classname, position:pos, dataposition:pos+4+themes[x].classname.length,theme:themes[x]});
  }
  //console.log()
  savedConfigStrings.sort(function(a,b){return a.position-b.position});
  for(var x=0;x<savedConfigStrings.length-1;x++){
  	savedConfigStrings[x].data = savedConfigString.substring(savedConfigStrings[x].dataposition, savedConfigStrings[x+1].position);
  }
  if(savedConfigStrings.length>0)
        savedConfigStrings[savedConfigStrings.length-1].data = savedConfigString.substring(savedConfigStrings[savedConfigStrings.length-1].dataposition);
  console.log(savedConfigStrings);
  for(var x=0;x<savedConfigStrings.length;x++){
    savedConfigStrings[x].theme.loadConfigString(savedConfigStrings[x].data);
  }*/
}

slidenoteguardian.decryptPresentation = async function(){
	    //getting iv of string:
    let iv = new Uint8Array(this.ivlength); //create empty ivarray
    for(let i=0;i<this.ivlength;i++)iv[i]=this.encBufferString.charCodeAt(i)-255;
    this.iv = iv;
    this.encBufferString = this.encBufferString.substring(this.ivlength);//delete iv-chars from string
    let buffer = new Uint8Array(this.encBufferString.length);
    for(let i=0;i<this.encBufferString.length;i++)buffer[i]=this.encBufferString.charCodeAt(i)-255;
    //this.encTextBuffer = buffer.buffer; //changing to ArrayBuffer -- TODO:kann weg oder?
    this.decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
	while(this.decText==="decryption has failed" && confirm("decryption failed. wrong password. Retry?")){
		this.password=null;
		this.decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
	}
	//document.getElementById("slidenotepresentation").innerHTML = this.decText;
	var imgblockpos = this.decText.indexOf("§§§€€€€€IMAGEBLOCK€€€€€§§§");
	this.imageblockstring = this.decText.substring(imgblockpos+26);
	this.decText = this.decText.substring(0,imgblockpos);
	var texted = {value:this.decText, selectionEnd:0, selectionStart:0, focus:function(){}, imageblockstring:this.imageblockstring}; //emulate textarea 
	var textedlayer = document.createElement("div");
	textedlayer.id = "texteditorbuttons";
	document.getElementsByTagName("body")[0].appendChild(textedlayer);
	var slideshow = document.getElementById("slidenotepresentation");
	slidenote = new slidenotes(texted, textedlayer, textedlayer, slideshow, "/sites/all/libraries/slidenotes/");
	//slidenote.basepath = "/sites/all/libraries/slidenotes/";
	//this.loadConfigString();
	//slidenote.parseneu();
	slidenote.appendFile("css","../layout.css");
	slidenote.extensions.addAfterLoadingThemesHook(function(){
		slidenote.base64images.loadImageString(slidenote.textarea.imageblockstring);
		slidenoteguardian.loadConfigString();
		slidenote.parseneu();
		slidenote.presentation.showpresentation();
		slidenoteplayer.init();
	});
	//slidenote.presentation.showpresentation();
	//setTimeout("slidenoteplayer.init()",100);
	/*var cssfile = document.createElement("link");
		cssfile.setAttribute("rel", "stylesheet");
		cssfile.setAttribute("type", "text/css");
		cssfile.setAttribute("href", "/sites/all/libraries/slidenotes/themes/katex/katex.min.css");
		document.getElementsByTagName("head")[0].appendChild(cssfile);*/
}

slidenoteguardian.decryptText = async function(text){
    var encBufferString = text;
	    //getting iv of string:
    let iv = new Uint8Array(this.ivlength); //create empty ivarray
    for(let i=0;i<this.ivlength;i++)iv[i]=encBufferString.charCodeAt(i)-255;
    this.iv = iv;
    encBufferString = encBufferString.substring(this.ivlength);//delete iv-chars from string
    let buffer = new Uint8Array(encBufferString.length);
    for(let i=0;i<encBufferString.length;i++)buffer[i]=encBufferString.charCodeAt(i)-255;
    //this.encTextBuffer = buffer.buffer; //changing to ArrayBuffer -- TODO:kann weg oder?
    var decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
	//while(decText==="decryption has failed" && confirm("decryption failed. wrong password. Retry?")){
		//decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
	//}
	//document.getElementById("slidenotepresentation").innerHTML = this.decText;
    return decText;
}

slidenoteguardian.decrypt = async function(buffer, iv){
  let pwtext = "please type in password of presentation";
  if(this.password===undefined||this.password===null)this.password = await this.passwordPrompt(pwtext, "decrypt");
  let keyguardian = await this.createKey(iv);
  console.log("decoding starts");
  try{
    this.plainTextBuffer = await this.crypto.subtle.decrypt(keyguardian.alg, keyguardian.key, buffer);
  } catch(e){
    console.log(e);
    console.log("decryption has failed!");
    //this.password = null; //reset password as it has no meaning
    return "decryption has failed";
  }
  console.log("decoding has ended");
  return new TextDecoder().decode(this.plainTextBuffer); //TODO: error-handling
}

slidenoteguardian.encryptComment = async function(){
   var bodyfield = document.getElementById("edit-comment-body-und-0-value");
   var plaintext = bodyfield.value;
   var encresult = await this.encrypt(plaintext);
   if(encresult.iv===null||encresult.encbuffer===null)return false;
   var enctext = this.encBufferToString(encresult);
   bodyfield.value = enctext;
   document.getElementById("edit-submit").click();
   return true;	   
}

slidenoteguardian.encBufferToString = function(encResult){
  let encTextBuffer = encResult.encbuffer;
  let iv = encResult.iv;
  //getting only displayable chars without control-chars:
  let utf8array = new Uint8Array(encTextBuffer); //changing into utf8-Array
  //console.log(utf8array);
  let utf8string = ""; //starting new string for utf8
  for(let i =0; i<utf8array.length;i++){
    utf8string+=String.fromCharCode(utf8array[i]+255); //fill string with save values
  }
  //converting iv to string with same method:
  let ivstring="";
  for(let i=0; i<iv.length;i++)ivstring+=String.fromCharCode(iv[i]+255);
  return ivstring+utf8string;//save iv in front of code
}


slidenoteguardian.encrypt = async function(plaintext){
  console.log("encrypt plaintext:"+plaintext.substring(0,20));
    let plainTextUtf8 = new TextEncoder().encode(plaintext); //changing into UTF-8-Array
    let keyguardian = await this.createKey();
    if(keyguardian==null)return {encbuffer:null, iv:null};
    //this.iv = keyguardian.iv;
    let encbuffer = await crypto.subtle.encrypt(keyguardian.alg, keyguardian.key, plainTextUtf8);
    return {encbuffer: encbuffer, iv:keyguardian.iv};
    /*the job of encrypt is done - rest of code should be in save*/
}

slidenoteguardian.createKey = async function(iv, passw){
  console.log("creating Key with iv"+iv);
  let password = passw;
  if(this.password ==null && passw==null)return;
  if(passw==null)password = this.password;
  let pwUtf8 = new TextEncoder().encode(password);
  let passwordHash = await this.crypto.subtle.digest('SHA-256', pwUtf8);
  if(passw==null) this.passwordHash = passwordHash;
  let keyguardian = {};
  if(iv==null){
    keyguardian.iv = crypto.getRandomValues(new Uint8Array(this.ivlength));
  }else{
    keyguardian.iv = iv;
  }
  keyguardian.alg = { name: 'AES-GCM', iv: keyguardian.iv };
  keyguardian.key = await crypto.subtle.importKey('raw', passwordHash, keyguardian.alg, false, ['encrypt', 'decrypt']);
  console.log("key created");
  return keyguardian;
}

slidenoteguardian.passwordPrompt = function (text, method, newpassword){
  /*creates a password-prompt*/
  if(document.getElementById("slidenoteGuardianPasswortPrompt")!=null){
    console.log("second password-prompt");
    return null;
  }
  if(this.password!=null && method==="decrypt" && !newpassword){
    console.log("password allready set");
    return this.password;
  }

	var pwprompt = document.createElement("div"); //the prompt-container
	pwprompt.id= "slidenoteGuardianPasswortPrompt"; //id for css
  var pwpromptbox = document.getElementById("slidenoteGuardianPasswordPromptTemplate");
  if(pwpromptbox===null){
    console.log("no password template found"+pwpromptbox);
    pwpromptbox = document.createElement("div"); //inner promptbox
  	var pwtext = document.createElement("div"); //text to be displayed inside box
  	pwtext.innerHTML = text;
  	pwpromptbox.appendChild(pwtext);
    //password-box and retype-password-box
    var pwform = document.createElement("form");
    var emailfield = document.createElement("input");
    emailfield.id="email";
    emailfield.type="email";
    emailfield.value= this.slidenotetitle+"@slidenotes.io";
    //emailfield.style.display="none";
    //emailfield.style.height="1px";
    emailfield.autocomplete="username";
    pwform.appendChild(emailfield);
    var pwlabel = document.createElement("label");
    pwlabel.innerText="PASSWORD";
    pwform.appendChild(pwlabel);
  	var pwinput = document.createElement("input"); //password-box
  	pwinput.type="password";
    pwinput.id="password";
    pwinput.autocomplete="current-password";
  	pwform.appendChild(pwinput);
    pwpromptbox.appendChild(pwform);
    var pwchecklabel = document.createElement("label");
    pwchecklabel.innerText="RE-TYPE PASSWORD";
    pwpromptbox.appendChild(pwchecklabel);
    pwcheck = document.createElement("input");
    pwcheck.type="password";
    pwcheck.id="pwcheckfield";
    pwpromptbox.appendChild(pwcheck);

    //buttons
  	var pwokbutton = document.createElement("button");
  	pwokbutton.innerHTML = "ENCRYPT";
  	var pwcancelb = document.createElement("button");
  	pwcancelb.innerHTML = "cancel";
  	pwpromptbox.appendChild(pwcancelb);
  	pwpromptbox.appendChild(pwokbutton);

    var pwpromptaftertext = document.createElement("div");
    pwpromptaftertext.innerText = "we recommend using a password manager to keep up with the task of choosing and remembering safe passwords on the web.";
    pwpromptbox.appendChild(pwpromptaftertext);
  }else{
    console.log("template found: using template to comply with password-manager");
    var usernamefield = document.getElementById("username");
    var usernamelabel = document.getElementById("slidenoteGuardianPasswordPromptUsernameLabel");
    var pwinput = document.getElementById("password");
    var pwcheck = document.getElementById("pwcheckfield");
    var pwchecklabel = document.getElementById("slidenoteGuardianPasswordPromptRetypeLabel");
    var pwtext = document.getElementById("slidenoteGuardianPasswordPromptTemplatePreText");
    var pwokbutton = document.getElementById("slidenoteGuardianPasswordPromptEncrypt");
    var pwnotetitle = document.getElementById("slidenoteGuardianPasswordPromptNotetitle");
    pwtext.innerText = text;
    if(this.notetitle==="undefined")this.notetitle=this.localstorage.getItem("title");
    pwinput.value="";
    usernamefield.value = this.notetitle; //+"@slidenotes.io";
    if(pwnotetitle!=null)pwnotetitle.innerText = "Decrypting Slidenote \""+this.notetitle+"\"";
  }
  if(method==="decrypt"){
    pwokbutton.innerText="DECRYPT";
    pwchecklabel.style.display="none";
    pwcheck.style.display="none";
    pwcheck.value="";
    usernamefield.classList.add("hidden");
    usernamelabel.classList.add("hidden");
  }else if(method==="export") {
    pwokbutton.innerText="ENCRYPT";
    usernamefield.value=this.notetitle+".slidenote";
    usernamefield.classList.remove("hidden");
    usernamelabel.classList.remove("hidden");
    pwchecklabel.style.display="block";
    pwcheck.style.display="block";
  }else if(method==="exportCMS"){
    pwokbutton.innerText="ENCRYPT";
    usernamefield.value=this.notetitle;
    usernamefield.classList.remove("hidden");
    usernamelabel.classList.remove("hidden");
    pwchecklabel.style.display="block";
    pwcheck.style.display="block";
  }else {
    usernamefield.classList.add("hidden");
    usernamelabel.classList.add("hidden");
    pwokbutton.innerText="ENCRYPT";
    pwchecklabel.style.display="block";
    pwcheck.style.display="block";
    pwnotetitle.innerText="Set Password for Slidenote";
  }
  pwprompt.appendChild(pwpromptbox);
	document.body.appendChild(pwprompt); //make promptbox visible
	pwinput.focus(); //focus on pwbox to get direct input
  setTimeout("document.getElementById('password').focus()",500); //not the most elegant, but direct focus does not work sometimes - dont know why

	return new Promise(function(resolve, reject) {
	    pwprompt.addEventListener('click', function handleButtonClicks(e) {
	      if (e.target.tagName !== 'BUTTON') { return; }
	      pwprompt.removeEventListener('click', handleButtonClicks); //removes eventhandler on cancel or ok
	      if (e.target === pwokbutton) {
          if(pwinput.value===pwcheck.value||(pwcheck.style.display==="none" && pwcheck.value.length===0))resolve(pwinput.value); //return password
          else {
            return;
            //reject(new Error('Wrong retype'));
          }
	      } else {
	        reject(new Error('User canceled')); //return error
	      }
        document.getElementById("slidenoteGuardianPasswordPromptStore").appendChild(pwpromptbox);
		    document.body.removeChild(pwprompt); //let prompt disapear
	    });
    var handleenter= function handleEnter(e){
      if(pwinput.value===pwcheck.value){
        pwcheck.style.backgroundColor="green";
      }else{
        if(pwcheck.value.length>0 || pwcheck.style.display!="none")pwcheck.style.backgroundColor="red";else pwcheck.style.backgroundColor="white";
      }
  			if(e.keyCode == 13){
          if(pwinput.value===pwcheck.value||(pwcheck.value.length===0 && pwcheck.style.display==="none"))resolve(pwinput.value);
            else {
              return;
            //  alert("password and retype of password differs - please try again");
            //reject(new Error("Wrong retype"));
            }
          document.getElementById("slidenoteGuardianPasswordPromptStore").appendChild(pwpromptbox);
          if(pwprompt.parentElement === document.body)document.body.removeChild(pwprompt);
  			}else if(e.keyCode==27){
          document.getElementById("slidenoteGuardianPasswordPromptStore").appendChild(pwpromptbox);
  				document.body.removeChild(pwprompt);
  				reject(new Error("User cancelled"));
  			}
  		}
		pwinput.addEventListener('keyup',handleenter);
    pwcheck.addEventListener('keyup',handleenter);
	});
}


</script>
<script language="javascript" src="/sites/all/libraries/slidenotes/slidenoteplayer.js"></script>
<div id="slidenoteLoadingScreen"><h1>Please wait, loading missing libraries</h1><img src="/sites/all/libraries/slidenotes/images/wait-charlie-chaplin.gif"></div>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <div class="content"<?php print $content_attributes; ?>>
   <div id="slidenotediv">
	<div id="slidenotepresentation">
	<!-- insert slidenote here:-->
	<!--end of inserted slidenote-->
	</div>
	<div id="controlarea">
		<button class="controlbutton">backward</button>
		<button class="controlbutton">forward</button>
		<button class="controlbutton">start of slideshow</button>
		<button class="controlbutton">end of slideshow</button>
		<select id="controlgotobutton" class="controlbutton"></select>
		<span class="controlbutton"><span id="controlpagenumber"></span> / <span id="controlpagenumbertotal"></span></span>
		<button class="controlbutton" id="controlcomment"><img src="/sites/all/libraries/slidenotes/images/buttons/presentationcomment.png"><span id="controlcommentcount"></span>/<span id="controlcommenttotal"></span></button>
		
	</div>

	</div>
  </div>

  
</div>
<div id="slidenoteGuardianPasswordPromptStore">
<div id="slidenoteGuardianPasswordPromptTemplate">
	<div id="slidenoteGuardianPasswordPromptNotetitle">TITLE</div>
	<div id="slidenoteGuardianPasswordPromptTemplatePreText"></div>
	<form onsubmit="event.preventDefault();" action="#" method="POST">
		<label id="slidenoteGuardianPasswordPromptUsernameLabel">FILENAME FOR EXPORT</label>
		<input type="text" id="username">
		<label>PASSWORD</label>
		<input type="password" id="password">
		<label id="slidenoteGuardianPasswordPromptRetypeLabel">RE-TYPE PASSWORD</label>
		<input type="password" id="pwcheckfield">
		<button type="submit" id="slidenoteGuardianPasswordPromptEncrypt">ENCRYPT</button>
		<div id="slidenoteGuardianPasswortPromptAfterText">we recommend using a password manager to keep up with the task of choosing and remembering safe passwords on the web.</div>
	</form>

</div>
</div>
<img src="/sites/all/libraries/slidenotes/images/buttons/bold.png" width="1" onload="slidenoteguardian.init()">
<?php print render($content['comments']); ?> <!-- added -->

