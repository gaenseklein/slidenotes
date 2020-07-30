/* load and save module
* handles the interaction with all what has to do with loading and saving
* saves slidenotes localy in localStorage
* saves slidenotes in cms
* exports slidenote to filesystem
* encrypts slidenote before saving
* loads slidenotes from localStorage
* loads slidenotes from cms
* imports slidenotes from filesystem
* imports md-code from filesystem
* decrypts slidenote after loading
* saves config to cms/localStorage destination
* loads config from cms/localStorage destination
* Dependencies: FileSaver.js for saving exports
*/


/*
Slidenotecache: Object which interacts with localStorage
necesary because user wants to open two slidenotes at the same time
*/
var SlidenoteCache = function(){
    this.localstorage = window.localStorage;
    //items in localstorage per slidenote - not sure if really needed inside object but for overview purposes stated here:
    /*this.url;
    this.config;
    this.cryptnote;
    this.slidenotehash;
    this.cryptimagestring;
    this.imghash;
    this.saved;
    this.title;
    this.lastSavedTime;
    */
    //what IS usefull is an Array with localstorage-object-names, so:
    this.cacheItems = ["url","config","cryptnote","slidenotehash",
    "cryptimagestring","imghash","saved","title","lastActiveTime",
    "nid", "dontBotherOnEmptyPassword"];
    this.activeTimeAccuracy = 60000; //How accurant has the lastActiveTime to be? Minute: 60.000 Hh: 3600.000
    this.timeToLife = 24*60*60*1000/this.activeTimeAccuracy; //How long should stuff be cached before deleted normaly
    this.timeToLifeMax = 7*24*60*60*1000/this.activeTimeAccuracy;
    //meta-infos:
    this.id; //an id put in front of item-name in localstorage
    this.allIds; //a string in localstorage, containing all ids seperated by ","
    this.maxSpace; //a number with maximum number of chars possible in browser
    this.version = 2; //a version number to check if we have to rebuild cache. Increase if you want to force rebuild of usercache
}

SlidenoteCache.prototype.init = function(){

    this.allIds = this.localstorage.getItem("allIds");
    var acturl = window.location.pathname; //href;
    var version = this.localstorage.getItem("slidenotecacheversion");
    if(this.allIds ===null || version === null || version < this.version ){
        //there is no cache in Browser - let things get started:
        //first: clear local-cache totaly, we dont want things from the past lindering inside:
        this.localstorage.clear();
        this.id = "sl1";
        this.allIds="sl1"; this.localstorage.setItem("allIds",this.allIds);
        this.localstorage.setItem("slidenotecacheversion",this.version);
        this.maxSpace = this.calculateMaxSpace(); this.localstorage.setItem("maxSpace",this.maxSpace);
        if(typeof initial_note!="undefined")this.localstorage.setItem("sl1nid",initial_note.nid);
        if(slidenoteguardian.restObject && slidenoteguardian.restObject.nid)this.localstorage.setItem("sl1nid",slidenoteguardian.restObject.nid);
    }else{
        this.maxSpace=this.localstorage.getItem("maxSpace");
        //there is a cache yet. try to find actual cache:
        var ids = this.allIds.split(",");
        var nid = null;
        if(typeof initial_note!="undefined")nid=initial_note.nid;
        if(slidenoteguardian.restObject && slidenoteguardian.restObject.nid)nid = slidenoteguardian.restObject.nid;
        for(var x=0;x<ids.length;x++){
            var cacheurl = this.localstorage.getItem(ids[x]+"url");
            var cachenid = this.localstorage.getItem(ids[x]+"nid");
            if((nid!=null && cachenid === nid) || (nid === null && cacheurl && cacheurl.indexOf(acturl)>-1)){
                this.id=ids[x];
                break;
            }
        }
        if(this.id){
            //we found a cache so load cache:
            //this.loadFromCacheToObject();
            //not necesary anymore as we load it later on with the id
        }else{
            //we did not find a cache for current note so open one, which can be loaded afterwards
            this.id = "sl"+(ids.length+1); //easy try: just put it ongoing
            if(this.allIds.indexOf(this.id)>-1){
              //if easy try fails, put on another id:
              for(var newid=1;newid<=ids.length+20;newid++){
                if(this.allIds.indexOf("sl"+newid)===-1){
                  this.id="sl"+newid;
                  break;
                }
              }
              //hopefully we filled some empty space inside.
              //if not we are in kind of a strange situation
              //where something could have been very wrong with cache-management
              //as there should never be so much id's open at the same time
              if(this.allIds.indexOf("sl"+this.id)>-1){
                //lets clear the cache and start a new:
                this.localstorage.clear();
                this.init();
                return;
              }
            }
            this.allIds +=  ","+this.id;
            this.localstorage.setItem("allIds",this.allIds);
            if(nid)this.localstorage.setItem(this.id+"nid", nid);
            if(acturl)this.localstorage.setItem(this.id+"url",acturl);

        }
        //set this cache activeTime so it would not be deleted by garbage-cleaning:
        this.localstorage.setItem(this.id+"lastActiveTime",Math.floor(new Date()/this.activeTimeAccuracy));
        //clean the garbage now:
        this.cleanGarbage();
    }
}

SlidenoteCache.prototype.calculateMaxSpace = function(){
  /*new way
  var maxString = "a";
for(var x=0;x<26;x++)maxString+=maxString;
//console.log(maxString.length);
//maxString should be around 64mio signs, from 5mio max for firefox n chromium
var usedSpace = 0;
for(var x=0;x<localStorage.length;x++){
        usedSpace+=localStorage.key(x).length;
        usedSpace+=localStorage.getItem(localStorage.key(x)).length;
}
var Intervall = 102400; //eg. 100kb
var start = 0 //2048000-usedSpace; //lets start with 2mb and go upward from there
var maxSpace = start;
for(var x=0;x<500;x++){ //500 would be 50.000 kb, more than enough
    let teststring = maxString.substring(0,maxSpace);
    try{
        localStorage.setItem("spaceTest",teststring);
    }catch(e){
        console.log("setItem got wrong at:"+maxSpace);
        maxSpace -= Intervall;
        break;
    }
    maxSpace += Intervall;
    console.log("maxSpace is:"+maxSpace)
}
localStorage.removeItem("spaceTest");
return maxSpace + usedSpace;

  */
    return 5200000; //hardcoded maxspace for now, maybe calculating later?
}

SlidenoteCache.prototype.calculateFreeSpace = function(){
    var total = this.maxSpace - 50000; //lets have a buffer of 50.000 chars free for any changes in md-code happening and overhead. just in case image-insert causes to be too much...
    for(var x=0;x<this.localstorage.length;x++){
            total-=this.localstorage.key(x).length;
            total-=this.localstorage.getItem(this.localstorage.key(x)).length;
    }
    return total;
}

SlidenoteCache.prototype.fitsIntoSpace = function(key,value){
    let oldlength = this.localstorage.getItem(key);
    if(oldlength)oldlength=oldlength.length;else oldlength=0;
    valuelength = 0;
    if(value!=undefined){valuelength=""+value;valuelength=valuelength.length};
    if(this.calculateFreeSpace() > valuelength - oldlength){
      return true;//Todo: calculate if it fits inside
    }
}

SlidenoteCache.prototype.setItem = function(key, value){
    var rkey = this.id+key;
    if(key==="config")rkey="config"; //only one config for all notes
    //test if freeSpace is ok:
    if(this.fitsIntoSpace(rkey,value)){
        try{
          this.localstorage.setItem(rkey,value);
        }catch(e){
          alert("your cache is full\n" + e.message);
        }
        //should i here set the time or let it the program do by itself? if here it happens often but is it bad?
        this.localstorage.setItem(this.id+"lastActiveTime",Math.floor(new Date()/this.activeTimeAccuracy)); //only by minute, we dont care the second here
    }else{
        //there is not enough space - help!!!
        let tryToEmptySpace=this.deleteSavedImages(true,false);
        if(tryToEmptySpace===false){
          //we could not get enough space free - be more aggressive
          tryToEmptySpace=this.deleteSavedImages(true,true);
          if(tryToEmptySpace===false){
          //this means also that user has in ONE slidenote nearly 24mb of images
          //warn the user and tell em to delete or scale down images:
          //alert for now, maybe changing it to propper dialog with
          //posibility to change size of images
            alert("your slidenote has too much or too big images. please try to restrain to less than 5MB total. otherwise images can not be hold in cache for you");
            try{
              this.localstorage.setItem(rkey,value);
            }catch(e){
              alert("your cache is full\n" + e.message);
            }
            return;
          }
        }
        //try anew:
        this.setItem(key,value);
    }
}
SlidenoteCache.prototype.deleteSavedImages = function(excludeActualNote, includeNotSaved){
  var ids = this.allIds.split(",");
  var deletedimages = false;
    for(var x=0;x<ids.length;x++){
      var id=ids[x];
      var saved = this.localstorage.getItem(id+"saved");
      var imagestring = this.localstorage.getItem(id+"cryptimagestring");
      if((saved==="true"|| includeNotSaved) &&
      (id!=this.id || excludeActualNote!=true) &&
      imagestring!=null && imagestring!="cmsonly"){
        this.localstorage.setItem(id+"cryptimagestring","cmsonly");
        deletedimages = true;
      }
    }
    return deletedimages;
}
SlidenoteCache.prototype.getItem = function(key){
    if(key==="config") return this.localstorage.getItem(key); //config is stored globaly
    return this.localstorage.getItem(this.id+key);
}

SlidenoteCache.prototype.deleteCache = function(id){
    for(var x=0;x<this.cacheItems.length;x++){
        this.localstorage.removeItem(id+this.cacheItems[x]);
    }
    var allids = this.allIds.split(",");
    for(var x=0;x<allids.length;x++)if(allids[x]===id)allids.splice(x,1);
    this.allIds = allids.join(",");
    this.localstorage.setItem("allIds",this.allIds);
}

SlidenoteCache.prototype.cleanGarbage = function(){
    var ids = this.allIds.split(",");
    for(var x=0;x<ids.length;x++){
        var id=ids[x];
        var saved = this.localstorage.getItem(id+"saved");
        var isempty = (this.localstorage.getItem(id+"cryptnote")===null);
        var timesincelastactive = Math.floor(new Date()/this.activeTimeAccuracy) - this.localstorage.getItem(id+"lastActiveTime");
        if(((saved==="true"||isempty)
          && timesincelastactive> this.timeToLife)||
        timesincelastactive> this.timeToLifeMax){
            this.deleteCache(id);
          }
    }
    this.allIds=this.localstorage.getItem("allIds");
}


/*
the actual slidenoteguardian.
expects a object of type slidenotes
*/

function slidenoteGuardian(slidenote){
  this.slidenote = slidenote;
  this.cmsConfig = document.getElementById("cmsconfig");
  this.cmsArea = document.getElementById("cmsarea");
  this.cmsImages = document.getElementById("cmsimages");
  this.cmsSlidenoteHash = document.getElementById("cmsslidenotehash");
  this.cmsImagesHash = document.getElementById("cmsimageshash");
  this.cmsNoteSave;
  this.cmsImagesSave;
  this.jsfilesForExport = [];
  //this.exportedPresentations = new Array();
  this.restObject={}; //stores the state of the slidenote as it is stored in the cms
  this.hascmsconnection=false;
  //check if initial_note is set. if so its setted by cms:
  if("initial_note" in window){
    this.hascmsconnection=true;
    this.restObject = initial_note;
    this.restObject.drupal7 = { //maybe i should make it more cms-agnostic here?
      nid:initial_note.nid,
      author:initial_note.author
    }
    this.getRestToken("init");
    //this.getAllPlugins();
  }
  if(this.restObject.exportedPresentations===undefined)this.restObject.exportedPresentations = new Array();
  this.restObject.combine = function(uploadobj){
    for(var key in uploadobj){
      if(uploadobj.hasOwnProperty(key)){
        if(key==="deletedencimages"){
          var dell = uploadobj[key];
          if(dell && dell.length>0){
            for(var dx=0;dx<dell.length;dx++){
              this.encimages.splice(this.encimages.indexOf(dell[dx]),1);
            }
          }
        } else if(key==="encimages"){
            var newimages = uploadobj[key];
            for(var nx=0;nx<newimages.length;nx++){
              this.encimages.push(newimages[nx]);
            }
            //this[key].push(uploadobj[key]);
        }else{
          this[key]=uploadobj[key];
        }
      }
    }
    uploadobj = {}; //destroy uploadobject?
  }
  this.uploadRestObject = {};

  this.configs; //not used yet
  this.password; //storing password for later use so user has not to retype it all the time he saves (automagicaly)
  this.passwordHash; //better use this than original password?
  this.key = null; //always start with empty key
  this.crypto = window.crypto; //make crypto available
  this.decText; //last decrypted Text - we could get rid of it
  this.encBufferString; //last encrypted String from cms or local storage
  this.encImageString; //last encrypted String from cms or local storage with base64-images
  this.iv; //the initialisation-vector to use - we could get rid of it?
  this.ivlength = 12; //the length of the initialisation vector used for encryption
  this.localstorage = new SlidenoteCache();//window.localStorage; //set local storage
  //this.localstorage.init();
  /*in local-storage there can be saved ONE slidenote only. items:
  * cryptnote: encrypted slidenote
  * cryptimagestring: encrypted string with base64-images
  * title: the title of the saved slidenote
  */
  this.notetitle = "slidenotetest"; //the title of the saved slidenote - normaly set via cms
  //helpers for autosave:
  this.lastNoteFormId;
  this.isencryptingimages = false;
  //this.lastTimeActive = new Date().getTime(); //last time user was active - needed for Timeout before saving

  //add FileSaver.js to meet Dependencie:
  this.slidenote.appendFile("script","filesaver/FileSaver.js");
  /*
  var jsfile = document.createElement('script');
  jsfile.setAttribute("type","text/javascript");
  jsfile.setAttribute("src", "themes/filesaver/FileSaver.js");
  document.getElementsByTagName("head")[0].appendChild(jsfile);
  */
  if(!this.hascmsconnection){
    var savestatus = document.getElementById("savestatus");
    if(savestatus){
      savestatus.src = slidenote.imagespath+"buttons/clouderror.png";
      savestatus.title = "no connection with the cloud";
    }
    var cloudstatus = document.getElementById("cloudstatus");
    if(cloudstatus){
      cloudstatus.innerText = "no connection";
      cloudstatus.classList.add("error");
    }
    var cloudbutton = document.getElementById("cloud");
    cloudbutton.classList.add("status-error");
    cloudbutton.title = "no connection with the cloud";
  }
  //can we start the init here? why not?
  //this.init(); not, because slidenoteguardian is not initialised yet :(
  if(location.protocol!="file:"){
    setTimeout("slidenoteguardian.initLoad()",10);
    console.log("get all css from static webserver");
    setTimeout("slidenoteguardian.getCSSFromStaticWebserver(); slidenoteguardian.getJSFromStaticWebserver();",100);

  }else{
    setTimeout("slidenoteguardian.init()",10);
  }
  this.initialised = false;
}

