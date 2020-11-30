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
 *   The following are controled through the node publishing options.
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
<script language="javascript" src="/sites/all/libraries/slidenotes/slidenotes.js"></script>
<script language="javascript">
var slidenoteguardian = {
	actthemesstring: "extraoptions;hiddenobjects;blocks;progressbar;stickytitles;azul;redalert;tufte;prototyp;highlight;transition;chartist;table;imgtourl;klatex;switchparseelements;sections;",
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
        {name:"progressbar"},
		{name:"stickytitles", css:true},
		{name:"highlight"},
		{name:"transition"},
		{name:"chartist"},
		{name:"table", css:true},
		{name:"imgtourl"},
		{name:"klatex", css:true},
		{name:"switchparseelements", css:true},
		{name:"sections"},
		//css-themes:
		{name:"minimalist"},
		{name:"dark"},
		{name:"colorful"},
		//		{name:"prototyp"},
	]
}

var slidenote;

slidenoteguardian.init = function(){
	var texted = {value:"", selectionEnd:0, selectionStart:0, focus:function(){}}; //emulate textarea
    var textedlayer = document.createElement("div");
    //textedlayer.id="texteditorbuttons"; //avoid failure of loading themes by simply adding buttons there
    textedlayer.style.display = "none";
    document.body.appendChild(textedlayer);
    var slideshow = document.getElementById("slidenotepresentation");
    slidenote = new slidenotes(texted,textedlayer,textedlayer,slideshow,"/sites/all/libraries/slidenotes/");
    var loadscreen = document.getElementById("slidenoteloadingscreenwrapper");
    loadscreen.classList.add("midstate");
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
    if(this.decText==="decryption has failed")return;
    //decryption was successfull

	var imgblockpos = this.decText.indexOf("§§§€€€€€IMAGEBLOCK€€€€€§§§");
	this.imageblockstring = this.decText.substring(imgblockpos+26);
	this.decText = this.decText.substring(0,imgblockpos);
    slidenote.textarea.value = this.decText;
	slidenote.extensions.addAfterLoadingThemesHook(function(){
		slidenote.base64images.loadImageString(slidenoteguardian.imageblockstring);
		slidenoteguardian.loadConfigString();
		slidenote.parseneu();
		slidenote.presentation.showpresentation();
		slidenoteplayer.init();
        //loadingscreen:
        let loadingscreen = document.getElementById("slidenoteloadingscreenwrapper");
        loadingscreen.classList.remove("midstate");
        loadingscreen.classList.add("endstate");
	});
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
    if(pwnotetitle!=null)pwnotetitle.innerText = "decrypting slidenote \""+this.notetitle+"\"";
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

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <div class="content"<?php print $content_attributes; ?>>
   <div id="slidenotediv">
	<div id="slidenotepresentation">
	<!-- insert slidenote here:-->
	<!--end of inserted slidenote-->
	</div>
	<div id="controlarea">
<!-- new interface:-->
<!-- presentation-interface -->
        <!-- ====================== -->

        <!-- horizontal interface -->
        <!-- -------------------- -->

        <!-- interface close -->
        <svg id="controlarea_close" viewBox="0 0 328 58">

          <!-- blob in -->
          <path d="M276.207,7.181c-7.735,2.324 -10.836,5.393 -10.686,12.849c0.168,8.379 9.677,15.253 18.084,13.723c8.407,-1.531 10.676,-7.431 9.175,-15.677c-1.501,-8.246 -8.389,-13.353 -16.573,-10.895Z" style="fill:url(#_Radial1);">
            <animate class="animateToClose" id="animate-to-close_blob1" begin="indefinite" dur="0.2s" attributeName="d"
              values="
              M276.207,7.181c-7.735,2.324 -10.836,5.393 -10.686,12.849c0.168,8.379 9.677,15.253 18.084,13.723c8.407,-1.531 10.676,-7.431 9.175,-15.677c-1.501,-8.246 -8.389,-13.353 -16.573,-10.895Z;

              M15.49,32.081c-7.708,-0.305 -12.404,0.058 -19.537,2.234c-10.649,3.249 -11.326,3.941 1.678,0.814c6.568,-1.58 10.982,-1.09 17.703,-1.68c4.814,-0.423 5.392,-1.161 0.156,-1.368Z;

              M15.49,32.081c-7.708,-0.305 -12.404,0.058 -19.537,2.234c-10.649,3.249 -11.326,3.941 1.678,0.814c6.568,-1.58 10.982,-1.09 17.703,-1.68c4.814,-0.423 5.392,-1.161 0.156,-1.368Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <!-- main -->
          <path d="M120.982,20.035c67.135,0 100.596,-23.723 161.8,23.949c17.027,13.262 27.856,11.43 45.064,14.04l-327.846,0l0,-34.31c18.38,-20.989 90.749,-3.679 120.982,-3.679Z" fill-rule="nonzero" style="fill:#1E1E1E; cursor: pointer;" filter="url(#presentation-interface_glow)">
            <animate class="animateToClose" id="animate-to-close" begin="indefinite" dur="0.4s" attributeName="d"
              values="
              M120.982,20.035c67.135,0 100.596,-23.723 161.8,23.949c17.027,13.262 27.856,11.43 45.064,14.04l-327.846,0l0,-34.31c18.38,-20.989 90.749,-3.679 120.982,-3.679Z;

              M24.34,11.438c12.485,5.274 15.458,13.78 14.946,29.369c-0.221,6.757 -1.714,13.066 -6.827,17.217l-32.459,0l0,-53.064c9.116,2.823 17.699,3.672 24.34,6.478Z;

              M28.784,4.983c15.258,3.236 32.522,11.306 31.712,35.973c-0.222,6.757 -1.714,12.397 -4.242,17.068l-56.254,0l0,-58.024c9.116,2.823 21.731,3.487 28.784,4.983Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
            <animate class="animateToClose" id="animate-to-close_color" begin="indefinite" dur="0.4s" fill="freeze" attributeName="fill" to="#BEBEBE">
            </animate>
          </path>

          <!-- shine -->
          <path d="M27.356,7.673c8.268,2.003 14.639,5.508 12.618,9.193c-2.211,4.032 -9.559,3.806 -17.827,1.802c-8.267,-2.003 -15.287,-4.731 -14.204,-9.2c1.083,-4.468 11.146,-3.799 19.413,-1.795Z" style="fill:#fff;fill-opacity:0.16; pointer-events: none;">
            <animate class="animateToClose" id="animate-to-close_shine1" begin="indefinite" dur="0.4s" attributeName="d"
              values="
              M231.94,21.437c8.267,2.003 14.638,5.508 12.617,9.194c-2.21,4.031 -9.559,3.805 -17.826,1.802c-8.267,-2.004 -15.287,-4.732 -14.204,-9.2c1.082,-4.469 11.146,-3.799 19.413,-1.796Z;

              M27.498,15.127c7.123,4.651 8.623,9.062 5.487,11.86c-3.431,3.061 -3.251,-0.281 -10.373,-4.932c-7.123,-4.651 -8.529,-5.497 -7.229,-7.489c1.301,-1.992 4.992,-4.091 12.115,0.561Z;

              M27.356,7.673c8.268,2.003 14.639,5.508 12.618,9.193c-2.211,4.032 -9.559,3.806 -17.827,1.802c-8.267,-2.003 -15.287,-4.731 -14.204,-9.2c1.083,-4.468 11.146,-3.799 19.413,-1.795Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <path d="M259.491,34.269c2.022,1.39 3.529,4.566 1.825,6.952c-1.705,2.386 -4.536,1.448 -6.642,0.019c-3.893,-2.643 -3.164,-4.725 -2.227,-6.125c1.63,-2.437 4.529,-2.575 7.044,-0.846Z" style="fill:#fff;fill-opacity:0.24; pointer-events: none;">
            <animate class="animateToClose" id="animate-to-close_shine2" begin="indefinite" dur="0.4s" attributeName="d"
              values="
              M259.491,34.269c2.022,1.39 3.529,4.566 1.825,6.952c-1.705,2.386 -4.536,1.448 -6.642,0.019c-3.893,-2.643 -3.164,-4.725 -2.227,-6.125c1.63,-2.437 4.529,-2.575 7.044,-0.846Z;

              M37.47,33.14c0.36,1.373 -0.327,3.366 -2.219,3.821c-1.893,0.455 -2.848,-1.01 -3.231,-2.432c-0.709,-2.627 0.575,-3.303 1.654,-3.593c1.88,-0.506 3.348,0.496 3.796,2.204Z;

              M54.314,22.478c1.565,1.891 2.146,5.358 -0.147,7.186c-2.292,1.829 -4.758,0.152 -6.393,-1.799c-3.021,-3.607 -1.75,-5.41 -0.466,-6.5c2.235,-1.899 5.06,-1.238 7.006,1.113Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>
        </svg>

        <!-- interface open -->
        <svg id="controlarea_open" viewBox="0 0 328 58">

          <!-- blob out -->
          <path d="M5.215,53.811c-8.07,-0.32 -12.504,4.93 -6.926,9.88c5.583,4.955 14.703,11.637 19.271,11.999c8.519,0.674 9.376,-5.314 5.161,-12.558c-3.282,-5.642 -10.745,-9.053 -17.506,-9.321Z" style="fill:url(#_Radial1); cursor: pointer;" filter="url(#presentation-interface_glow)">
            <animate class="animateToOpen" id="animate-to-open_blob1" begin="0s" dur="0.42s" attributeName="d"
              values="
              M5.215,53.811c-8.07,-0.32 -12.504,4.93 -6.926,9.88c5.583,4.955 14.703,11.637 19.271,11.999c8.519,0.674 9.376,-5.314 5.161,-12.558c-3.282,-5.642 -10.745,-9.053 -17.506,-9.321Z;

              M269.869,9.776c-12.938,3.491 -13.37,14.602 0.202,14.397c6.109,-0.092 14.428,1.541 18.574,3.494c11.382,5.362 13.123,-5.265 3.207,-13.727c-4.965,-4.237 -15.317,-5.963 -21.983,-4.164Z;

              M276.207,7.181c-7.735,2.324 -10.836,5.393 -10.686,12.849c0.168,8.379 9.677,15.253 18.084,13.723c8.407,-1.531 10.676,-7.431 9.175,-15.677c-1.501,-8.246 -8.389,-13.353 -16.573,-10.895Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <path d="M287.252,11.774c1.754,2.12 2.405,6.007 -0.165,8.057c-2.571,2.051 -5.335,0.171 -7.168,-2.017c-3.387,-4.044 -1.962,-6.066 -0.523,-7.288c2.506,-2.129 5.674,-1.388 7.856,1.248Z" style="fill:#fff;fill-opacity:0.08;pointer-events: none;">
            <animate class="animateToOpen" id="animate-to-open_blob1-shine" begin="0s" dur="0.42s" attributeName="d"
              values="
              M12.049,58.232c2.583,0.948 9.326,5.269 8.138,8.335c-1.188,3.066 -7.423,-2.295 -10.107,-3.262c-4.964,-1.788 -11.622,-2.021 -10.994,-3.802c1.092,-3.101 9.75,-2.45 12.963,-1.271Z;

              M285.729,11.992c2.583,0.947 9.326,5.269 8.138,8.335c-1.188,3.066 -7.422,-2.295 -10.107,-3.262c-4.963,-1.788 -11.622,-2.021 -10.994,-3.803c1.093,-3.1 9.75,-2.449 12.963,-1.27Z;

              M287.252,11.774c1.754,2.12 2.405,6.007 -0.165,8.057c-2.571,2.051 -5.335,0.171 -7.168,-2.017c-3.387,-4.044 -1.962,-6.066 -0.523,-7.288c2.506,-2.129 5.674,-1.388 7.856,1.248Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>


          <!-- main -->
          <path d="M28.784,4.983c15.258,3.236 32.522,11.306 31.712,35.973c-0.222,6.757 -1.714,12.397 -4.242,17.068l-56.254,0l0,-58.024c9.116,2.823 21.731,3.487 28.784,4.983Z" fill-rule="nonzero" style="fill:#BEBEBE;" filter="url(#presentation-interface_glow)">
            <animate class="animateToOpen" id="animate-to-open" begin="0s" dur="0.4s" attributeName="d"
              values="
              M28.784,4.983c15.258,3.236 32.522,11.306 31.712,35.973c-0.222,6.757 -1.714,12.397 -4.242,17.068l-56.254,0l0,-58.024c9.116,2.823 21.731,3.487 28.784,4.983Z;

              M155.718,35.328c63.276,-22.434 114.049,-36.858 149.453,-13.52c14.686,9.68 17.082,19.54 22.675,36.216l-327.846,0l0,-19.802c37.412,-10.233 127.52,7.103 155.718,-2.894Z;

              M120.982,20.035c67.135,0 100.596,-23.723 161.8,23.949c17.027,13.262 27.856,11.43 45.064,14.04l-327.846,0l0,-34.31c18.38,-20.989 90.749,-3.679 120.982,-3.679Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
            <animate class="animateToOpen" id="animate-to-open_color" begin="0s" dur="0.4s" fill="freeze" attributeName="fill" to="#1E1E1E">
            </animate>
          </path>

          <!-- shine -->
          <path d="M27.356,7.673c8.268,2.003 14.639,5.508 12.618,9.193c-2.211,4.032 -9.559,3.806 -17.827,1.802c-8.267,-2.003 -15.287,-4.731 -14.204,-9.2c1.083,-4.468 11.146,-3.799 19.413,-1.795Z" style="fill:#fff;fill-opacity:0.16;">
            <animate class="animateToOpen" id="animate-to-open_shine1" begin="0s" dur="0.4s" attributeName="d"
              values="
              M27.356,7.673c8.268,2.003 14.639,5.508 12.618,9.193c-2.211,4.032 -9.559,3.806 -17.827,1.802c-8.267,-2.003 -15.287,-4.731 -14.204,-9.2c1.083,-4.468 11.146,-3.799 19.413,-1.795Z;

              M287.785,16.257c7.878,3.209 9.219,6.262 6.674,9.607c-2.785,3.658 -7.736,-0.087 -12.386,-2.207c-7.74,-3.528 -11.95,-3.162 -10.216,-7.42c1.735,-4.258 8.05,-3.189 15.928,0.02Z;

              M231.94,21.437c8.267,2.003 14.638,5.508 12.617,9.194c-2.21,4.031 -9.559,3.805 -17.826,1.802c-8.267,-2.004 -15.287,-4.732 -14.204,-9.2c1.082,-4.469 11.146,-3.799 19.413,-1.796Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <path d="M54.314,22.478c1.565,1.891 2.146,5.358 -0.147,7.186c-2.292,1.829 -4.758,0.152 -6.393,-1.799c-3.021,-3.607 -1.75,-5.41 -0.466,-6.5c2.235,-1.899 5.06,-1.238 7.006,1.113Z" style="fill:#fff;fill-opacity:0.24;">
            <animate class="animateToOpen" id="animate-to-open_shine2" begin="0s" dur="0.4s" attributeName="d"
              values="
              M54.314,22.478c1.565,1.891 2.146,5.358 -0.147,7.186c-2.292,1.829 -4.758,0.152 -6.393,-1.799c-3.021,-3.607 -1.75,-5.41 -0.466,-6.5c2.235,-1.899 5.06,-1.238 7.006,1.113Z;

              M308.038,28.68c1.922,1.525 3.209,4.796 1.346,7.06c-1.864,2.265 -4.53,-1.122 -6.534,-2.691c-3.704,-2.902 -3.33,-4.518 -2.3,-5.851c1.792,-2.32 5.096,-0.415 7.488,1.482Z;

              M259.491,34.269c2.022,1.39 3.529,4.566 1.825,6.952c-1.705,2.386 -4.536,1.448 -6.642,0.019c-3.893,-2.643 -3.164,-4.725 -2.227,-6.125c1.63,-2.437 4.529,-2.575 7.044,-0.846Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <defs>
            <filter id="presentation-interface_glow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="0" dy="0" result="offsetblur"/>
              <feFlood flood-color="rgb(0,0,0)" flood-opacity="0.8"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(17.1133,-17.3818,17.3818,17.1133,291.869,26.8478)">
              <stop offset="0" style="stop-color:#020000;stop-opacity:1"/>
              <stop offset="1" style="stop-color:#727272;stop-opacity:1"/>
            </radialGradient>
          </defs>
        </svg>

        <!-- vertical blobs -->
        <!-- -------------- -->

        <!-- vertical blobs close -->
        <svg id="controlarea-vertical_close" viewBox="0 0 47 158" style="background-color: none">
          <path d="M25.565,59.105c-10.826,1.215 -17.61,6.435 -19.213,16.365c-1.801,11.162 8.383,20.326 19.909,20.326c11.527,0 18.666,-6.923 18.666,-18.229c0,-11.305 -7.907,-19.747 -19.362,-18.462Z" style="fill:url(#_gradient-vertical-blob1);">
            <animate class="animateToClose" id="animate-to-close_vertical-blob1" begin="0.5s" dur="0.2s" attributeName="d"
              values="
              M25.565,59.105c-10.826,1.215 -17.61,6.435 -19.213,16.365c-1.801,11.162 8.383,20.326 19.909,20.326c11.527,0 18.666,-6.923 18.666,-18.229c0,-11.305 -7.907,-19.747 -19.362,-18.462Z;

              M17.377,79.614c-4.572,-1.413 -10.636,1.439 -11.131,4.07c-0.871,4.639 3.347,7.947 7.45,7.984c4.104,0.037 8.365,-1.746 8.263,-4.881c-0.07,-2.144 -0.799,-6.003 -4.582,-7.173Z;

              M14.875,77.627c-5.329,-1.117 -8.802,0.332 -9.603,5.296c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 9.33,-0.576 9.33,-6.227c0,-5.651 -5.265,-8.304 -9.678,-9.228Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <defs>
            <linearGradient id="_gradient-vertical-blob1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(48.2231,-41.9077,41.9077,48.2231,6.14419,95.7957)">
              <stop offset="0" style="stop-color:#606060;stop-opacity:1"/>
              <stop offset="1" style="stop-color:#fff;stop-opacity:0"/>
            </linearGradient>
          </defs>

          <path d="M25.565,2.612c-10.826,1.215 -17.61,6.434 -19.213,16.365c-1.801,11.161 8.383,20.325 19.909,20.325c11.527,0 18.666,-6.923 18.666,-18.228c0,-11.305 -7.907,-19.748 -19.362,-18.462Z" style="fill:url(#_gradient-vertical-blob2);">
            <animate class="animateToClose" id="animate-to-close_vertical-blob2" begin="0.5s" dur="0.2s" attributeName="d"
              values="
            M25.565,2.612c-10.826,1.215 -17.61,6.434 -19.213,16.365c-1.801,11.161 8.383,20.325 19.909,20.325c11.527,0 18.666,-6.923 18.666,-18.228c0,-11.305 -7.907,-19.748 -19.362,-18.462Z;

            M15.016,52.635c-2.908,-0.777 -6.969,0.527 -7.26,4.129c-0.421,5.21 0.869,6.185 7.225,6.347c6.355,0.162 7.752,-2.056 7.751,-4.873c0,-2.891 -1.239,-3.873 -7.716,-5.603Z;

            M14.875,46.807c-4.78,-2.608 -8.802,3.216 -9.603,8.18c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 8.369,-1.538 8.369,-7.189c0,-5.65 -2.965,-8.014 -8.717,-11.15Z;"

            fill="freeze"
            calcMode="spline"
            keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <defs>
            <linearGradient id="_gradient-vertical-blob2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(48.2231,-41.9077,41.9077,48.2231,6.14419,39.3024)">
              <stop offset="0" style="stop-color:#d0d0d0;stop-opacity:1"/>
              <stop offset="1" style="stop-color:#fff;stop-opacity:0"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- vertical blobs open -->
        <svg id="controlarea-vertical_open" viewBox="0 0 47 158">
          <path d="M14.875,77.627c-5.329,-1.117 -8.802,0.332 -9.603,5.296c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 9.33,-0.576 9.33,-6.227c0,-5.651 -5.265,-8.304 -9.678,-9.228Z" style="fill:url(#_gradient-vertical-blob1);">
            <animate class="animateToOpen" id="animate-to-open_vertical-blob1" begin="0" dur="0.2s" attributeName="d"
              values="
              M14.875,77.627c-5.329,-1.117 -8.802,0.332 -9.603,5.296c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 9.33,-0.576 9.33,-6.227c0,-5.651 -5.265,-8.304 -9.678,-9.228Z;

              M22.488,56.41c-11.687,1.312 -17.729,7.789 -19.46,18.509c-1.944,12.049 14.227,23.529 26.669,23.529c12.444,0 16.772,-8.662 16.772,-20.867c0,-12.204 -11.616,-22.558 -23.981,-21.171Z;

              M25.565,59.105c-10.826,1.215 -17.61,6.435 -19.213,16.365c-1.801,11.162 8.383,20.326 19.909,20.326c11.527,0 18.666,-6.923 18.666,-18.229c0,-11.305 -7.907,-19.747 -19.362,-18.462Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <defs>
            <linearGradient id="_gradient-vertical-blob1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(48.2231,-41.9077,41.9077,48.2231,6.14419,95.7957)">
              <stop offset="0" style="stop-color:#606060;stop-opacity:1"/>
              <stop offset="1" style="stop-color:#fff;stop-opacity:0"/>
            </linearGradient>
          </defs>

          <path d="M14.875,46.807c-4.78,-2.608 -8.802,3.216 -9.603,8.18c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 8.369,-1.538 8.369,-7.189c0,-5.65 -2.965,-8.014 -8.717,-11.15Z" style="fill:url(#_gradient-vertical-blob2);">
            <animate class="animateToOpen" id="animate-to-open_vertical-blob2" begin="0" dur="0.2s" attributeName="d"
              values="
              M14.875,46.807c-4.78,-2.608 -8.802,3.216 -9.603,8.18c-0.901,5.578 4.19,10.159 9.951,10.159c5.762,0 8.369,-1.538 8.369,-7.189c0,-5.65 -2.965,-8.014 -8.717,-11.15Z;

              M27.767,1.336c-10.826,1.215 -22.866,9.246 -24.469,19.177c-1.801,11.161 14.176,23.121 25.702,23.121c11.527,0 17.128,-11.207 17.128,-22.512c0,-11.305 -6.906,-21.072 -18.361,-19.786Z;

              M25.565,2.612c-10.826,1.215 -17.61,6.434 -19.213,16.365c-1.801,11.161 8.383,20.325 19.909,20.325c11.527,0 18.666,-6.923 18.666,-18.228c0,-11.305 -7.907,-19.748 -19.362,-18.462Z;"

              fill="freeze"
              calcMode="spline"
              keySplines="0.9 0.03 0.93 0.53; 0.79 0.09 0.16 0.73">
            </animate>
          </path>

          <defs>
            <linearGradient id="_gradient-vertical-blob2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(48.2231,-41.9077,41.9077,48.2231,6.14419,39.3024)">
              <stop offset="0" style="stop-color:#d0d0d0;stop-opacity:1"/>
              <stop offset="1" style="stop-color:#fff;stop-opacity:0"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- interface interaction -->
        <!-- --------------------- -->

        <!-- open-menu -->
        <button id="controlarea_open-menu" class="controlbutton controlbuttonbubble" onclick="slidenote.presentation.animatePresentationControl(true)" title="show controlarea">
          <span class="screenreader-only">show controlarea</span>
          <div id="controlarea_open-menu_rect1"></div>
          <div id="controlarea_open-menu_rect2"></div>
          <!-- <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonbubble.png"> -->
        </button>
        <!-- back-in -->
        <button id="controlarea_back-in" class="controlbutton controlbuttonbottomhidearea" onclick="slidenote.presentation.animatePresentationControl(false)" title="hide controlarea">
          <span class="screenreader-only">hide controlarea</span>
          <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonhidearea.png">
        </button>
        <!-- first-slide -->
        <button id="controlarea_first-slide" class="controlbutton controlbuttonbottomfirst" onclick="presentation.showPage(0)" title="first page">
          <span class="screenreader-only">first page</span>
          <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonfirst.png">
        </button>
        <!-- previous-slide -->
        <button id="controlarea_previous-slide" class="controlbutton" onclick="presentation.lastPage()" title="page before">
          <span class="screenreader-only">page before</span>
          <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonbefore.png">
        </button>
        <!-- next-slide -->
        <button id="controlarea_next-slide" class="controlbutton controlbuttonbottomnext" onclick="presentation.nextPage()" title="next page">
          <span class="screenreader-only">next page</span>
          <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonnext.png">
        </button>
        <!-- last slide -->
        <button id="controlarea_last-slide" class="controlbutton" onclick="presentation.showPage(presentation.pages.length-1)" title="last page">
          <span class="screenreader-only">last page</span>
          <img src="/sites/all/libraries/slidenotes/images/buttons/ctrlbuttonlast.png">
        </button>

        <!-- additional interaction -->
        <!-- ---------------------- -->

		<button class="controlbutton" id="controlcomment" title="show comments">
			<span class="screenreader-only">show comments</span>
			<img src="/sites/all/libraries/slidenotes/images/buttons/cmscomment.png">
			<span id="controlcommentcount"></span>
			<span id="controlcommentcountseparator">/</span>
			<span id="controlcommenttotal"></span>
		</button>
		<button id="controlarea_multiuserdialog" class="controlbutton controlbuttonleft" onclick="ws.showDialog()" title="start a session">
			<span class="screenreader-only">start a session</span>
			<img src="/sites/all/libraries/slidenotes/images/buttons/cmsmultisession.png">
		</button>
<!-- old interface
		<button class="controlbutton">backward</button>
		<button class="controlbutton">forward</button>
		<button class="controlbutton">start of slideshow</button>
		<button class="controlbutton">end of slideshow</button>
		<select id="controlgotobutton" class="controlbutton"></select>
		<span class="controlbutton"><span id="controlpagenumber"></span> / <span id="controlpagenumbertotal"></span></span>
		<button class="controlbutton" id="controlcomment"><img src="/sites/all/libraries/slidenotes/images/buttons/presentationcomment.png"><span id="controlcommentcount"></span>/<span id="controlcommenttotal"></span></button>
	-->
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
<img src="/sites/all/libraries/slidenotes/images/loadingscreen.gif" width="1" onload="slidenoteguardian.init()">

<?php print render($content['comments']); ?> <!-- added -->