/*initLoad completes initial load from cms*/
slidenoteGuardian.prototype.initLoad = async function(){
  var searchurl = location.search;
  //check if we have to create a new slidenote:
  if(searchurl==="?newslidenote"){
    this.afterToken = function(){
      this.createNewSlidenote();
    }
    this.getRestToken("createNewSlidenote");
    return;
  }
  this.getRestToken(); //always get a RestToken we can use later on
  var nid = searchurl.substring(searchurl.lastIndexOf("=")+1);
  if(!nid*1>0){
    //this.init();
    this.loadFromRest("/myslidenotes", function(){
      if(this.status===403){
        //not logged in:
        window.location.href="/user/login";
      }else if(this.status===200){
        var xmlDoc = this.responseXML;
        var items = xmlDoc.getElementsByTagName("item");
        var lastslidenote = {id:0,lastChange:0};
        for(var x=0;x<items.length;x++){
          var lastdate = items[x].getElementsByTagName("pubDate")[0].innerHTML*1;
          if(lastslidenote.lastChange<lastdate){
            let nid = items[x].getElementsByTagName("guid")[0].innerHTML;
            if(nid.indexOf(" ")>-1)nid = nid.substring(0,nid.indexOf(" "));
            nid = nid*1;
            lastslidenote = {
              id:nid,
              lastChange:lastdate
            };
          }
        }
        if(lastslidenote.id===0){
          //no slidenotes found - put a new one:
          //this.createNewSlidenote();
          if(slidenoteguardian.restToken){
            //alert("create new slidenote"+slidenoteguardian.restToken);
            slidenoteguardian.createNewSlidenote();
          }
        }else{
          window.location.search="id="+lastslidenote.id;
        }
      }
    });
    return;
  } //no valid node-id found
  this.loadFromRest("/node/"+nid+".json",
    //loadHandler:
    function(){
    if(this.status===403){
      //it seems you are not logged in, so push to user-login:
      window.location.href="/user/login?destination="+window.location.pathname+window.location.search;
    }else if(this.status===404){

    }else if(this.status===200){
      var payload;
      try{
        payload = JSON.parse(this.response);
      }catch(err){
        payload = false;
      }
      if(payload){
        //build initial_note:
        //drupal7-to-slidenote-transition:
        console.log("loaded note:");
        console.log(payload);
        if(!payload.field_encimg)payload.field_encimages=new Array();
        slidenoteguardian.restObject.author = payload.author;
        slidenoteguardian.restObject.encimages = payload.field_encimg;
        slidenoteguardian.restObject.encimgmeta = payload.field_imagemeta;
        slidenoteguardian.restObject.encnote = payload.field_encryptednote;
        slidenoteguardian.restObject.exportedPresentations = payload.field_presentations;
        slidenoteguardian.restObject.imagehash = payload.field_imageshash;
        slidenoteguardian.restObject.imgmeta = payload.field_imagemeta;
        slidenoteguardian.restObject.nid = payload.nid;
        slidenoteguardian.restObject.notehash = payload.field_notehash;
        slidenoteguardian.restObject.title = payload.title;
        slidenoteguardian.restObject.type = payload.type;
        slidenoteguardian.restObject.drupal7 = {
          nid:payload.nid,
          author:payload.author
        }
        slidenoteguardian.hascmsconnection=true;
        initial_note = slidenoteguardian.restObject;
        slidenoteguardian.notetitle = payload.title;
      }
    }
    slidenote.texteditorrahmensetzen(); //clear editor borders after loading
    if(payload && payload.type==="tutorial"){
      slidenoteguardian.initTutorial();
    }else{
      slidenoteguardian.init();
    }
    //start midstate animation:
    document.getElementById("slidenoteloadingscreenwrapper").classList.add("midstate");
    document.getElementById("slidenotediv").classList.add("midstate");
  },
  //progressHandler:
  function(evt){
        if(evt.timeStamp<5000)return; //miliseconds to wait before showing progress
        console.log("Download in Progress:" + evt.loaded + "/" + evt.total);
          var cs = document.getElementById("initialLoadingProgress");
          var ul = Math.floor(evt.loaded / 1024);
          var tt = Math.floor(evt.total / 1024);
          if(tt>0)tt=" / "+tt; else tt="";
          cs.innerHTML = "It seems your Download is kind of slow<br> or your Slidenote kind of big:<br>"+ul+tt+" kB downloaded";


  });
}

slidenoteGuardian.prototype.init = function(){
  //init will be called once the slidenote has been loaded from cms
  //or if it is localy.
  //this.getCMSFields();
  this.localstorage.init();
  if(this.localstorage.getItem("config")!=null){
    //slidenoteguardian is loaded after editor is ready to use so load Config:
    this.loadConfig("local");
    //slidenote.extensions.addAfterLoadingThemesHook(function(){slidenoteguardian.loadConfig("local")});
  }
  var notetitle = this.restObject.title;
  this.notetitle = this.restObject.title;
  //set notetitle into menus etc.:
  document.getElementById("slidenotetitle").innerText=notetitle;

  var notehash = this.restObject.notehash;
  var cachednote = {
    title: this.localstorage.getItem("title"),
    saved: this.localstorage.getItem("saved"),
    nid: this.localstorage.getItem("nid"),
    notehash: this.localstorage.getItem("slidenotehash"),
    url:this.localstorage.getItem("url")
  }
  console.log(
    "cachednote.saved:"+cachednote.saved+
    "\n cmsconnection:"+this.hascmsconnection+
    "\n restObject.notehash:"+notehash+
    "\n cachednote.notehash:"+cachednote.notehash+
    "\n cachednote.url :"+cachednote.url+
    "\n window.location:"+window.location.href+
    //"\n restobj.encnote:"+this.restObject.encnote.substring(0,10)+
    "\n restobj.encnote-empty?"+(this.restObject.encnote==="")
  );

  //lookout if we have to load it from localStorage or from cms:
  if((cachednote.saved === "true" || cachednote.notehash === null) &&
      this.hascmsconnection &&
    this.restObject.encnote && this.restObject.encnote.length>1){
    setTimeout("slidenoteguardian.loadNote('cms')",1);
  }else if((this.hascmsconnection && this.restObject.encnote === null)||
    (this.restObject.encnote!=undefined && this.restObject.encnote ==="")){
    //new slidenote, save to get password-prompt? seems not necesary
    //first get the name, then the password:
    var dialogoptions = {
      type:"prompt",
      title: "welcome back!",
      content: "Please give your Slidenote a name",
      inputlabel:"slidenote file name",
      confirmbutton:"save",
      //nocancelbutton:true,
      closefunction: function(){
        var nid = slidenoteguardian.restObject.nid;
        if(!nid)return;
        slidenoteguardian.deleteFromRest("/node/"+nid,function(){
          window.location.href="/editor";
        });
      },
      cssclass:"initial"
    };
    dialogoptions.content = document.createElement("div");
    dialogoptions.content.id = "placeholder";
    var subtitle = document.createElement("h2");
    subtitle.innerText = "Please give your Slidenote a name";
    //check if first note:
    if(this.notetitle==="€€€FIRST SLIDENOTE€€€"){
      subtitle.innerText = "let's start with giving it a name:"
      dialogoptions.title = "welcome to your first slidenote!";
    }
    dialogoptions.content.appendChild(subtitle);


    dialoger.prompt(dialogoptions).then(function(resolve){
      var name = resolve;
      slidenoteguardian.notetitle = name;
      slidenote.menumanager.buildSlidenoteList();
      document.getElementById("slidenotetitle").innerText = name;
      var pwuserfield = document.getElementById("username");
      pwuserfield.value = name;

      slidenoteguardian.passwordPrompt("now choose a password to encrypt your slidenote","encrypt").then(
        function(resolve){
          slidenoteguardian.password = resolve;
          slidenoteguardian.saveNote('cms');
          slidenoteguardian.startEditorAnimation();
          //setTimeout("slidenoteguardian.saveNote('cms')",1);

        },
        function(error){
          slidenoteguardian.password = "";
          slidenoteguardian.startEditorAnimation();
        }
      );
    },function(error){

    });



  }else if(notehash===undefined && cachednote.notehash != undefined){
    setTimeout("slidenoteguardian.loadNote('local')",1);
  } else if(window.location.protocol==="file:"){
    //local-start for marie, delete in final version:
    slidenoteguardian.passwordPrompt("You are using the slidenote-editor localy. please choose a password to encrypt your slidenote","encrypt").then(
      function(resolve){
        slidenoteguardian.password = resolve;
        slidenoteguardian.saveNote('local');
        slidenoteguardian.startEditorAnimation();
        //setTimeout("slidenoteguardian.saveNote('cms')",1);

      },
      function(error){
        slidenoteguardian.password = "";
        slidenoteguardian.startEditorAnimation();
      }
    );
  }else{
    if(cachednote.url === window.location.href){
      //var confirmtext = "You have an unsaved Version of this slidenote in Cache. Show Diff?";
      //if(confirm(confirmtext))setTimeout("slidenoteguardian.loadDiff()",1); //only for now, TODO: always load Diff on this occasion
      //else setTimeout("slidenoteguardian.loadNote('cms')",1);
      setTimeout("slidenoteguardian.loadDiff()",1);
    }else if(cachednote.url != undefined){
      var confirmtext = "You have an unsaved Version in Cache from another Slidenote "+this.localstorage.getItem("title");
      confirmtext +="\n Open unsaved Slidenote? ("+cachednote.url+") \n\n Warning - unsaved Cache will be lost if not saved to Cloud";
      if(confirm(confirmtext)){
        window.location = cachednote.url;
      }else{
          setTimeout("slidenoteguardian.loadNote('cms')",1);
      }
    }
  }

  /*
  if(this.localstorage.getItem("title") && this.localstorage.getItem("title").length>0){//===this.notetitle){
    let loadtext = "We found a Slidenote in your Browsers Cache of the loaded Slidenote. Use Version of Browser-Cache?";
    if(this.localstorage.getItem("title")!=notetitle)loadtext="We found a Slidenote with title \""+this.localstorage.getItem("title")+"\" in your local Storage but loaded Title is \""+this.notetitle+"\". Do you want to load the cached version instead?";
    if(this.localstorage.getItem("slidenotehash")!=notehash && confirm(loadtext)){
      this.notetitle=this.localstorage.getItem("title");
      setTimeout("slidenoteguardian.loadNote('local')",100);
    } else {
      if(this.hascmsconnection && this.restObject.encnote.length>1){
        setTimeout("slidenoteguardian.loadNote('cms')",1);
      }else if(this.hascmsconnection){

      }
      //this.loadNote("cms");
      //this.loadConfig("cms");
    }
  }*/
  document.getElementById("optionsclose").addEventListener("click",function(event){
      slidenoteguardian.saveConfig("local");
  });
  //more to save:
  var savefunction = function(e){
    slidenoteguardian.saveConfig("local");
  };

  setTimeout("slidenoteguardian.autoSaveToCMS()",3000);
  slidenote.textarea.addEventListener("focus",function(event){
    if(document.getElementById("slidenoteGuardianPasswortPrompt")!=null){
      document.getElementById("password").focus();
    }
  })
  //Adding import-Function to fileinput:
  this.initFileImport();
  this.initDragNDrop();

  window.onbeforeunload = function(){
    var acthash = slidenoteguardian.localstorage.getItem("slidenotehash");
    if(acthash!=slidenoteguardian.restObject.notehash){
      //console.log(acthash+"\n localstoragehash vs cmshash\n"+slidenoteguardian.cmsSlidenoteHash.value);
      return "do you really want to leave?";
    }
  }


  //savebutton:
  var savebutton = document.getElementById("savebutton");
  if(savebutton)savebutton.addEventListener("click",function(e){
    slidenoteguardian.saveNote("cms");
  });
  var cloudbutton = document.getElementById("cloud");
  if(cloudbutton)cloudbutton.addEventListener("click",function(e){
    slidenoteguardian.saveNote("cms");
  });
    this.savebutton = savebutton;
    this.savebuttontitles = {default:"not in sync with cloud",
                             error:"error while connecting to cloud",
                             sync:" in sync with cloud :)"}

  if(this.hascmsconnection){
    this.loadSlidenotesList();
    this.loadPresentationList();
  }

  this.initialised = true;
}

slidenoteGuardian.prototype.initFileImport = function(){
  var fileInput = document.getElementById("importfile");
  fileInput.addEventListener('change', function(e){
    let file = this.files[0];
    let nombre = file.name; //.slidenote
    console.log("file "+nombre + " selected");
    if(nombre.substring(nombre.length-10)===".slidenote"){
      //its an encrypted slidenote
      var reader = new FileReader();
      reader.onload = function(e){
        slidenoteguardian.importFromEncryptedFile(reader.result);
      }
      reader.readAsText(file);
    } else if(nombre.substring(nombre.length-2)==="md" ||
           nombre.substring(nombre.length-3)==="txt" ||
            nombre.substring(nombre.length-3)==="csv"){
      var reader = new FileReader();
      reader.onload = function(e){
        slidenoteguardian.insertImport(reader.result);
      }
      reader.readAsText(file);
    } else {
      //Filetype not supported
      alert("filetype not supported");
    }
  }); //end of fileinput.addEventListener

}

slidenoteGuardian.prototype.initDragNDrop = function(){
  slidenote.textarea.addEventListener('drop', function(e){
      //prevent defaults:
      e.preventDefault();
      e.stopPropagation();
      //handling drag n drop of files
      let dt = e.dataTransfer;
      let files = dt.files;
      let file = files[0];
      let nombre = file.name;
      document.getElementById("importfile").dropfilename = file.name;
      if(nombre.substring(nombre.length-10)===".slidenote"){
        var reader = new FileReader();
        reader.onload = function(e){
          slidenoteguardian.importFromEncryptedFile(reader.result);
        }
        reader.readAsText(file);
      }else if(nombre.substring(nombre.length-2)==="md" ||
            nombre.substring(nombre.length-3)==="txt" ||
            nombre.substring(nombre.length-3)==="csv"){
              var reader = new FileReader();
              reader.onload = function(e){
                slidenoteguardian.insertImport(reader.result);
              }
              reader.readAsText(file);
      } else {
        //filetype not supported: Image is handled in imgtourl
      }
  }, false); //end of drop-event


}

slidenoteGuardian.prototype.initTutorial = function(){
  this.notetitle = this.restObject.title;
  document.getElementById("slidenotetitle").innerText=this.notetitle;
  var tutorialnote = this.restObject.encnote;

  //as tutorials are unencrypted we can use the values directly:
  this.slidenote.textarea.value = tutorialnote;
  if(initial_note.encimgmeta){
    this.slidenote.base64images.loadImageString(initial_note.encimgmeta);
  }
  this.slidenote.textarea.selectionEnd = 0;
  this.slidenote.parseneu();
  this.slidenote.textarea.blur();
  this.slidenote.textarea.focus();
  this.startEditorAnimation();
  slidenote.base64images.rebuildOldImages();

  //load tutorial-list:
  this.loadFromRest("/tutoriallist","importSlidenotesList");
  //Adding import-Function to fileinput:
  this.initFileImport();
  this.initDragNDrop();

  //overwriting savefunctions:
  this.autoSaveToLocal = function(){};
  this.autoSaveToCMS = async function(){};
  this.createNewSlidenote = function(){alert('here you could create a new slidenote. go back to editor to use')};
  this.deleteFromRest = function(path,response){alert('this would have deleted your slidenote')};
  this.saveConfig = function(){};
  this.saveNote = function(){};
  this.saveToRest=function(){};
  //document.getElementById("renamebutton").onclick=function(){alert('here you could rename your slidenote')};
  //document.getElementById("changepasswordbutton").onclick=function(){alert('here you would change your password for your slidenote')};
  //overwriting cloud-button:
  var cloudbutton = document.getElementById("cloud");
  var backlink = document.createElement("a");
  backlink.href = window.location.pathname;
  backlink.innerHTML = "&larr; back to editor"; //←
  //cloudbutton.replaceWith(backlink);
  cloudbutton.style.display = "none";
  cloudbutton.parentElement.insertBefore(backlink,cloudbutton);

  //adding tutorial.css:
  slidenote.appendFile("css","tutorial.css");

}

var testresponse; //for testing-purpose
slidenoteGuardian.prototype.loadFromRest = async function(filepath, responseHandler, loadingHandler){
  var oReq = new XMLHttpRequest();
  if(responseHandler!=null && responseHandler!=undefined)
  oReq.responseHandler = responseHandler;
  else oReq.responseHandler = false;
  oReq.addEventListener("load", function(){
    if(this.responseHandler && typeof this.responseHandler==="string"){
      slidenoteguardian[this.responseHandler](this);
    }else if(this.responseHandler && typeof this.responseHandler ==="function"){
      this.responseHandler();
    }else
    slidenoteguardian.loadedFromRest(this.response);
  });
  if(loadingHandler){
    oReq.addEventListener("progress",loadingHandler);
  }
  oReq.open("GET", filepath);
  oReq.setRequestHeader("CONTENT-TYPE","application/json");
  oReq.setRequestHeader('X-CSRF-TOKEN', this.restToken);
  oReq.send();
  testresponse = oReq; //for checking in testing only, not in production
}

slidenoteGuardian.prototype.loadedFromRest = function(jsonstring){
  var loadedObject = JSON.parse(jsonstring);
  this.loadedObject = loadedObject;
  console.log(loadedObject);
}

slidenoteGuardian.prototype.deleteFromRest = async function(filepath, responseHandler){
  var oReq = new XMLHttpRequest();
  if(responseHandler!=null && responseHandler!=undefined)
  oReq.responseHandler = responseHandler;
  else oReq.responseHandler = false;
  oReq.addEventListener("load", function(){
    if(this.responseHandler && typeof this.responseHandler==="string"){
      slidenoteguardian[this.responseHandler](this);
    }else if(this.responseHandler && typeof this.responseHandler ==="function"){
      this.responseHandler();
    }else{
      //default after delete:
      console.log("file deleted");
      console.log(this);
    }
  });
  oReq.open("DELETE", filepath);
  //oReq.setRequestHeader("CONTENT-TYPE","application/json");
  oReq.setRequestHeader('X-CSRF-TOKEN', this.restToken);
  oReq.send();
  testresponse = oReq;
}


/*
importSlidenotesList: loads a list with all slidenotes from user to display for loading
response is a xmlDoc
*/
slidenoteGuardian.prototype.importSlidenotesList = function(response){
  if(!response.status===200)return;
  var xmlDoc = response.responseXML;
  slidenoteguardian.loadedXmlDoc = xmlDoc;
  var items = xmlDoc.getElementsByTagName("item");
  var loadedSlidenotes = new Array();
  for(var x=0;x<items.length;x++){
      var title = items[x].getElementsByTagName("title")[0];
      var link = items[x].getElementsByTagName("link")[0];
      var nid = items[x].getElementsByTagName("guid")[0].innerHTML;
      nid = nid.substring(0,nid.indexOf(" "));
      var lastdate = items[x].getElementsByTagName("pubDate")[0];
      loadedSlidenotes.push({
        title:title.innerHTML,
        url:link.innerHTML,
        lastChange: lastdate.innerHTML,
        id:nid});
  }
  slidenoteguardian.loadedSlidenotes = loadedSlidenotes;
  if(menumanager)menumanager.buildSlidenoteList();
}

/*loads the xml-doc from the server to give it to importSlidenotesList*/
slidenoteGuardian.prototype.loadSlidenotesList = function(){
  this.loadFromRest("/myslidenotes","importSlidenotesList");
  /*function(response){
    console.log("catched slidenotelist "+this.response);
    slidenoteguardian.importSlidenotesList(this);
  });*/
}
/*
importPresentationList: imports links to all presentations from user
*/
slidenoteGuardian.prototype.importPresentationList = function(response){
    var xmlDoc=response.responseXML;
    slidenoteguardian.loadedXmlDocP = xmlDoc;
    var items = xmlDoc.getElementsByTagName("item");
    var nid = slidenoteguardian.restObject.nid;
    var loadedPresentations = new Array();
    for(var x=0;x<items.length;x++){
        var title = items[x].getElementsByTagName("title")[0].innerHTML;
        var link = items[x].getElementsByTagName("link")[0].innerHTML;
        link = decodeURI(decodeURI(link));
        var pubDate = items[x].getElementsByTagName("pubDate")[0].innerHTML;
        var commentstring = items[x].getElementsByTagName("description")[0].innerHTML;
        var nodeid = items[x].getElementsByTagName("dc:creator")[0].innerHTML;
        var pnid = items[x].getElementsByTagName("guid")[0].innerHTML;
        if(nodeid==nid){
            loadedPresentations.push({
                title:title, url:link, date:pubDate,
                commentstring:commentstring, slidenote:nodeid,
                nid:pnid
            });
        }
    }
    slidenoteguardian.loadedPresentations = loadedPresentations;
    console.log("presentations loaded");
    if(menumanager)menumanager.buildPublishedMenu();
}
/*
loads the xml-doc from the server to give it to importPresentationList
*/
slidenoteGuardian.prototype.loadPresentationList = function(){
  this.loadFromRest("/mypresentations",function(){
    slidenoteguardian.importPresentationList(this);
  });
}

/*
get all Plugins as text to write them later on to the downloadable html-file
not used anymore - delete it in the future
*/
slidenoteGuardian.prototype.getAllPlugins = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function(){
    console.log(this);
    if(this.status===200 || this.statusText==="ok")
    slidenoteguardian.importPlugins(JSON.parse(this.response));
  });
  oReq.open("GET","/node.json?type=slidenote_plugin");
  oReq.send();
}

//get all Css-Blocks from static webserver:
slidenoteGuardian.prototype.getCSSFromStaticWebserver = function(){
  console.log("load css from themes:"+slidenote.extensions.themes.length);
  console.log("theme-string:"+this.slidenote.extensions.themeObjektString);

  this.cssBlocksPerPlugin = new Array();
  var basicl = new XMLHttpRequest();
  basicl.addEventListener("load",function(){
    if(this.status===200)slidenoteguardian.cssBlocksPerPlugin.push({plugin:"basic", css:this.response});
  })
  basicl.open("GET", slidenote.basepath+"marie.css");
  basicl.send();
  var basepath = slidenote.basepath+"themes/"
  var themes = slidenote.extensions.themeCssString.split(";");//slidenote.extensions.themes;
  themes.pop(); //remove last empty entry
  themes.push("slidenoteguardian");
  themes.push("slidenoteplayermini");
  var oReqs = new Array();
  for(var x=0;x<themes.length;x++){

    var filename = basepath + themes[x]+".css";//themes[x].classname + ".css";
    oReqs[x] = new XMLHttpRequest();
    oReqs[x].addEventListener("load",function(){
      console.log("css-file loaded from webserver as textfile:")
      console.log(this);
      var pluginname = this.responseURL.substring(this.responseURL.lastIndexOf("/")+1,this.responseURL.lastIndexOf("."));
      if(this.status ===200)slidenoteguardian.cssBlocksPerPlugin.push({plugin:pluginname, css:this.response});
    });
    oReqs[x].open("GET", filename);
    oReqs[x].send();
  }

}
/*
get all js as static text to write it later into html-file on export
*/
slidenoteGuardian.prototype.getJSFromStaticWebserver = function(){
  this.jsfilesForExport = new Array();

  var jsfilenames = ["slidenoteplayermini.js", "slidenoteguardianmini.js"];
  for(var x=0;x<jsfilenames.length;x++){
    var filename = slidenote.basepath + jsfilenames[x];
    var req = new XMLHttpRequest();
    req.addEventListener("load",function(){
      console.log("js-file loaded from webserver as textfile");
      console.log(this);
      slidenoteguardian.jsfilesForExport.push({name: this.responseURL.substring(this.responseURL.lastIndexOf("/")+1),jscode: this.response});
    });
    req.open("GET",filename);
    req.send();
  }
}

/*old stuff - delete in the future:*/
slidenoteGuardian.prototype.importPlugins = function(resolve){
  console.log(resolve);
  this.restObject.plugincollector = {};
  this.restObject.plugincollector.pluginlist = resolve.list;
  for(var x=0;x<resolve.list.length;x++){
    var actplugin = resolve.list[x];
    var css = actplugin.field_plugincss;
    this.restObject.plugincollector[actplugin.title] = {
      css:css, nr:x, body:actplugin.body
    }
  }
  console.log("imported plugins");
}

/*creates the <style>-block for the html to export*/
slidenoteGuardian.prototype.createCssBlock = function(){
  var cssblock = "";
  //if(this.restObject.plugincollector == undefined && this.hascmsconnection){
    //this.getAllPlugins();
  //} else
  if(this.cssBlocksPerPlugin){
    for(var x=0;x<this.cssBlocksPerPlugin.length;x++){
      var cssb = this.cssBlocksPerPlugin[x];
      var ltheme = slidenote.extensions.getThemeByName(cssb.plugin);
      if(ltheme && ltheme.active || cssb.plugin==="basic" ||
      cssb.plugin==="slidenoteguardian" || cssb.plugin==="slidenoteplayermini"){
        cssblock+="\n"+cssb.css+"\n</style><style>";
      }else{
        console.log("plugin "+cssb.plugin +"war nicht aktiv");
      }
    }
    return cssblock;
  } else if(!this.hascmsconnection) return "/*connection to cloud not working*/";

  for(var x=0;x<slidenote.extensions.themes.length;x++){
    var acttheme = slidenote.extensions.themes[x];
    if(acttheme.active && this.restObject.plugincollector[acttheme.classname]!=undefined){
      cssblock+=this.restObject.plugincollector[acttheme.classname].css;
    }
  }
  //cssblock+="\n</style>\n";
  return cssblock;
}

/*
get a rest-token:
*/
slidenoteGuardian.prototype.getRestToken = async function(afterwards){
  var tokenquest = new XMLHttpRequest();
  console.log("asking for Token...");
  tokenquest.addEventListener("load",function(){
    if(this.status==200&& this.statusText==="OK")
      slidenoteguardian.restToken = this.response;
      else if(this.status===403){
        window.location.href="/user/login?destination="+window.location.pathname+window.location.search;
        slidenoteguardian.restToken = undefined;
      }else slidenoteguardian.restToken = undefined;
    console.log("Token loaded:"+this.statusText);
    slidenoteguardian.afterToken();
    //if(afterwards && slidenoteguardian[afterwards])slidenoteguardian[afterwards]();
  });

  tokenquest.open("GET","/restws/session/token");
  tokenquest.send(null);
  //should return promise to let saveToRest await
}

/*
*/
slidenoteGuardian.prototype.afterToken = function(){
  //placeholder to be overwritten in case needed
}
/*
saveToRest: saves content to cms via Rest:
@param payload: payload to save to the Rest
@param path: path for the Rest-Action
*/
slidenoteGuardian.prototype.saveToRest = async function(path, payload){
  console.log("start saveToRest:"+path);
  if(this.restToken===undefined || this.restToken===null){
    console.log("Rest-Token not set yet... getting Token and try again...");
    this.getRestToken("save"); //has to be with await
    if(this.uploadRestObject.inprogress)this.uploadRestObject.inprogress=false;
    if(this.savingtoDestination)this.savingtoDestination=undefined;
    return; //return and wait for next save till we can await
  }
  //var payload = JSON.stringify(payloadobject);
  var putReq= new XMLHttpRequest();
  putReq.addEventListener("load",function(){
    slidenoteguardian.resolve=this;
    console.log(this);
    slidenoteguardian.savedToRest(this);
  });
  putReq.open("PUT",path);
  putReq.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        console.log("Upload in Progress:" + evt.loaded + "/" + evt.total);
        var cs = document.getElementById("cloudstatus");
        var ul = Math.floor(evt.loaded / 1024);
        var tt = Math.floor(evt.total / 1024);
        cs.innerText = "Uploading in Progress: "+ul+"/"+tt+" kB uploaded";
      }
    }, false);
  putReq.setRequestHeader("CONTENT-TYPE","application/json");
  putReq.setRequestHeader('X-CSRF-TOKEN', this.restToken);

  //putReq.withCredentials = true;
  putReq.addEventListener("error",function(evt){
    if(slidenoteguardian.uploadRestObject.inprogress)slidenoteguardian.uploadRestObject.inprogress=false;
    if(slidenoteguardian.savingtoDestination)slidenoteguardian.savingtoDestination=undefined;
    var cloudbutton = document.getElementById("cloud");
    cloudbutton.classList.add("cloud-error");
    var statustext = document.getElementById("cloudstatus");
    statustext.innerText = "an error occured - network seems unreachable. Please try again later or check your internet connection.";
  });
  putReq.send(payload);
  console.log("sending payload");
  console.log(putReq);
}

/*
after content is saved to rest this is called:
*/
slidenoteGuardian.prototype.savedToRest = function(resolve){
  console.log("saved to Rest:"+resolve.statusText);
  var statusimg = document.getElementById("savestatus");
  var cloudbutton = document.getElementById("cloud");
  //clear classlist:
  var classList = cloudbutton.classList;
  while (classList.length > 0) {
       classList.remove(classList.item(0));
  }
  var statustext= document.getElementById("cloudstatus");


  if(resolve.statusText==="OK"){
    if(statusimg){
      statusimg.src = slidenote.imagespath+"buttons/cloudsaved.png";
      statusimg.title = "slidenote in sync with cloud";
    }
    cloudbutton.classList.add("status-ok");
    cloudbutton.title = "slidenote in sync with cloud";
    if(statustext)statustext.innerText="in sync with cloud";
    this.restObject.combine(this.uploadRestObject);
    //check if cached-version is same - if so set to saved:
    let cachedhash = this.localstorage.getItem("slidenotehash");
    console.log("savedToRest: cache vs. cms \n"+cachedhash + "\n"+this.restObject.notehash);
    if(cachedhash === this.restObject.notehash)this.localstorage.setItem("saved","true");
    //this.localstorage.setItem("nid",this.restObject.drupal7.nid);
    //this.localstorage.setItem("url",window.location.href);
  }else{
    if(statusimg){
      statusimg.src = slidenote.imagespath+"buttons/clouderror.png";
      statusimg.title=resolve.statusText;
    }
    cloudbutton.classList.add("cloud-error");
    cloudbutton.title = resolve.statusText;
    if(statustext)statustext.innerText="no connection with cloud";
  }
  this.savingtoDestination=undefined; //old? seems to not be used anymore
  this.uploadRestObject = {}; //destroy uploadRestObject?
}

slidenoteGuardian.prototype.exportPresentationToRest = function(payload){
  console.log("start exportToRest");
  if(!this.restToken){
    console.log("Rest-Token not set yet... getting Token and try again...");
    this.getRestToken("save"); //has to be with await
    return; //return and wait for next save till we can await
  }
  //var payload = JSON.stringify(payloadobject);
  var postReq= new XMLHttpRequest();
  postReq.addEventListener("load",function(){
    //slidenoteguardian.resolve=this;
    console.log("new export-resolve");
    console.log(this);
    slidenoteguardian.exportedPresentationToRest(this);
  });
  postReq.open("POST","/node/2"); //node/2 needs to be of type presentation to work
  postReq.setRequestHeader("CONTENT-TYPE","application/json");
  postReq.setRequestHeader('X-CSRF-TOKEN', this.restToken);

  //putReq.withCredentials = true;
  postReq.send(payload);
  console.log("sending payload");
  console.log(postReq);
}

slidenoteGuardian.prototype.exportedPresentationToRest = function(resolve){
  if(resolve.statusText==="Created"){
    var respobj = JSON.parse(resolve.response);
    var cdate = new Date();
    this.restObject.exportedPresentations.push({
      id:respobj.id,
      uri:respobj.uri,
      date: cdate
    });
    console.log("uploaded to Rest");
    console.log(respobj);
    //update slidenote-node:
    var update = this.prepareDrupal7Rest("presentationEntityUpdate");
    this.saveToRest(update.path,update.payload);
    //get public url of presentation:
    var urlquest = new XMLHttpRequest();
    urlquest.addEventListener("load", function(){
      var exp = slidenoteguardian.restObject.exportedPresentations[slidenoteguardian.restObject.exportedPresentations.length-1];
      var resolve = JSON.parse(this.response);
      exp.publicURL = resolve.url;
      if(confirm("new Presentation ready with url "+resolve.url+"\n Go there now?")){
        console.log("jump to presentationnode");
      }
    });
    urlquest.open("GET",respobj.uri+".json");
    urlquest.setRequestHeader("CONTENT-TYPE","application/json");
    urlquest.setRequestHeader('X-CSRF-TOKEN', this.restToken);
    urlquest.send();
  }
}

/* exportPresentation:
prepares the presentation to be exported to destination
@param destination: where to save (filesystem, cms)
*/
slidenoteGuardian.prototype.exportPresentation = async function(destination, presentationdiv){
  var password = await this.passwordPrompt("Choose a Password for the Presentation", "exportCMS", true);
  if(destination==="filesystem")this.preparePresentationForFilesystem(presentationdiv);
  var presentationstring = '<div class="'+presentationdiv.classList.toString()+'">'+
                            presentationdiv.innerHTML + "</div>";
  if(destination==="cms"){
    presentationstring = slidenote.textarea.value;
    presentationstring += "§§§€€€€€IMAGEBLOCK€€€€€§§§";
    presentationstring += slidenote.base64images.allImagesAsString();
  }
  var encResult = await this.encryptForExport(presentationstring, password);
  var encString = this.encBufferToString(encResult);
  this.uploadRestObject.encpresentation = encString;
  if(destination==="cms"){
    this.uploadRestObject.title = encResult.filename;
    var payloadobj = this.prepareDrupal7Rest("presentation");
    console.log("object prepared. uploading to cms:");
    console.log(payloadobj);
    this.exportPresentationToRest(payloadobj.payload);
  }else if(destination==="cmsold"){
    this.uploadRestObject.title = encResult.filename;
    console.log("prepare to upload and uploading to cms...");
    var payloadobj = this.prepareDrupal7Rest("presentationold");
    console.log(payloadobj);
    this.exportPresentationToRest(payloadobj.payload);
  }else if(destination==="filesystem"){
    this.exportPresentationToFilesystem(encString, true);
  }
}
/*
createNewSlidenote:
prepares a new slidenote, saves it to the cms,
then loads it to the browser by redirecting to the url of the
new slidenote
*/
slidenoteGuardian.prototype.createNewSlidenote = async function(){
  document.getElementById("slidenotediv").style.display = "none";
  var payloadobj = this.prepareDrupal7Rest("new slidenote");
  console.log(payloadobj);
  var payload=payloadobj.payload;
  console.log("start creating new slidenote");
  if(!this.restToken){
    console.log("Rest-Token not set yet... getting Token and try again...");
    this.getRestToken("save"); //has to be with await
    return; //return and wait for next save till we can await
  }
  var postReq= new XMLHttpRequest();
  postReq.addEventListener("load",function(){
    //slidenoteguardian.resolve=this;
    console.log("new export-resolve");
    console.log(this);
    if(this.statusText==="Created"){
      var respobj = JSON.parse(this.response);
      if(window.location.href.indexOf(".htm?")>-1){
        let nid = respobj.uri.substring(respobj.uri.lastIndexOf("/")+1);
        if(nid)window.location.search = "id="+nid;
      }else{
        window.location.href=respobj.uri;
      }
    }

  });
  var nid;
  if(this.restObject && this.restObject.nid)nid=this.restObject.nid;
  else window.location.href="/editor/newnote";
  postReq.open("POST","/node/"+nid); //node/nid needs to be of type slidenote to work
  postReq.setRequestHeader("CONTENT-TYPE","application/json");
  postReq.setRequestHeader('X-CSRF-TOKEN', this.restToken);

  //putReq.withCredentials = true;
  postReq.send(payload);
  console.log("sending payload");
  console.log(postReq);

}

/* prepareDrupal7Rest:
prepares the uploadobject to be uploaded via rest to drupal 7
*/
slidenoteGuardian.prototype.prepareDrupal7Rest = function(mode){
  var path;
  var payloadobj = {};
  if(this.restObject &&
    this.restObject.drupal7 &&
    this.restObject.drupal7.nid){
      path = "/node/"+this.restObject.drupal7.nid;
      payloadobj = {
        nid:this.restObject.drupal7.nid
      }
    }
  if(mode=="text"){
    payloadobj.field_encryptednote = this.uploadRestObject.encnote;
    payloadobj.field_notehash=this.uploadRestObject.notehash;
    if(slidenoteguardian.notetitle != this.restObject.title){
      payloadobj.title = this.notetitle;
    }
  }else if(mode==="image"){
    payloadobj.field_encryptednote = this.uploadRestObject.encnote;
    payloadobj.field_notehash=this.uploadRestObject.notehash;
    payloadobj.field_encimages= this.uploadRestObject.encimg;
    payloadobj.field_imageshash=this.uploadRestObject.imagehash;
  }else if(mode ==="images"){
      payloadobj.field_encryptednote = this.uploadRestObject.encnote;
      payloadobj.field_notehash=this.uploadRestObject.notehash;
      payloadobj.field_imagemeta = this.uploadRestObject.encimgmeta;
      payloadobj.field_encimgdelete = this.uploadRestObject.deleteImageHashes;
      /*var imgupload = "";
      for(var x=0;x<this.uploadRestObject.encimages.length;x++){
        var act=this.uploadRestObject.encimages[x];
        if(act)imgupload+=act + "\n";
      }
      payloadobj.field_encimgupload = imgupload;*/
      //payloadobj.field_encimgupload = this.uploadRestObject.uploadImageString;
      if(this.uploadRestObject.encimages)payloadobj.field_encimgupload = this.uploadRestObject.encimages.join("\n")+"\n";
  }else if(mode==="presentation"){
    path = "/node/";
    let options = this.saveConfig();
    console.log(options);
    payloadobj = {
      type:"slidenotepresentation",
      title: this.uploadRestObject.title,
      field_encryptednote: this.uploadRestObject.encpresentation,
      field_optionstring: options,
      field_slidenotenode: this.restObject.drupal7.nid,
      author: this.restObject.author
    }
  }else if(mode==="new slidenote"){
    path="/node";
    let options = this.saveConfig();
    payloadobj = {
      type:"slidenote",
      title:"€€€new slidenote€€€",
      //field_optionstring: options,
      author: this.restObject.author
    }
  }
  else if(mode==="presentationold"){
    path = "/node/";
    let cssblock = this.createCssBlock();
    payloadobj = {
      type:"presentation",
      title: this.uploadRestObject.title,
      field_encpresentation: this.uploadRestObject.encpresentation,
    //  field_description:"PIPPO",
      field_slidenotenode: this.restObject.drupal7.nid,
      field_cssblock: cssblock
    }
    payloadobj.author = this.restObject.author;

  } else if(mode==="presentationUpdate"){
    payloadobj.field_encpresentation = "TEST";//this.uploadRestObject.encpresentation;
  } else if(mode==="presentationEntityUpdate"){
    payloadobj.field_presentations = new Array();
    for(var px=0;px<this.restObject.exportedPresentations.length;px++){
      if(this.restObject.exportedPresentations[px].id!="")
      payloadobj.field_presentations.push({id:this.restObject.exportedPresentations[px].id});
    }
  }
  console.log("Json-stringify payload object:");
  console.log(payloadobj);
  var payload = JSON.stringify(payloadobj);
  return{path:path,payload:payload};
}

/*
to export presentations the presentation has to be fully created.
after presentation is created this function is called:
*/
slidenoteGuardian.prototype.exportIsReady = function(presdiv){
  console.log("export is ready to:"+this.exportPresentationDestination);
  if(this.exportPresentationDestination==="unencrypted"){
    this.preparePresentationForFilesystem(presdiv);
    this.exportPresentationToFilesystem(presdiv.innerHTML, false);
  }else{
    this.exportPresentation(this.exportPresentationDestination, presdiv);
  }
  this.exportPresentationDestination = undefined;
  slidenote.presentation.showpresentation();//hide exported-Presentation and return into editormode
}

slidenoteGuardian.prototype.exportPresentationToCMS = function(){
  this.exportPresentationDestination ="cms";
  console.log("start exporting to cms");
  slidenote.presentation.showpresentation(true);
}
slidenoteGuardian.prototype.exportPresentationLocal = function(encrypted){
  if(encrypted)this.exportPresentationDestination = "filesystem";
  if(!encrypted)this.exportPresentationDestination = "unencrypted";
  console.log("start exporting to filesystem");
  slidenote.presentation.showpresentation(true); //create a new presentation
}

slidenoteGuardian.prototype.preparePresentationForFilesystem = function(presentationdiv){
  var pages = presentationdiv.getElementsByClassName("ppage");
  for(var x=0;x<pages.length;x++){
    var page = pages[x];
    var id = "slide"+x;
    var nav = document.createElement("div");
    //nav.style.position = "fixed";
    //nav.style.bottom = 0;
    //nav.style.width = "100vw";
    nav.classList.add("controlarea");
    var backlink = document.createElement("a");
    if(x>0)backlink.href="#slide"+(x-1);
    backlink.innerText="last slide";
    var forwlink = document.createElement("a");
    backlink.classList.add("controlbutton");
    if(x<pages.length-1)forwlink.href="#slide"+(x+1);
    forwlink.innerText = "next slide";
    forwlink.classList.add("controlbutton");
    nav.appendChild(backlink);
    nav.appendChild(forwlink);
    page.appendChild(nav);
    page.id=id;
    page.classList.remove("active");
  }//for-to
}

slidenoteGuardian.prototype.exportPresentationToFilesystem = function(presstring, encrypted){
  //get css-codes from all active themes:
  /*
  var allactivethemes = ""; //holds names of all active themes
  for(var x=0;x<slidenote.extensions.themes.length;x++){
    var acttheme=slidenote.extensions.themes[x];
    if(acttheme.active)allactivethemes+=acttheme.classname+";";
  }*/
  var cssblock = this.createCssBlock();
  cssblock+= "\ndiv.ppage{visibility:hidden;}"+
            " \ndiv.ppage:target{visibility:visible;}"+
            "\n.blocks div.ppage.active{visibility:hidden;}"+
            "\n#slide0{visibility:visible;z-Index:1} .ppage{z-index:2}";
  var headerhtml = '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>a slidenote presentation</title></head>';
  if(encrypted)headerhtml+='<body onload="slidenoteguardian.decryptPresentation()">'; else headerhtml+="<body>";
  var bodyhtmlbefore = '<div id="slidenotediv" class="'+slidenote.presentation.presentation.classList.toString()+'"><div id="slidenotepresentation">';
  var bodypresentation = "";
  if(!encrypted)bodypresentation = presstring;
  var bodyhtmlafter = '</div></div>';
  var bodyend ='</body></html>';
  var jsblock = "";
  if(encrypted){
    jsblock = "encslidenote = {encBufferString:'"+presstring +
                "', ivlength:"+this.ivlength+
                "}\n";

    for(var jsx = 0;jsx<this.jsfilesForExport.length;jsx++)jsblock += this.jsfilesForExport[jsx].jscode;
  }else{
    for(var jsx = 0;jsx<this.jsfilesForExport.length;jsx++)if(this.jsfilesForExport[jsx].name==="slidenoteplayermini.js")jsblock += this.jsfilesForExport[jsx].jscode;
  }
  var passwordprompt =  "";
  if(encrypted)passwordprompt = document.getElementById("slidenoteGuardianPasswordPromptStore").innerHTML;

  var result = headerhtml+
              "<style>"+ cssblock + "</style>"+
              bodyhtmlbefore+
              bodypresentation +
              bodyhtmlafter+
              "<script>"+jsblock+"</script>"+
              '<div id="slidenoteGuardianPasswordPromptStore">'+passwordprompt+'</div>'+
              bodyend;

  this.exportToFilesystem(result, this.title+".html");
}

slidenoteGuardian.prototype.loadCssFromRest = function(){

}


/* loadNote
loads the slidenote from destination
@param destination: from where to load (cms, local)
@param dontinsert: if we load it just for preview dont insert it into textarea
*/
slidenoteGuardian.prototype.loadNote = async function(destination, dontinsert){
    //loads Note from cmsArea or from local destination
    //destination is "cms" or "local"
    if(destination==="cms"){
      if(!this.hascmsconnection)return;
      //first thing to do is get the fields right:
      //this.getCMSFields();
      if(this.cmsArea)this.encBufferString = this.cmsArea.value;
      if(typeof initial_note!="undefined")this.encBufferString = initial_note.encnote;
      //this.encImageString = this.cmsImages.value;
    }else if(destination==="local"){
      this.encBufferString = this.localstorage.getItem('cryptnote');
    }
    if(this.encBufferString===null || this.encBufferString===undefined || this.encBufferString.length===0){
      console.log("no buffer-string found, aborting load-note");
      return;
    }
    //getting iv of string:
    let iv = new Uint8Array(this.ivlength); //create empty ivarray
    for(let i=0;i<this.ivlength;i++)iv[i]=this.encBufferString.charCodeAt(i)-255;
    this.iv = iv;
    this.encBufferString = this.encBufferString.substring(this.ivlength);//delete iv-chars from string
    let buffer = new Uint8Array(this.encBufferString.length);
    for(let i=0;i<this.encBufferString.length;i++)buffer[i]=this.encBufferString.charCodeAt(i)-255;
    //this.encTextBuffer = buffer.buffer; //changing to ArrayBuffer -- TODO:kann weg oder?
    this.password = "";
    this.decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
    if(this.decText === "decryption has failed"){
      this.password = undefined;
      this.decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer
    }
    //console.log("decryption fail:"+this.decText);
    //error-handling - try again:
    var decfaileddialogoptions = {
      type:"confirm",
      title:"decryption failed - wrong password!",
      content: "decryption failed. try it again?",
      confirmbutton: "try again",
      cancelbutton: "cancel", //delete slidenote
      /*closefunction: function(){
        var nid = slidenoteguardian.restObject.nid;
        if(!nid)return;
        slidenoteguardian.deleteFromRest("/node/"+nid, function(){
          window.location.href="/editor";
        });
      }*/
    };
    //while(this.decText === "decryption has failed" && confirm("decryption failed. try it again?")){
    while(this.decText === "decryption has failed" && await dialoger.confirm(decfaileddialogoptions)){
        this.decText = await this.decrypt(buffer.buffer, this.iv); //decrypt ArrayBuffer anew
    }
    if(this.decText === "decryption has failed"){

      var errl = document.getElementById("texteditorerrorlayer");
      var instext = this.encBufferString.substring(0,4000);
      if(instext.length<4000){
        while(instext.length<4000)instext+=instext+"|";
      }
      var encspan = document.createElement("span");
      instext = begintext + instext;
      encspan.innerText =instext;
      var begintext = "<span>opening file &quot;"+slidenoteguardian.notetitle+"&quot; --- done</span><br>";
      begintext += "<span>please input password: *******</span><br>";
      begintext += "<span>trying to decrypt slidenote ---  error</span><br>";
      begintext += "<span>please click to try again</span><br><br>";
      begintext += "<span>loaded file:</span><br>";
      errl.innerHTML = begintext;
      errl.appendChild(encspan);
      errl.onclick = function(){
        errl.style.overflow = null;
        errl.style.wordBreak= null;
        errl.style.backgroundRepeat= null;
        errl.style.backgroundSize= null;
        errl.style.background = null;
        document.getElementById("slidenoteloadingscreenwrapper").style.display = null;
        var slidenotediv = document.getElementById("slidenotediv")
        slidenotediv.classList.add("initial");
        slidenotediv.classList.add("midstate");
        slidenotediv.classList.remove("abortedDecryption");
        slidenote.textarea.style.display = null;
        slidenoteguardian.loadNote("cms");
      }
      slidenote.textarea.style.display = "none";
      errl.style.background = "url(images/schloss-rot.png)";
      errl.style.overflow= "hidden";
      errl.style.wordBreak= "break-all";
      errl.style.backgroundRepeat= "no-repeat";
      errl.style.backgroundSize= "contain";
      document.getElementById("slidenoteloadingscreenwrapper").style.display = "none";
      var slidenotediv = document.getElementById("slidenotediv")
      slidenotediv.classList.remove("initial");
      slidenotediv.classList.remove("midstate");
      slidenotediv.classList.add("abortedDecryption");
      return; //password wrong, abort the load
    }
    console.log("decryption ended succesfully:"+this.decText.substring(0,20));
    if(dontinsert)return this.decText;
    this.slidenote.textarea.value = this.decText; //putting result into textarea
    //loading images:
    let imgstring;
    if(destination==="cms"){
      if(this.cmsImages)imgstring = this.cmsImages.value;
      else if(typeof initial_note!="undefined" && initial_note.encimgmeta){
        //imgstring = initial_note.encimg;
        imgstring = await this.decryptText(initial_note.encimgmeta);
        initial_note.imgmeta = imgstring;
        for(var i=0;i<initial_note.encimages.length;i++){
          let acthash = initial_note.encimages[i].substring(0,initial_note.encimages[i].indexOf(">>>"));
          let actimg = initial_note.encimages[i].substring(acthash.length+3);
          actimg = await this.decryptText(actimg);
          imgstring = imgstring.replace(acthash,actimg);
        }
        slidenote.base64images.loadImageString(imgstring);
        imgstring = undefined;
      }
    }
    if(destination==="local")imgstring = this.localstorage.getItem('cryptimagestring');
    if(imgstring != undefined && imgstring.length>0){
      //images sind vorhanden - TODO: check ob images bereits geladen sind mittels timestamp
      this.encImageString = imgstring;
      await this.loadImages(destination);

    }
    //cleaning up:
    this.slidenote.parseneu(); //let wysiwyg-editor notice change
    this.slidenote.textarea.blur();
    this.slidenote.textarea.focus(); //focus on textarea for further editing
    //start animation
    this.startEditorAnimation();
    slidenote.base64images.rebuildOldImages();
    if(this.password==="" && !this.localstorage.getItem("dontBotherOnEmptyPassword")){
      setTimeout(function(){
        //show dialog after Editor is loaded and password is empty:
        var dialogoptions = {
          type:"confirm",
          title:"missing password",
          content:"Your slidenote is not protected with a password. Do you want to set a password now?",
          confirmbutton:"yes",
          cancelbutton:"no"
        };
        var dontarea = document.createElement("div");
        var dontl = document.createElement("label");
        dontl.innerText = "Don't remind me again";
        var dontbother = document.createElement("input");
        dontbother.type = "checkbox";
        dontbother.onchange = function(){
          slidenoteguardian.localstorage.setItem("dontBotherOnEmptyPassword", this.checked);
        };
        dontarea.appendChild(dontbother);
        dontarea.appendChild(dontl);
        dontarea.classList.add("dontbotherarea");
        dialogoptions.afterButtonArea = dontarea;
        var dialog = dialoger.buildDialog(dialogoptions, function(){
          document.getElementById("changepasswordbutton").click();
        });

      },3100);
    }
};

/* startEditorAnimation
shows the animation after loading is finished:
*/
slidenoteGuardian.prototype.startEditorAnimation = function(){
  var loadingscreen = document.getElementById("slidenoteloadingscreenwrapper");
  var slidenotediv = document.getElementById("slidenotediv");
  if(loadingscreen){
    loadingscreen.classList.remove("midstate");
    slidenotediv.classList.remove("midstate");
    loadingscreen.classList.add("endstate");
    slidenotediv.classList.add("endstate");
    setTimeout(function(){
      var loadsc = document.getElementById("slidenoteloadingscreenwrapper");
      loadsc.parentElement.removeChild(loadsc);
      var pwprompt = document.getElementById("slidenoteGuardianPasswordPromptTemplate");
      pwprompt.classList.remove("initial");
      document.getElementById("slidenotediv").classList.remove("initial");
      document.getElementById("slidenotediv").classList.remove("endstate");
      document.getElementById("slidenotediv").classList.remove("midstate");
      slidenote.textarea.focus();
    },3000);
  }
};

/* saveNote
saves the slidenote to destination (local, cms)
*/
slidenoteGuardian.prototype.saveNote = async function(destination){
  var restObject = this.restObject;
  if(!this.initialised)return;
  if(destination==="cms"&&!this.hascmsconnection)return;
  if(destination==="local" && !slidenote.extensions.allThemesLoaded)return;
  if(slidenote ===undefined || this.slidenote.base64images ===undefined)return;
  var starttime = new Date().getTime();
  console.log("starting save note to destination "+destination);
  console.log("saving to somewhere?"+this.savingtoDestination);
  if(this.savingtoDestination!=undefined){
    //setTimeout("slidenoteguardian.saveNote('"+destination+"')",100);
    return;
  }
  this.savingtoDestination = destination;
  //saves Note to cmsArea -> CMS or to local destination
  //destination is cms, filesystem or local - will be encrypted nevertheless
  if(document.getElementById("slidenoteGuardianPasswortPrompt")!=null)return;
  let slidenotetext = this.slidenote.textarea.value;
  console.log("encrypting slidenote:"+slidenotetext.substring(0,300));
  let encResult;
  if(destination ==="filesystem"){
    let exportpw;
    if(slidenote.editormodus==="basic-mode")exportpw="";
    let exportstring = slidenotetext +
                        "\n||€€imagepart€€||\n" +
                      this.slidenote.base64images.allImagesAsString();
     encResult = await this.encryptForExport(exportstring,exportpw);
  }else{
    try{
      encResult = await this.encrypt(slidenotetext);
    }catch(err){
      console.log(err);
    }
  }
  let result = this.encBufferToString(encResult);
  //save Images:
  let encimgstring="";
  let newimghash="";
  var imghash = null;
  if(this.slidenote.base64images.notempty()){
    if(destination ==="cms"){
      //first get the fields right:
      //this.getCMSFields();
      //slidenote has images - check if already saved:
      //newimghash = await this.hash(this.slidenote.base64images.allImagesAsString());
      //if(this.restObject.imagehash!=newimghash){//this.cmsImagesHash.value != newimghash){
      //  console.log("save images with hash:"+newimghash);
        if(!this.isencryptingimages){
          console.log("its not encrypting images so start preparing:");
          this.isencryptingimages = true;
          //encimgstring = await this.encryptImages(); //encrypt imagestring
          //this.uploadRestObject.imagehash = newimghash; //this.cmsImagesHash.value = newimghash; //send new hash to cms
          //above: old part down: new part
          var b64imor = slidenote.base64images.base64images;
          var b64meta = slidenote.base64images.allImagesAsString();
          var b64hashes = new Array(); var b64images = new Array();
          for(var x=0;x<b64imor.length;x++){
              var b64im=b64imor[x];
              if(b64im.hash===undefined)b64im.hash = await this.hash(b64im.base64url);
              if(b64im.encrypt===undefined)b64im.encrypt = await this.encryptText(b64im.base64url);
              b64meta = b64meta.replace(b64im.base64url,b64im.hash);
              b64hashes.push(b64im.hash);
              b64images.push(b64im.encrypt);
          }

          this.isencryptingimages = false; //allow further encrypting
          var enctime = new Date().getTime() - starttime;
          console.log("Timecheck: encrypted imgstring in "+enctime+"Ms");
        }else{
          console.log("still encrypting images - do nothing");

          return;
        }
      //} else{
      //  console.log("images did not change:"+newimghash);
      //}
    }else if(destination==="local"){
      //saving images to localStorage - TODO: do we want to check if already saved? Yes, because it can be quite bothersome to wait!
      imghash = await this.hash(this.slidenote.base64images.allImagesAsString());
      if(imghash != this.localstorage.getItem("imghash")){
        encimgstring = await this.encryptImages();
      }else {imghash = null;}
    }
  }
  if(destination ==="cms"){
    //first get the fields right:
    //this.getCMSFields();
    //this.cmsSlidenoteHash.value = await this.hash(slidenotetext); //putting hash into cms
    //this.cmsArea.value= result; //putting it in textarea of cms
    //----old://if(imagestring.length>0)this.cmsImages.value = ivstring+imagestring;
    if(this.uploadRestObject.inprogress)return; //do only try to save once at a time
    this.uploadRestObject = {inprogress:true};
    this.uploadRestObject.notehash = await this.hash(slidenotetext); //putting into rest-object
    this.uploadRestObject.encnote = result;
    var savestatus = document.getElementById("savestatus")
    if(savestatus){
      savestatus.src=slidenote.imagespath+"buttons/cloudupload.gif";
      savestatus.title="saving note into cloud";
    }
    var cloudbutton = document.getElementById("cloud");
    var classList = cloudbutton.classList;
    while (classList.length > 0) {
      classList.remove(classList.item(0));
    }
    cloudbutton.classList.add("status-syncing");



    var drupal7prepare = this.prepareDrupal7Rest("text");
    //TODO: images? new part:
    //check if we have to save:
    if(b64meta && restObject.reencrypt){
      //reencrypt all images:
      restObject.reencrypt = undefined;
      this.uploadRestObject.deleteImageHashes = "all";
      this.uploadRestObject.encimgmeta = await this.encryptText(b64meta);
      this.uploadRestObject.deletedencimages =  new Array();
      for(var dx=0;dx<restObject.encimages.length;dx++)this.uploadRestObject.deletedencimages.push(restObject.encimages[dx]);
      this.uploadRestObject.encimages = new Array();
      for(var x=0;x<b64hashes.length;x++){
          this.uploadRestObject.encimages.push(b64hashes[x]+
            ">>>"+b64images[x]); //store it into upload Object
      }
      drupal7prepare = this.prepareDrupal7Rest("images");

    }else if(b64meta === undefined && restObject.encimages.length>0){
      //delete all images in rest:
      this.uploadRestObject.deleteImageHashes = "all";
      this.uploadRestObject.encimgmeta = "";
      this.uploadRestObject.imgmeta ="";
      drupal7prepare = this.prepareDrupal7Rest("images");
      var deletedimages = [];
      for(var dx=0;dx<this.restObject.encimages.length;dx++){
        deletedimages.push(this.restObject.encimages[dx]);
      }
      this.uploadRestObject.deletedencimages = deletedimages;
    }else if(b64meta != undefined && restObject.imgmeta != b64meta){
        this.uploadRestObject.encimgmeta = await this.encryptText(b64meta);
        this.uploadRestObject.imgmeta = b64meta;
        var deletedimages = new Array();
        //check free spaces:
        for(var x=restObject.encimages.length-1;x>=0;x--){
            if(restObject.encimages[x]===undefined){
              restObject.encimages.splice(x,1);
              continue;
            }
            console.log(x+": type:"+typeof restObject.encimages[x]);
            if(typeof restObject.encimages[x]!="string"){
              console.log(restObject.encimages[x]);
              continue;
            }
            var acthash = restObject.encimages[x].substring(0,restObject.encimages[x].indexOf(">>>"));
            var posinar = b64hashes.indexOf(acthash);
            if(posinar>=0){
                b64hashes.splice(posinar,1);
                b64images.splice(posinar,1);
            }else{
                deletedimages.push(restObject.encimages[x]);
                //restObject.encimages[x] = undefined; //deleted on local side
                //restObject.encimages.splice(x,1); //delete on local side
            }
        }
        this.uploadRestObject.encimages = [];
        for(var x=0;x<b64hashes.length;x++){
            this.uploadRestObject.encimages.push(b64hashes[x]+
              ">>>"+b64images[x]); //store it into upload Object

        }
        this.uploadRestObject.deleteImageHashes = "";
        this.uploadRestObject.deletedencimages = deletedimages;
        for(var x=0;x<deletedimages.length;x++){
          this.uploadRestObject.deleteImageHashes += deletedimages[x].substring(0,deletedimages[x].indexOf(">>>"));
          this.uploadRestObject.deleteImageHashes += "\n";

        }
        //if(b64hashes.length>0){
            //exception: server-space is full
        //}
        drupal7prepare = this.prepareDrupal7Rest("images");
    }
    //oldpart:
    if(encimgstring!=""){
      var starttimecopy = new Date().getTime();
      //this.cmsImages.value=encimgstring; //dont do it for test purpose
      this.uploadRestObject.encimg = encimgstring;
      this.uploadRestObject.imagehash = newimghash;
      var endtimecopy = new Date().getTime();
      var usedtimecopy = endtimecopy - starttimecopy;
      console.log("Timecheck: Copied imagestring with length "+encimgstring.length+" in "+usedtimecopy+"Ms");
      //this.sendToCMS("images"); //cant do that like this? because copy is async?
      drupal7prepare = this.prepareDrupal7Rest("image");
      //await this.saveToRest(drupal7prepare.path, drupal7prepare.payload);

    }
    //TODO: sending result to CMS
    //this.sendToCMS("note");

    console.log("saving to cms drupal7:"+drupal7prepare.path);
    console.log(JSON.parse(drupal7prepare.payload));
    this.saveToRest(drupal7prepare.path,drupal7prepare.payload);
  }else if(destination==="local"){
    //TODO: testing max-size of local storage
    this.localstorage.setItem('cryptnote',result); //saving it to local storage
    //this.localstorage.setItem('cryptnote'+this.notetitle,result); //new approach with multiple notes
    this.localstorage.setItem('title',this.notetitle); //can be deleted in future
    this.localstorage.setItem('url',window.location.href);
    //let titles = this.localstorage.getItem("notetitles"); //multiple notes can be saved
    //if(titles===null)titles=this.notetitle;
    //if(titles.indexOf(this.notetitle)===-1)titles+="#|#"+this.notetitle;

    if(imghash!=null){
      this.localstorage.setItem('cryptimagestring',encimgstring); //TODO: posibility to store images separately
      this.localstorage.setItem('imghash',imghash); //TODO: posibility to store images separately
    }
    let notehash = await this.hash(slidenotetext);
    this.localstorage.setItem("slidenotehash", notehash);
    //check if version is saved to cms, else saved is false:
    var savedToCMS = false;
    //check if hashes are the same::
    savedToCMS = (notehash === this.restObject.notehash);
    //console.log("saved or not saved in cms?"+ "\n note-check:"+(result===this.restObject.encnote)+ "\n hash-check:"+(notehash === this.restObject.notehash));
    this.localstorage.setItem("saved", savedToCMS);
    this.localstorage.setItem("url",window.location.href);
    this.savingtoDestination = undefined;

  }else if(destination ==="filesystem"){
    //export/save it to the local filesystem
    let exportstring = result;
    let exportfilename = this.notetitle+".slidenote";
    if(encResult.filename){
      exportfilename=encResult.filename;
      if(exportfilename.substring(exportfilename.length-10)!=".slidenote")exportfilename+=".slidenote";
    }
    this.exportToFilesystem(exportstring, exportfilename);
    this.savingtoDestination = undefined;
  }
  var endtime = new Date().getTime();
  var usedtime = endtime - starttime;
  console.log("Timecheck: saved node to destination "+destination+" in"+usedtime+"Ms");

}

slidenoteGuardian.prototype.exportToFilesystem = function(exportstring, exportfilename){
  //TODO: Check if saveAs supported. If not bounce exportstring to server
  let blob = new Blob([exportstring],{type:"text/plain;charset=utf-8"});
  saveAs(blob, exportfilename);
}

slidenoteGuardian.prototype.loadImages = async function(destination){
  //image-part:
  let encimagestring = this.encImageString.substring(0);
  //console.log("load Images" + encimagestring.substring(this.ivlength,30));
  if(encimagestring.length>0){
    //getting iv out of the string
    let imgiv = new Uint8Array(this.ivlength);
    for(let iiv=0;iiv<this.ivlength;iiv++)imgiv[iiv]=encimagestring.charCodeAt(iiv)-255;
    //this.imgiv = imgiv;
    encimagestring = encimagestring.substring(this.ivlength); //delete iv-chars
    let imgbuffer = new Uint8Array(encimagestring.length);
    for(let im=0;im<imgbuffer.length;im++)imgbuffer[im]=encimagestring.charCodeAt(im)-255;
    let decImageString = await this.decrypt(imgbuffer.buffer, imgiv); //decrypt imgbuffer
    this.slidenote.base64images.loadImageString(decImageString); //send it to slidenote

  }
};

slidenoteGuardian.prototype.decryptText = async function(txt){
  //image-part:
  let encimagestring = txt;
  //console.log("load Images" + encimagestring.substring(this.ivlength,30));
  if(encimagestring.length>0){
    //getting iv out of the string
    let imgiv = new Uint8Array(this.ivlength);
    for(let iiv=0;iiv<this.ivlength;iiv++)imgiv[iiv]=encimagestring.charCodeAt(iiv)-255;
    //this.imgiv = imgiv;
    encimagestring = encimagestring.substring(this.ivlength); //delete iv-chars
    let imgbuffer = new Uint8Array(encimagestring.length);
    for(let im=0;im<imgbuffer.length;im++)imgbuffer[im]=encimagestring.charCodeAt(im)-255;
    let decodedString = await this.decrypt(imgbuffer.buffer, imgiv); //decrypt imgbuffer
    return decodedString; //send it to slidenote

  }
};


//old: can be removed in the future:
slidenoteGuardian.prototype.encryptImages = async function(){
  //now the images:
  let imagestring="";
  //console.log("save Imagestring:"+this.slidenote.base64images.allImagesAsString());
  if(this.slidenote.base64images.base64images.length>0){ //muss diese abfrage überhaupt hier sein?
    let encResult = await this.encrypt(this.slidenote.base64images.allImagesAsString());
    let imageBuffer = encResult.encbuffer;
    for(let i=0;i<encResult.iv.length;i++)imagestring+=String.fromCharCode(encResult.iv[i]+255);
    let imageutf8 = new Uint8Array(imageBuffer);
    for(let i=0;i<imageutf8.length;i++)imagestring+=String.fromCharCode(imageutf8[i]+255);
    return imagestring;
  } else{
    return "";
  }
};

slidenoteGuardian.prototype.encryptImage = async function(base64image){
  //now the images:
  let imagestring="";
  imagestring += await this.hash(base64image.base64url);
  base64image.hash = imagestring;
  imagestring+=">>>";
  //console.log("save Imagestring:"+this.slidenote.base64images.allImagesAsString());
    let encResult = await this.encrypt(base64image.base64url);
    let imageBuffer = encResult.encbuffer;
    for(let i=0;i<encResult.iv.length;i++)imagestring+=String.fromCharCode(encResult.iv[i]+255);
    let imageutf8 = new Uint8Array(imageBuffer);
    for(let i=0;i<imageutf8.length;i++)imagestring+=String.fromCharCode(imageutf8[i]+255);
    return imagestring;
};

slidenoteGuardian.prototype.encryptText = async function(txt){
    var imagestring="";
    let encResult = await this.encrypt(txt);
    let imageBuffer = encResult.encbuffer;
    for(let i=0;i<encResult.iv.length;i++)imagestring+=String.fromCharCode(encResult.iv[i]+255);
    let imageutf8 = new Uint8Array(imageBuffer);
    for(let i=0;i<imageutf8.length;i++)imagestring+=String.fromCharCode(imageutf8[i]+255);
    return imagestring;
};

slidenoteGuardian.prototype.loadConfig = async function(destination){
    //new loadnote with JSON
    //loads Config from configarea or from local destination
    //destination is cms or local
    var savedConfigString;
    //if(destination==="cms")savedConfigString = this.cmsConfig.value;
    if(destination==="local")savedConfigString = this.localstorage.getItem('config'); //this means config by slidenote?
    if(slidenote==null){
      setTimeout("slidenoteguardian.loadConfig("+destination+")",2000);
      return;
    }
  var saveobject;
  try {
  saveobject = JSON.parse(savedConfigString);
  }catch{
  //load old config style? naa, just delete it...
    console.log("old config found");
    this.loadConfigOld(destination);
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
  //choose editor:
  slidenote.choseEditor(saveobject.editorchoice);
  if(saveobject.nightmode){
      var toggler = document.getElementById("nightmodetoggle");
      toggler.classList.remove("off");
      toggler.classList.add("on");
      document.body.classList.add("nightmode");
  }

  //keyboardshortcuts:
  if(slidenote.keyboardshortcuts && saveobject.keyboardmap){
      slidenote.keyboardshortcuts.loadConfigString(saveobject.keyboardmap);
  }

  //load themes-config:
  for(var x=0;x<saveobject.themeConfigs.length;x++){
      var theme = slidenote.extensions.getThemeByName(saveobject.activethemes[x]);
      theme.loadConfigString(saveobject.themeConfigs[x]);
  }
}

slidenoteGuardian.prototype.saveConfig = function(destination){
  //if not initialised slidenoteguardian - return:
  if(!this.initialised)return;
  //saveconfig with JSON instead of manual - slower and more overhead, but more flexible for the future:
  var saveobject = {};
  //var themes = new Array();
  saveobject.activethemes = new Array();
  saveobject.themeConfigs = new Array();
  for(var x=0;x<slidenote.extensions.themes.length;x++){
      var theme = slidenote.extensions.themes[x];
      if(theme.active){
   //      themes.push(theme);
       saveobject.activethemes.push(theme.classname);
       saveobject.themeConfigs.push(theme.saveConfigString());
      }
  }

  saveobject.editorchoice = document.getElementById("editorchoice").value;
  saveobject.nightmode = document.body.classList.contains("nightmode");
  if(slidenote.keyboardshortcuts){
      saveobject.keyboardmap = slidenote.keyboardshortcuts.configString();
  }
  console.log(saveobject);
  var stringToSave = JSON.stringify(saveobject);
    if(destination==="local"){
      this.localstorage.setItem("config",stringToSave);
      console.log("saved to local:"+stringToSave);
    }
  return stringToSave;

}
slidenoteGuardian.prototype.loadConfigOld = async function(destination){
  //loads Config from configarea or from local destination
  //destination is cms or local
  var savedConfigString;
  //this.getCMSFields();
  if(destination==="cms")savedConfigString = this.cmsConfig.value;
  if(destination==="local")savedConfigString = this.localstorage.getItem('config');
  if(slidenote==null){
    setTimeout("slidenoteguardian.loadConfig("+destination+")",2000);
    return;
  }
  //load Themes:
  console.log("load configString:"+savedConfigString);
  var themes = new Array(); //only active themes
  var actthemesstring = savedConfigString.substring(0,savedConfigString.indexOf("$$"));
  var actthemenames = actthemesstring.split(";");
  //check if Theme allready loaded - if not, load anew:
  //check if Theme allready added to themes, if not await:
  var addedthemes="";
  for(var x=0;x<slidenote.extensions.themes.length;x++)addedthemes+=slidenote.extensions.themes[x].classname;

  for(var x=0;x<slidenote.extensions.themes.length;x++){
    var act = slidenote.extensions.themes[x];
    if(actthemesstring.indexOf(act.classname)>=0){
      if(!act.active)slidenote.extensions.changeThemeStatus(x,true);
      themes.push(act);
    }else{
      slidenote.extensions.changeThemeStatus(x,false);
    }
  }
  //Choose Editor:
  var editorchoiceString = savedConfigString.substring(savedConfigString.indexOf("$$")+2,savedConfigString.indexOf("€€"));
  slidenote.choseEditor(editorchoiceString);
  console.log("choseeditor:"+editorchoiceString);

  //Nightmode yes or no?
  var nightm = savedConfigString.substring(savedConfigString.indexOf("€€")+2,savedConfigString.indexOf("€$"));
  console.log("nightmode:"+nightm);
  if(nightm==="true"){
    var toggler = document.getElementById("nightmodetoggle");
    toggler.classList.remove("off");
    toggler.classList.add("on");
    document.getElementById("slidenotediv").classList.add("nightmode");
  }
  //keyboardshortcuts:
  if(slidenote.keyboardshortcuts && savedConfigString.indexOf("@@keyboardmap")>-1){
    var kbsc = savedConfigString.substring(
                savedConfigString.indexOf("@@keyboardmap@@")+"@@keyboardmap@@".length,
                savedConfigString.indexOf("@@keyboardmapend@@"));
    slidenote.keyboardshortcuts.loadConfigString(kbsc);
  }
  //load Themes-Config:
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
  }
}

slidenoteGuardian.prototype.saveConfigOld = function(destination){
  //saves configs to local destination or to cmsarea -> CMS
  //destination is cms or local
  var themes = new Array(); //only active themes
  var stringToSave = "";
  for(var x=0;x<slidenote.extensions.themes.length;x++){
        if(slidenote.extensions.themes[x].active){
          themes.push(slidenote.extensions.themes[x]); //collect active themes
          stringToSave+=slidenote.extensions.themes[x].classname+";";
        }
  }
  stringToSave+="$$";
  //stringToSave+="md-texteditor";
  stringToSave+=document.getElementById("editorchoice").value;
  stringToSave+="€€";
  var nightm = document.getElementById("nightmodetoggle").classList.contains("on");
  console.log("save nightmode:"+nightm);
  stringToSave+=nightm;
  stringToSave+="€$";
  stringToSave+="@@keyboardmap@@";
  if(slidenote.keyboardshortcuts){
    stringToSave+= slidenote.keyboardshortcuts.configString();
  }
  stringToSave+="@@keyboardmapend@@";

  for(var x=0;x<themes.length;x++){
	    var actConfigString = themes[x].saveConfigString();
	    if(actConfigString!=null){
		      stringToSave+="{["+themes[x].classname+"]}";
		        stringToSave+=actConfigString;
	    }
  }
  if(destination==="local"){
    this.localstorage.setItem("config",stringToSave);
    console.log("saved to local:"+stringToSave);
  }
  //return stringToSave;
  return stringToSave;
}
slidenoteGuardian.prototype.encrypt = async function(plaintext){
  console.log("encrypt plaintext:"+plaintext.substring(0,20));
    let plainTextUtf8 = new TextEncoder().encode(plaintext); //changing into UTF-8-Array
    let keyguardian = await this.createKey();
    if(keyguardian==null)return {encbuffer:null, iv:null};
    //this.iv = keyguardian.iv;
    let encbuffer = await crypto.subtle.encrypt(keyguardian.alg, keyguardian.key, plainTextUtf8);
    return {encbuffer: encbuffer, iv:keyguardian.iv};
    /*the job of encrypt is done - rest of code should be in save*/
}
slidenoteGuardian.prototype.decrypt = async function(buffer, iv){
  let pwtext = "as a matter of principle: everything you write is encrypted before we even store it on our server. please choose a password now. feel free to make one as simple or as complicated as you want. just don't forget it: there is no password recovery!";
  this.password = await this.passwordPrompt(pwtext, "decrypt");
  let keyguardian = await this.createKey(iv);
  console.log("decoding starts");
  //let encstatus = document.getElementById("encstatus");
  try{
    this.plainTextBuffer = await this.crypto.subtle.decrypt(keyguardian.alg, keyguardian.key, buffer);
  } catch(e){
    console.log(e);
    console.log("decryption has failed!");
    this.password = null; //reset password as it has no meaning
    //encstatus.src=slidenote.imagespath+"schloss-rot.png";
    //encstatus.title = "failed to decrypt note - wrong password";
    return "decryption has failed";
  }
  //encstatus.src=slidenote.imagespath+"schloss-gruen.png";
  //encstatus.title = "encryption works as expected - your data is secure";
  console.log("decoding has ended");

  return new TextDecoder().decode(this.plainTextBuffer); //TODO: error-handling
}

slidenoteGuardian.prototype.encryptForExport = async function(plaintext, password){
  console.log("encrypt plaintext:"+plaintext.substring(0,20));
    let plainTextUtf8 = new TextEncoder().encode(plaintext); //changing into UTF-8-Array
    let pw =  password;
    if(pw===null || pw===undefined)pw = await this.passwordPrompt("please type in password for export", "export", true);
    let filename = document.getElementById("username").value;
    let keyguardian = await this.createKey(null,pw); //create new key with no iv
    if(keyguardian==null)return {encbuffer:null, iv:null};
    //this.iv = keyguardian.iv;
    let encbuffer = await crypto.subtle.encrypt(keyguardian.alg, keyguardian.key, plainTextUtf8);
    return {encbuffer: encbuffer, iv:keyguardian.iv, filename:filename};
    /*the job of encryptForExport is done - rest of code should be in saveNote*/
}
slidenoteGuardian.prototype.decryptImport = async function(buffer, iv){
  let pw = "";
  let keyguardian = await this.createKey(iv, pw);
  console.log("decoding starts without pw");
  try{
    this.plainTextBuffer = await this.crypto.subtle.decrypt(keyguardian.alg, keyguardian.key, buffer);
  } catch(e){
    console.log(e);
    console.log("decryption without password has failed!");
    pw = await this.passwordPrompt("please type in password of import", "decrypt",true);
    keyguardian = await this.createKey(iv, pw);
    console.log("decoding starts");
    try{
      this.plainTextBuffer = await this.crypto.subtle.decrypt(keyguardian.alg, keyguardian.key, buffer);
    } catch(e){
      console.log(e);
      console.log("decryption has failed!");
      //this.password = null; //reset password as it has no meaning
      return "decryption has failed";
    }
  }
  console.log("decoding has ended");
  return new TextDecoder().decode(this.plainTextBuffer); //TODO: error-handling
}

slidenoteGuardian.prototype.importFromEncryptedFile = async function(encBufferString){
  let encstring = encBufferString;
  console.log("import of enc-file"+encstring);
  //getting iv of string:
  let iv = new Uint8Array(this.ivlength); //create empty ivarray
  for(let i=0;i<this.ivlength;i++)iv[i]=encBufferString.charCodeAt(i)-255;
  encstring = encBufferString.substring(this.ivlength);//delete iv-chars from string
  let buffer = new Uint8Array(encstring.length);
  for(let i=0;i<encstring.length;i++)buffer[i]=encstring.charCodeAt(i)-255;
  //this.encTextBuffer = buffer.buffer; //changing to ArrayBuffer -- TODO:kann weg oder?
  let decText = await this.decryptImport(buffer.buffer, iv); //decrypt ArrayBuffer
  //console.log("decryption fail:"+this.decText);
  console.log("decryption succesfull?" + decText);
  //error-handling - try again:
  while(decText === "decryption has failed" && confirm("decryption failed. try it again?")){
      decText = await this.decryptImport(buffer.buffer, iv); //decrypt ArrayBuffer anew
  }
  if(decText === "decryption has failed")return; //password wrong, abort the load
  //decText is now the unencrypted MD-Code plus imagestring:
  let MDCodeEnd = decText.indexOf("\n||€€imagepart€€||\n");
  console.log("decryption of import succesfull");
  let decMD;
  if(MDCodeEnd===-1)decMD = decText; else decMD = decText.substring(0,MDCodeEnd);
  console.log(MDCodeEnd + "MDCODEEND");
  console.log("decMD:"+decMD);
  let decImageString;
  if(MDCodeEnd>-1)decImageString = decText.substring(MDCodeEnd+19);//getting rid of ||€€imagepart€€||
  console.log("imagestring"+decImageString);
  this.insertImport(decMD, decImageString);
}



//helper functions - for internal use only:
slidenoteGuardian.prototype.encBufferToString = function(encResult){
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

slidenoteGuardian.prototype.insertImport = async function(mdcode, imagestring){
  if(slidenote.textarea.value.length<=1){
    slidenote.textarea.value = mdcode;
  } else{
    let userchoice = await this.importPrompt(mdcode, imagestring);
    let selend = slidenote.textarea.selectionEnd;
    if(userchoice ==='import'){
      slidenote.textarea.value= slidenote.textarea.value.substring(0,slidenote.textarea.selectionStart)+
         mdcode + slidenote.textarea.value.substring(slidenote.textarea.selectionEnd);
      slidenote.textarea.selectionEnd = selend+mdcode.length;
    }else if(userchoice ==="replace"){
      slidenote.textarea.value=mdcode;
      slidenote.base64images.deleteAllImages(); //empty array
    } else if(userchoice ==="chart"){
      slidenote.textarea.value=slidenote.textarea.value.substring(0,selend)+
                "\n```chart\n"+mdcode+"\n```\n"+slidenote.textarea.value.substring(selend);
    } else if(userchoice ==="table"){
      slidenote.textarea.value=slidenote.textarea.value.substring(0,selend)+
                "\n```table\n"+mdcode+"\n```\n"+slidenote.textarea.value.substring(selend);
    } else{ //user canceled
      //return;
    }

  }
  //reset fileuploadfield to get it anew:
  document.getElementById("importfile").value=null;

  if(imagestring)slidenote.base64images.loadImageString(imagestring);
  slidenote.parseneu();
  slidenote.textarea.focus();

}

slidenoteGuardian.prototype.hash = async function(text){
  let textutf8 = new TextEncoder().encode(text);
  let hash = new Uint8Array(await this.crypto.subtle.digest('SHA-256', textutf8));
  let result = "";
  for(let i=0;i<hash.length;i++)result+=String.fromCharCode(hash[i]+255);
  return result;
}

slidenoteGuardian.prototype.createKey = async function(iv, passw){
  console.log("creating Key with iv"+iv);
  let password = passw;
  if(this.password == null && passw==null){
    //this.password = prompt("please type in your personal password");
    let pwtext = "as a matter of principle: everything you write is encrypted before we even store it on our server. please choose a password now. feel free to make one as simple or as complicated as you want. just don't forget it: there is no password recovery!";
    this.password = await this.passwordPrompt(pwtext);
  }
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

slidenoteGuardian.prototype.getCMSFields = function(){
  console.log("dont do this anymore"); return;
  //get the cms-fields right. Test Style for slidenote.htm:
  //this.configArea = document.getElementById("configarea");
  this.cmsArea = document.getElementById("cmsarea");
  this.cmsImages = document.getElementById("cmsimages");
  this.cmsSlidenoteHash = document.getElementById("cmsslidenotehash");
  this.cmsImagesHash = document.getElementById("cmsimageshash");
  this.cmsConfig = document.getElementById("cmsconfig");


  //drupal7 with editablefields-module:
  let nodetitle = document.getElementById("page-title");
  if(nodetitle!=null)this.notetitle=nodetitle.innerHTML;
  let notename = "encslidenote";
  let imagename = "imagescontainer";
  let holdingforms = document.getElementsByClassName("editable-field");
  for(let x=0;x<holdingforms.length;x++){
    if(holdingforms[x].id.indexOf(notename)>1){
      this.cmsNoteSave = holdingforms[x].getElementsByClassName("form-submit")[0];
			this.cmsArea = holdingforms[x].getElementsByClassName("text-full")[0];
			this.cmsSlidenoteHash = holdingforms[x].getElementsByClassName("text-summary")[0];
    }
    if(holdingforms[x].id.indexOf(imagename)>1){
      this.cmsImagesSave = holdingforms[x].getElementsByClassName("form-submit")[0];
			this.cmsImages = holdingforms[x].getElementsByClassName("text-full")[0];
			this.cmsImagesHash = holdingforms[x].getElementsByClassName("text-summary")[0];
    }
  }
}

slidenoteGuardian.prototype.sendToCMS = function(target){
  //drupal7 with editablefields-module:
  if(target==="note" && this.cmsNoteSave)this.cmsNoteSave.dispatchEvent(new Event("click"));
  if(target==="images" && this.cmsImagesSave)this.cmsImagesSave.dispatchEvent(new Event("click"));
}

slidenoteGuardian.prototype.autoSaveToLocal = function(time){
  //tutorial: dont save:
  if(this.isTutorial)return;
  //TODO: performance-check. if saving costs too much it should save less
  if(slidenote.extensions.allThemesLoaded){
    this.saveNote("local");
    console.log("saved to local:"+time);
  }else{
    console.log("not saved - editor not ready yet");
  }
}

slidenoteGuardian.prototype.autoSaveToCMS = async function(){
  //check if you have to save:
  console.log("autosave to cms started");
  if(this.slidenote.textarea.value.length<1){
    //if empty dont save:
    setTimeout("slidenoteguardian.autoSaveToCMS()",30000);
    return;
  }
  console.log("saving to cms...");
  let acthash = await this.hash(this.slidenote.textarea.value); //hash the actual slidenote
  //this.getCMSFields();//getting the fields right:
  let oldhash = this.restObject.notehash;//this.cmsSlidenoteHash.value; //oldhash
  if(oldhash != acthash){
    //acthash diffs from old saved hash in cms so we have to save:
    console.log("autosave oldhash:"+oldhash+"\nnew hash:"+acthash);
    this.saveNote("cms");
  }else console.log("autosave aborted. oldhash === new hash");
  //check if cms-save is actually done yet (drupal7):
  //if(this.cmsNoteSave && this.cmsNoteSave.id != this.lastNoteFormId){
  //  this.lastNoteFormId = this.cmsNoteSave.id;
  //  console.log("autosave done - cms-form has new id");
  //}
  //check if config has changed:
  var localSavedConfig = this.localstorage.getItem("config");
  //if(localSavedConfig!=null && localSavedConfig != this.cmsConfig.value){
  //  this.cmsConfig.value = localSavedConfig;
  //}

  //repeats itself every 30 seconds, 2 minutes
  let autosavetime = 30000;//120000;
  setTimeout("slidenoteguardian.autoSaveToCMS()",autosavetime);
}

slidenoteGuardian.prototype.checkCloudStatus = async function(){
  console.log("checking cloud status");
  var timestrt = new Date();
  let acthash = await this.hash(this.slidenote.textarea.value);
  let oldhash = this.restObject.notehash;
  var savestatus = document.getElementById("savestatus");
  var cloudbutton = document.getElementById("cloud");
  if(acthash != oldhash){
    if(savestatus){
      savestatus.src=slidenote.imagespath+"buttons/cloud.png";
      savestatus.title="not in sync with cloud";
    }
    cloudbutton.className = "status-undefined";
    cloudbutton.title = "not in sync with cloud";
  }else{
    if(savestatus){
      savestatus.src=slidenote.imagespath+"buttons/cloudsaved.png";
      savestatus.title="in sync with cloud";
    }
    cloudbutton.className = "status-ok";
    cloudbutton.title = "in sync with cloud";
  }
  console.log("checking cloud status. in sync:"+(acthash!=oldhash));
  var timeneeded = new Date() - timestrt;
  console.log("Timecheck: checking needs "+timeneeded+"MS")
}

slidenoteGuardian.prototype.passwordPrompt = function (text, method, newpassword){
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
    console.log("no passwordprompt found");
    return;
  }
  pwpromptbox.encmethod = ""+method;
  console.log("template found: using template to comply with password-manager");
  var usernamefield = document.getElementById("username");
  var usernamelabel = document.getElementById("slidenoteGuardianPasswordPromptUsernameLabel");
  var pwinput = document.getElementById("password");
  var pwcheck = document.getElementById("pwcheckfield");
  var pwchecklabel = document.getElementById("slidenoteGuardianPasswordPromptRetypeLabel");
  var pwtext = document.getElementById("slidenoteGuardianPasswordPromptTemplatePreText");
  var pwokbutton = document.getElementById("slidenoteGuardianPasswordPromptEncrypt");
  var pwnotetitle = document.getElementById("slidenoteGuardianPasswordPromptNotetitle");
  var pwskipbutton = document.getElementById("skippassword");
  var pwgenbutton = document.getElementById("passwordgen");
  pwtext.innerText = text;
  //if(this.notetitle==="undefined")this.notetitle=this.localstorage.getItem("title");
  pwinput.value="";
  usernamefield.value = this.notetitle; //+"@slidenotes.io";
  if(pwnotetitle!=null)pwnotetitle.innerText = "Decrypting Slidenote \""+this.notetitle+"\"";
  //standard: skipbutton is hidden
  pwskipbutton.classList.add("hidden");
  if(method==="encrypt" && document.getElementById("slidenotediv").classList.contains("midstate")){
    pwskipbutton.classList.remove("hidden");
  }

  if(method==="decrypt"){
    pwinput.classList.remove("hidden");
    pwokbutton.innerText="DECRYPT";
    pwchecklabel.classList.add("hidden");
    pwcheck.classList.add("hidden");//style.display="none";
    pwcheck.value="";
    usernamefield.classList.add("hidden");
    usernamelabel.classList.add("hidden");
    pwgenbutton.classList.add("hidden");
  }else if(method==="export") {
    pwokbutton.innerText="ENCRYPT";
    usernamefield.value=this.notetitle+".slidenote";
    usernamefield.classList.remove("hidden");
    usernamelabel.classList.remove("hidden");
    usernamelabel.innerText = "filename for export";
    //pwchecklabel.style.display="block";
    //pwcheck.style.display="block";
    pwinput.classList.remove("hidden");
    pwcheck.classList.remove("hidden");
    pwchecklabel.classList.remove("hidden");
    pwnotetitle.innerText = "Exporting to Filesystem";
    pwgenbutton.classList.remove("hidden");
  }else if(method==="exportCMS"){
    pwnotetitle.innerText="Exporting to Filesystem";
    pwokbutton.innerText="ENCRYPT";
    usernamefield.value=this.notetitle;
    usernamefield.classList.remove("hidden");
    usernamelabel.classList.remove("hidden");
    usernamelabel.innerText = "filename for export";
    //pwchecklabel.style.display="block";
    //pwcheck.style.display="block";
    pwinput.classList.remove("hidden");
    pwcheck.classList.remove("hidden");
    pwchecklabel.classList.remove("hidden");
    pwgenbutton.classList.remove("hidden");
  }else if(method==="rename"){
    pwokbutton.innerText = "save";
    usernamefield.value = this.notetitle;
    usernamefield.classList.remove("hidden");
    usernamelabel.innerText = "Enter new name";
    pwnotetitle.innerText = "rename";
    //usernamelabel.classList.remove("hidden");
    usernamelabel.classList.add("hidden");
    pwinput.classList.add("hidden");
    pwinput.value = this.password;
    pwcheck.classList.add("hidden");
    pwchecklabel.classList.add("hidden");
    pwgenbutton.classList.add("hidden");
  }else if(method==="changepassword"){
    pwokbutton.innerText = "save";
    pwnotetitle.innerText = "change password";
    usernamefield.value = this.notetitle;
    usernamefield.classList.add("hidden");
    pwinput.classList.remove("hidden");
    pwcheck.classList.remove("hidden");
    pwchecklabel.classList.remove("hidden");
    pwgenbutton.classList.remove("hidden");
  }else {
    if(this.notetitle === "€€€new slidenote€€€"){
      usernamefield.classList.remove("hidden");
      usernamelabel.classList.remove("hidden");
      usernamelabel.innerText = "slidenote filename";
      usernamefield.value="new slidenote";
    }else{
      usernamefield.classList.add("hidden");
      usernamelabel.classList.add("hidden");
    }
    pwokbutton.innerText="ENCRYPT";
    pwchecklabel.style.display="block";
    pwcheck.style.display="block";
    pwnotetitle.innerText="Set Password for Slidenote";
  }

  pwprompt.appendChild(pwpromptbox);
  var dialogoptions = {
    type:"passwordprompt",
    title:pwnotetitle.innerText,
    confirmbutton:"encrypt",
    cancelbutton:"skip",
    content:pwprompt,
    closefunction: function(e){
      var store = document.getElementById("slidenoteGuardianPasswordPromptStore");
      var dialog = document.getElementById("slidenoteGuardianPasswordPromptTemplate");
      store.appendChild(dialog);
    },
  }

  //old stuff:
	document.body.appendChild(pwprompt); //make promptbox visible
	pwinput.focus(); //focus on pwbox to get direct input
  setTimeout("document.getElementById('password').focus()",500); //not the most elegant, but direct focus does not work sometimes - dont know why

	return new Promise(function(resolve, reject) {
	    pwprompt.addEventListener('click', function handleButtonClicks(e) {
	      if (e.target.tagName !== 'BUTTON' || e.target.id==="passwordgen" || e.target.id==="skippassword") { return; }
	      pwprompt.removeEventListener('click', handleButtonClicks); //removes eventhandler on cancel or ok
	      if (e.target.id === "slidenoteGuardianPasswordPromptEncrypt") {
          if(pwinput.value===pwcheck.value||(pwcheck.classList.contains("hidden") && pwcheck.value.length===0)){
            let newname = document.getElementById("username").value;
            if(pwpromptbox.encmethod.indexOf("export")==-1 && newname!=slidenoteguardian.notetitle){
              slidenoteguardian.notetitle=newname;
              menumanager.buildSlidenoteList();
              slidenoteguardian.localstorage.setItem("title",newname);
              document.getElementById("slidenotetitle").innerText = newname;
              //slidenoteguardian.saveNote("cms");
            }
            resolve(pwinput.value); //return password
          }
          else {
            return;
            //reject(new Error('Wrong retype'));
          }
	      } else {
          slidenoteguardian.savingtoDestination=undefined;
	        reject(new Error('User canceled')); //return error
	      }
        document.getElementById("slidenoteGuardianPasswordPromptStore").appendChild(pwpromptbox);
		    pwprompt.parentElement.removeChild(pwprompt); //let prompt disapear
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
          //if(pwprompt.parentElement === document.body)document.body.removeChild(pwprompt);
          if(pwprompt.parentElement)pwprompt.parentElement.removeChild(pwprompt);
  			}else if(e.keyCode==27){
          document.getElementById("slidenoteGuardianPasswordPromptStore").appendChild(pwpromptbox);
  				if(pwprompt && pwprompt.parentElement)pwprompt.parentElement.removeChild(pwprompt);
          slidenoteguardian.savingtoDestination=undefined;
  				reject(new Error("User cancelled"));
  			}
  		}
		pwinput.addEventListener('keyup',handleenter);
    pwcheck.addEventListener('keyup',handleenter);
	});
}

slidenoteGuardian.prototype.importPrompt = function(mdcode, imagestring){
/*
  var promptwrapper = document.createElement("div");
  promptwrapper.id = "slidenoteGuardianImportPromptWrapper";
  promptwrapper.classList.add("dialogboxparent");
  var prompt = document.createElement("div"); //prompt-container
  prompt.id = "slidenoteGuardianImportPrompt";
  prompt.classList.add("dialogbox");
  var imageblock; //block for preview-images
  let imageblocktitle;
  let mdcodeblocktitle = document.createElement("h1");
  mdcodeblocktitle.innerHTML = "Import MD-Code from File:";
  mdcodeblocktitle.classList.add("dialogtitle");
  prompt.appendChild(mdcodeblocktitle);
  dialogcontent.classList.add("dialogcontent");
  prompt.appendChild(dialogcontent);
*/
  var dialogoptions = {
    type:"dialog",
    title:"Import MD-Code from File:",
    closebutton:true,
    arrownavleftright:true
  }
  var dialogcontent = document.createElement("div");
  dialogcontent.id="placeholder";
  var mdcodeblock = document.createElement("div"); //md-code-container
  dialogcontent.appendChild(mdcodeblock);
  if(imagestring){
    imageblock = document.createElement("div"); //block for preview-images
    imageblock.classList.add("importfile-image-preview-block");
    imageblocktitle = document.createElement("h2");
    dialogcontent.appendChild(imageblocktitle);
    dialogcontent.appendChild(imageblock);
  }
  //buttons:
  var importbutton = document.createElement("button");
  var cancelbutton = document.createElement("button");
  var replacebutton = document.createElement("button");
  importbutton.innerText = "add to existing Code";
  cancelbutton.innerText = "cancel";
  replacebutton.innerText = "replace existing code";
  var buttonwrapper = document.createElement("div");
  buttonwrapper.classList.add("buttonarea");
  buttonwrapper.appendChild(cancelbutton);
  buttonwrapper.appendChild(replacebutton);
  buttonwrapper.appendChild(importbutton);
  dialogcontent.appendChild(buttonwrapper);

  //mdcodeblock.innerText = mdcode;
  var mdcodearr = mdcode.split("\n");
  var mdcodeol = document.createElement("ul");
  for(var x=0;x<mdcodearr.length;x++){
    let li = document.createElement("li");
    li.innerText = mdcodearr[x];
    mdcodeol.appendChild(li);
  }
  mdcodeblock.appendChild(mdcodeol);
  mdcodeblock.id = "slidenoteGuardianCodePreview";


  if(imagestring){
    //old: imagestring is now json, not old-style:
    //var imagepuffer = imagestring.split("<<<");
    //imagepuffer.pop(); //delete last element as it has no meaning
    var imagepuffer = JSON.parse(imagestring);
    imageblocktitle.innerText = "Images from slidenote to import: (Total "+imagepuffer.length+" images)";
    var imgul = document.createElement("ul");
    for(let i=0;i<imagepuffer.length;i++){
      let imgdata = imagepuffer[i].base64url;//imagepuffer[i].split(">>>");
      let imgnames = imagepuffer[i].names; //imgdata[0].substring(0,imgdata[0].indexOf("§$§")).split("§€§");
      let imgfilename = imagepuffer[i].filename;//imgdata[0].substring(imgdata[0].indexOf("§$§")+3);
      let li = document.createElement("li");
      //previewimages.push({name:imgdata[0],src:imgdata[1]});
      let imgtitle = document.createElement("div");
      imgtitle.classList.add("imagegallery-name");
      imgtitle.innerText = imgfilename;
      let imgnamediv = document.createElement("div");
      imgnamediv.innerText = imgnames.join(" , ");
      imgnamediv.classList.add("imagegallery-usedslides")
      if(imgnames.length==0){
        imgnamediv.innerText = "unconnected";
        imgnamediv.classList.add("imagegallery-unconnected");
      }
       //+ ": used as <i>![]("+imgnames.join(")</i> and <i>![](")+")</i>";
       //check against xss-attacks:
       let detxss = imgdata.indexOf("\"");
       detxss += imgdata.indexOf("\'");
       detxss += imgdata.indexOf("<");
       if(detxss>-3){
         console.log("possible xss-attack found - aborting import of image");
         continue;
       }
       let b64initstring = imgdata.substring(0,imgdata.indexOf(";base64,"));
       if(b64initstring != "data:image/jpeg" &&
           b64initstring!= "data:image/png" &&
           b64initstring!= "data:image/gif"){
             console.log("no valid base64 image found");
             continue;
       }
      let img = new Image();
      img.src = imgdata;
      li.appendChild(imgtitle);
      li.appendChild(imgnamediv);
      li.appendChild(img);
      imgul.appendChild(li);
    }
    imageblock.appendChild(imgul);
  }
  let nombre=document.getElementById("importfile").files[0];
  if(nombre){
    nombre=nombre.name;
  }else {
    nombre = document.getElementById("importfile").dropfilename;
    if(!nombre)nombre="nothing";else document.getElementById("importfile").dropfilename=null;
  };
  let chartbutton = document.createElement("button");
  let tablebutton = document.createElement("button");
  let insidedatatag = slidenote.parser.CarretOnElement(slidenote.textarea.selectionEnd);
  if(insidedatatag) insidedatatag = (insidedatatag.dataobject!=undefined); else insidedatatag=false;
  if(nombre.substring(nombre.length-3)==="csv" && !insidedatatag){
    //buttons to insert: chart, table:
    chartbutton.innerText="add as new chart";
    tablebutton.innerText = "add as new table";
    buttonwrapper.appendChild(chartbutton);
    buttonwrapper.appendChild(tablebutton);
    buttonwrapper.removeChild(replacebutton);
    //mdcodeblocktitle.innerHTML="Import Data from CSV-File";
    dialogoptions.title = "Import Data from CSV-File";
    importbutton.innerText = "insert at current carret position";
  }

  //promptwrapper.appendChild(prompt);
  //document.body.appendChild(promptwrapper);
  dialogoptions.content = dialogcontent;
  //make prompt visible
  dialoger.buildDialog(dialogoptions);
  var prompt = document.getElementById("dialogcontainer");
  return new Promise(function(resolve,reject){
    prompt.addEventListener('click', function handleButtonClicks(e){
      if(e.target.tagName!== 'BUTTON'){return;}
      prompt.removeEventListener('click',handleButtonClicks);
      if (e.target === importbutton){
        resolve('import');
      } else if(e.target === replacebutton){
        resolve('replace');
      } else if(e.target === chartbutton){
        resolve('chart');
      } else if(e.target === tablebutton){
        resolve('table');
      } else{
        reject(new Error('User aborted Import'));
      }
      //document.body.removeChild(promptwrapper);
      document.getElementById("dialogcontainer").parentElement.removeChild(document.getElementById("dialogcontainer"));
      document.getElementById("importfile").value="";
    });
  });

}

slidenoteGuardian.prototype.loadDiff = async function(){
  this.initialised = false;
  var cachedText = await this.loadNote("local",true);
  var cmsText = await this.loadNote("cms",true);
  //var confirmpage = document.createElement("div");
  //confirmpage.id = "slidenoteguardiandiff";
  var cachedButton = document.createElement("button");
  cachedButton.onclick = function(){
    slidenoteguardian.loadNote("local");
    slidenoteguardian.initialised=true;
    var confirmp = document.getElementById("dialogcontainer");
    confirmp.parentNode.removeChild(confirmp);
  };
  var cmsButton = document.createElement("button");
  cmsButton.onclick = function(){
    slidenoteguardian.loadNote("cms");
    slidenoteguardian.initialised=true;
    var confirmp = document.getElementById("dialogcontainer");
    confirmp.parentNode.removeChild(confirmp);
  };
  cachedButton.innerText = "Load Cached Version";
  cmsButton.innerText = "Load Version of Cloud";
  //var title = document.createElement("h1");
  //title.innerText = "Cached Version differs from Cloud-Status";
  //confirmpage.appendChild(title);
  var dialogcontent = document.createElement("div");
  //dialogcontent.classList.add("dialogcontent");
  dialogcontent.id = "placeholder";
  var pretext = document.createElement("div");
  pretext.innerText = "We found an unsaved Version of this Note in your local Cache. Load local Cache or Cloud?";
  pretext.classList.add("pretext");
  function createList(text){
    var ul = document.createElement("ol");
    var textarr = text.split("\n");
    for(var tx=0;tx<textarr.length;tx++){
      var li = document.createElement("li");
      li.innerText = textarr[tx];
      ul.appendChild(li);
    }
    return ul;
  }
  var cacheContainer = document.createElement("div");
  //cacheContainer.innerText = cachedText;
  var cacheList = createList(cachedText);
  cacheContainer.appendChild(cacheList);
  cacheContainer.classList.add("slidenoteguardian-diff");
  cacheContainer.classList.add("slidenoteguardian-diff-cache");
  var cmsContainer = document.createElement("div");
  cmsContainer.classList.add("slidenoteguardian-diff");
  cmsContainer.classList.add("slidenoteguardian-diff-cms");
  var cmsCList = createList(cmsText);
  cmsContainer.appendChild(cmsCList);
  //cmsContainer.innerText = cmsText;
  dialogcontent.appendChild(pretext);
  dialogcontent.appendChild(cachedButton);
  dialogcontent.appendChild(cmsButton);
  dialogcontent.appendChild(cacheContainer);
  dialogcontent.appendChild(cmsContainer);
  //confirmpage.appendChild(dialogcontent);
  //document.getElementsByTagName("body")[0].appendChild(confirmpage);
  //call dialog:
  var dialogoptions = {
    type:"dialog",
    title: "Cached Version differs from Cloud-Status",
    content:dialogcontent,
    cssclass:"slidenoteguardiandiffdialog",
    closebutton:true,
    closefunction: function(){
      console.log("user canceled");
      slidenoteguardian.loadNote("cms");
    }
    //closefunction: if user cancels/Escape load cms
  };
  dialoger.buildDialog(dialogoptions);

}

slidenoteGuardian.prototype.passwordGenerator = function(){
    // put a new password directly into fields, no dialog, title shows password
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!§$%&/()=?+-_#*~;,:.<>|@€ ²³{[]}\"'µ";
    var length = 30;
    var pw = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        pw += charset.charAt(Math.floor(Math.random() * n));
    }
    var rdl = Math.floor(Math.random()*10)+20;
    pw = pw.substring(0,rdl);
    document.getElementById("passwordgen").title = "Generated Password:"+pw;
    document.getElementById("password").value = pw;
    document.getElementById("pwcheckfield").value = pw;
}

slidenoteGuardian.prototype.skipPassword = function(){
  var pw = document.getElementById("password");
  var pwchk = document.getElementById("pwcheckfield");
  if(pw.value!="" || pwchk.value!=""){
    pw.value="";
    pwchk.value="";
    //pw.focus();
    return;
  }
  document.getElementById("slidenoteGuardianPasswordPromptEncrypt").click();
}
