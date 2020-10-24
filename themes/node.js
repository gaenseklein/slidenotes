var nodetheme = new Theme('node');
nodetheme.description = "creates different kind of node-based views (sequence diagram, tree...)";

var buttonhtml = '<span class="buttonmdcode">+++node+++</span>';
nodetheme.addEditorbutton(buttonhtml,'+++node');

//internal vars:
nodetheme.nodetypes = ['simpleflow','sequence'];
nodetheme.mdcode = true;
nodetheme.syntax = {
  headseparator:"---",
  arrows: ['-->','->>','->','-'],
  arrowtypes: ['dashed', 'open','normal','noarrow'],
  mdarrows: ['--&gt;', '-&gt;&gt;','-&gt;','-'],
};

slidenote.datatypes.push({type:'node',mdcode:this.mdcode, theme:nodetheme});
//insert-menu:
nodetheme.hasInsertMenu = true;
nodetheme.insertMenuArea = function(dataobject){
  var result = document.createElement('div');
  var type='sequence'; //sequence is standard-type
  for(var x=0;x<this.nodetypes.length;x++){
    if(dataobject.head.indexOf(this.nodetypes[x])>-1)type=this.nodetypes[x];
  }
  result.classList.add('nodeinsertmenu');
  var buttonlist=this.builder[type].insertMenu();
  result.appendChild(buttonlist);
  return result;
};

nodetheme.styleThemeSpecials = function(){
  var datadivs = slidenote.presentationdiv.getElementsByTagName("section");
  for(var dx=0;dx<slidenote.parser.dataobjects.length;dx++){
  if(slidenote.parser.dataobjects[dx].type==='node'){
    let nodeobj = slidenote.parser.dataobjects[dx];
    let targetdiv = datadivs[dx];
    let renhtml = targetdiv.innerHTML.substring(1);//get rid of first \n
    //clean out some tags:
    renhtml = renhtml.replace(/<p>/g,'');
    renhtml = renhtml.replace(/<\/p>/g,'');
    renhtml = renhtml.replace(/<br>/g,'');
    let renlines=renhtml.split('\n');
    renlines.pop(); //get rid of last empty line
    //get rid of comments:
    for(var c=0;c<renlines.length;c++){
      if(nodeobj.raw[c].indexOf('//')>-1){
        renlines[c] = renlines[c].substring(0,renlines[c].indexOf('//'));
        nodeobj.raw[c]=nodeobj.raw[c].substring(0,nodeobj.raw[c].indexOf('//'));
      }
    }
    nodeobj.renderedLines=renlines;
    var nodediv = document.createElement('div');
    let nodetype;
    for(var x=0;x<this.nodetypes.length;x++){
      if(nodeobj.head.indexOf(this.nodetypes[x])>-1){
        nodetype=this.nodetypes[x];
        break;
      }
    }
    if(!nodetype)nodetype=this.nodetypes[0]; //no nodetype declared
    let nodeparseobj = this.builder.parse(nodeobj);
    var nodegraph = this.builder[nodetype].build(nodeparseobj);
    targetdiv.classList.add('node');
    nodegraph.classList.add(nodetype);
    console.log(targetdiv.innerHTML);
    targetdiv.innerHTML='';
    targetdiv.appendChild(nodegraph);
  }
  }
}

nodetheme.builder = {
  parsedlines:[],
  //general parsing:
  parseLine: function(line){
      if(line.length<1)return false; //nothing to do on empty line
      let posofpoint = line.indexOf(":");
      let posofdoublepoint = line.indexOf("::");
      if(posofdoublepoint>-1 && posofdoublepoint<=posofpoint){
        //we found a double-point declaration:
        let alias = line.substring(0,posofdoublepoint);
        //return that we have found a double-point-alias
        return {multilinedeclaration:true, alias:alias};
      }
      let meta=line.substring(0,posofpoint);
      let content= line.substring(posofpoint+1);
      var result = {};
      if(meta.indexOf('note ')==0){
          result.type='note';
          meta = meta.substring('note '.length);
          if(meta.indexOf('left of ')==0){
              result.notetype='left';
              meta = meta.substring('left of '.length);
              result.actor=meta;
          }else if(meta.indexOf('right of ')==0){
              result.notetype='right';
              meta = meta.substring('right of '.length);
              result.actor=meta;
          }else if(meta.indexOf('over ')==0){
              result.notetype='over';
              meta = meta.substring('over '.length);
              let commapos=meta.indexOf(',');
              if(commapos>-1){
                  result.multiactor=true;
                  result.act1=meta.substring(0,commapos);
                  result.act2=meta.substring(commapos+1);
                  result.actors=[result.act1,result.act2];
              }else{
                result.multiactor=false;
                result.actor=meta;
              }
          }else{
           return false; //syntax for note is wrong
          }
          result.content=content;
          return result;
      }else{
          result.type='arrow';
          let actions = nodetheme.syntax.arrows;
          if(nodetheme.mdcode)actions = nodetheme.syntax.mdarrows;
          var action; var arrowtype;
          for(var x=0;x<actions.length;x++){
            if(meta.indexOf(actions[x])!=-1){
              action=actions[x];
              arrowtype=nodetheme.syntax.arrowtypes[x];
              break;
            }
          }

          if(!action){
            //no action means we have a definition of new alias/actor:
            //check if there is allready an actor by this alias
            let actorpos = this.actors.indexOf(meta);
            //if not put it to end of actors:
            if(actorpos==-1)actorpos=this.actors.length;
            this.actors[actorpos]=content;
            this.aliases[actorpos]=meta;
            return false; //nothing to do later on with this line
          }
          result.arrowtype=arrowtype;
          result.msg=content;
          let actors = meta.split(action);
          //clean actors:
          let actfrom=actors[0];
          if(actfrom.charAt(0)==" ")actfrom=actfrom.substring(1);
          if(actfrom.charAt(actfrom.length-1)==" ")actfrom=actfrom.substring(0,actfrom.length-1);
          let actto=actors[1];
          if(actto.charAt(0)==" ")actto=actto.substring(1);
          if(actto.charAt(actto.length-1)==" ")actto=actto.substring(0,actto.length-1);
          result.actfrom = actfrom;
          result.actto = actto;
          result.actors = [actfrom,actto];
          return result;
      }
  },
  parse: function(nodeobj){
    let lines = [];
    let metalines = [];
    this.actors = [];
    this.aliases = [];
    let metadata=false;
    let source = nodeobj.raw;
    if(nodetheme.mdcode)source=nodeobj.renderedLines;
    for(var x=nodeobj.raw.length-1;x>=0;x--){
      if(nodeobj.raw[x]=="---"){
        metadata=true; continue;
      }
      if(metadata)metalines.unshift(source[x]);
      else lines.unshift(source[x]);
    }
    //parse metadata:
    this.options = this.parseMetadata(metalines);
    //parse lines:
    let parsedlines = [];
    let skiplines = [];
    for(var x=0;x<lines.length;x++){
      if(skiplines.indexOf(x)>-1){
        parsedlines[x]=false;
        continue;
      }
      parsedlines[x]=this.parseLine(lines[x]);
      if(parsedlines[x]==false)continue;
      if(parsedlines[x].multilinedeclaration){
        let alias = parsedlines[x].alias;
        let multicontent = "";
        for(var ml=x+1;ml<lines.length;ml++){
          skiplines.push(ml);
          if(lines[ml]=="::"+alias){
            break;
          }
          if(ml>x+1)multicontent+="<br>";
          multicontent+=lines[ml];
        }
        let actorpos = this.actors.indexOf(alias);
        if(actorpos==-1)actorpos=this.actors.length;
        this.actors[actorpos]=multicontent;
        this.aliases[actorpos]=alias;
      }
      if(parsedlines[x].actors)this.pushActor(parsedlines[x].actors);
      else if(parsedlines[x].actor)this.pushActor(parsedlines[x].actor);
    }
    let parseobj = {
      actors:this.actors,
      aliases:this.aliases,
      options:this.options,
      parsedlines:parsedlines,
      mdcode:nodetheme.mdcode
    }
    console.log('parsed nodeobject:',parseobj, nodeobj);
    return parseobj;
  },
  pushActor: function(actor){
    let actors = actor;
    if(typeof actor == "string")actors=[actor];
    for(var x=0;x<actors.length;x++){
      let act=actors[x];
      if(this.actors.indexOf(act)==-1 &&
        this.aliases.indexOf(act)==-1){
        this.actors.push(act);
      };
    }
  },
  parseMetadata:function(metalines){
    /*metadata can be
    alias:nodecontent
    alias=nodecontent
    alias->variable:value
    alias::\n
    nodecontent
    ::alias
    */
    var separators = ['->','=','::',':'];
    if(nodetheme.mdcode)separators=['&gt;','=','::',':'];
    for(var x=0;x<metalines.length;x++){
      var line = metalines[x];
      let separator;
      let seppos=line.length;
      for(var s=0;s<separators.length;s++){
        let pos=line.indexOf(separators[s]);
        if(pos>-1&&pos<seppos){
          separator=separators[s];
          seppos=pos;
        }
      }
      if(separator=='='||separator==':'){
        let alias=line.substring(0,seppos);
        let actor = line.substring(seppos+separator.length);
        let actorIndex = this.actors.indexOf(actor);
        if(actorIndex==-1){
          actorIndex=this.actors.length;
          this.actors.push(actor);
        }
        this.aliases[actorIndex]=alias;
      }
      if(separator=='::' && seppos>0){
        let alias = line.substring(0,seppos);
        let endline;
        let content="";
        for(var el=x+1;el<metalines.length;el++){
          content+=metalines[el]+"\n";
          if(metalines[el].substring(0,alias.length+2)=='::'+alias){
            endline=el;break;
          }
          metalines[el]='';
        }
        this.actors.push(content);
        this.aliases[this.actors.length-1]=alias;
      }
    }
    return {hasMetadata:true};
  },//end of parseMetadata
  //sequence-diagram:
  sequence:{
    build: function(parseobj){
      this.actors = parseobj.actors || [];
      this.aliases = parseobj.aliases || [];
      this.mdcode = parseobj.mdcode;
      let lines = parseobj.parsedlines;
      result = document.createElement('div');

      //create lines:
      for(var x=0;x<lines.length;x++){
        if(lines[x]==false)continue;
        let newline = this.buildLine(lines[x]);
        if(newline==false)continue;
        newline.style.gridRow = x+2; //start in second grid row
        result.appendChild(newline);
      }
      for(var x=0;x<this.actors.length;x++){
        let acttop = this.buildActor(this.actors.length-(1+x),true);
        let actbottom = this.buildActor(x,false);
        result.insertBefore(acttop,result.firstChild);
        result.appendChild(actbottom);
        //add a line for each actor:
        let stroke = document.createElement('div');
        stroke.className = 'stroke';
        let strcol=(this.actors.length-(x+1))*4+3;
        stroke.style.gridColumn=strcol+"/"+strcol;
        result.insertBefore(stroke,acttop);
      }
      result.style.gridTemplateColumns='repeat('+this.actors.length+', 1fr 1fr 1fr 1fr)';
      result.style.gridTemplateRows='repeat('+(lines.length+2)+',auto)';
      return result;

    },
    buildActor: function(actorsnr, top){
      let actor=this.actors[actorsnr];
      let div = document.createElement('div');
      div.classList.add('actor');
      if(top){
        div.classList.add('top');
        div.style.gridRow="1/1";
      }else {
        div.classList.add('bottom');
        div.style.gridRow="-1/-1";
      }
      div.style.gridColumnStart = (actorsnr*4)+2;
      div.style.gridColumnEnd=(actorsnr*4)+4;
      if(this.mdcode)div.innerHTML = actor;
        else div.innerText=actor;
      return div;
    },
    buildLine: function(parsedline){
      /*
      parsedline is object with:
      type: note
      notetype:left/right/over
      actor: actors-html/actors-text/actors alias
      multiactor: true on over multiple accounts
      act1, act2, actors
      */

      let result = document.createElement('div');
      if(parsedline.type=='note'){
        result.classList.add('note');
        result.classList.add(parsedline.notetype);
        if(this.mdcode)result.innerHTML = parsedline.content;
          else result.innerText = parsedline.content;
        if(parsedline.notetype=='left'){
          result.style.gridColumn = this.getGridPosOfActor(parsedline.actor)-1;
        }else if(parsedline.notetype=='right'){
          result.style.gridColumn = this.getGridPosOfActor(parsedline.actor)+2;
        }else if(parsedline.notetype=='over' && parsedline.multiactor){
          result.style.gridColumnStart = this.getGridPosOfActor(parsedline.act1);
          result.style.gridColumnEnd = this.getGridPosOfActor(parsedline.act2)+2;
        }else if(parsedline.notetype=='over'){
          result.style.gridColumnStart = this.getGridPosOfActor(parsedline.actor);
          result.style.gridColumnEnd = this.getGridPosOfActor(parsedline.actor)+2;
        }
      }else if(parsedline.type=='arrow'){
        result.classList.add('arrow');
        result.classList.add(parsedline.arrowtype);
        let msg = document.createElement('div');
        if(this.mdcode)msg.innerHTML = parsedline.msg;
        else msg.innerText = parsedline.msg;
        let arrow = document.createElement('div');//new Image();
        arrow.className='arrowimg';
        result.appendChild(msg);
        result.appendChild(arrow);
        let gridFrom = this.getGridPosOfActor(parsedline.actfrom)+1;
        let gridTo = this.getGridPosOfActor(parsedline.actto)+1;
        if(gridFrom<gridTo){
            //left to right
            result.style.gridColumnStart = gridFrom;
            result.style.gridColumnEnd = gridTo;
            result.classList.add('toright');
        }else{
            //right to left
            result.style.gridColumnStart = gridTo;
            result.style.gridColumnEnd = gridFrom;
            result.classList.add('toleft');
        }
        return result;

      }else{
        return false;
      }
      return result;
    },
    getGridPosOfActor: function(actor){
        if(actor==undefined || actor.length<1)return false;
        let pos = this.aliases.indexOf(actor);
        if(pos==-1)pos = this.actors.indexOf(actor);
        if(pos==-1){
            //new actor found:
            this.actors.push(actor);
            pos=this.actors.length-1;
        }
        let gridpos = pos*4+2;
        return gridpos;
    },
    insertMenu: function(){
      let result = document.createElement('div');
      //we have note left, right, over and all arrows
      let notes = ['note left of ', 'note right of ', 'note over ', 'a->b','a-->b','a->>b','a-b'];
      for(var x=0;x<notes.length;x++){
        //let li=document.createElement('li');
        let bt = document.createElement('button');
        bt.clasName='menuitem';
        bt.title='insert '+notes[x]+'to code';
        bt.name=notes[x];
        bt.innerText=notes[x];
        bt.onclick=function(){
          let inspos = slidenote.textarea.value.indexOf('\n',slidenote.textarea.selectionEnd);
          let txt=slidenote.textarea.value;
          let inserttext='\n'+this.name+':';
          txt=txt.substring(0,inspos)+inserttext+txt.substring(inspos);
          slidenote.textarea.value=txt;
          slidenote.textarea.selectionEnd=inspos+inserttext.length-1;
          slidenote.parseneu();
          slidenote.textarea.focus();
        };
        //li.appendChild(bt);
        //result.appendChild(li);
        result.appendChild(bt);
      }
      return result;
    },

  },
  //tree-diagram:
  tree:{
    build: function(parseobj){

    },
    insertMenu: function(){

    },
  },
  //simple-flow from start to end node with arrows
  simpleflow:{
    build:function(parseobj){
      let lines = parseobj.parsedlines;
      let nodes = parseobj.actors;
      let aliases = parseobj.aliases;
      let options = parseobj.options;
      this.mdcode = parseobj.mdcode;
      var result = document.createElement('div');
      result.classList.add('simpleflow');
      let nodedivs = [];
      for(var x=0;x<nodes.length;x++){
        let node = document.createElement('div');
        node.classList.add('node');
        node.id = 'simpleflow-node-'+x;
        if(this.mdcode)node.innerHTML=nodes[x];
        else node.innerText=nodes[x];
        result.appendChild(node);
        nodedivs.push(node);
        //position node in grid:
        //TODO: horizontal and vertical, for now just horizontal:
        node.style.gridColumnStart = 2+(4*x);
        node.style.gridColumnEnd = 4+(4*x);
      }
      //add arrows and notes to nodes:
      for(var x=0;x<lines.length;x++){
        if(lines[x]==false)continue;
        if(lines[x].type==="arrow"){
          let indexfrom = nodes.indexOf(lines[x].actfrom);
          if(indexfrom==-1)indexfrom=aliases.indexOf(lines[x].actfrom);
          let indexto = nodes.indexOf(lines[x].actto);
          if(indexto==-1)indexto=aliases.indexOf(lines[x].actto);
          if(indexfrom<0||indexto<0)continue;
          let arrow = document.createElement('div');
          arrow.classList.add('arrow');
          if(this.mdcode)arrow.innerHTML = lines[x].msg;
          else arrow.innerText=lines[x].msg;
          arrow.classList.add(lines[x].arrowtype);
          //position arrow in grid
          //TODO: add vertical option
          if(indexto>indexfrom){
            arrow.style.gridColumnStart=(indexfrom*4)+4;
            arrow.style.gridColumnEnd = (indexto*4)+1;
            result.insertBefore(arrow,nodedivs[indexto]);
          }else{
            arrow.style.gridColumnStart=(indexto*4)+4;
            arrow.style.gridColumnEnd = (indexfrom*4)+1;
            result.insertBefore(arrow,nodedivs[indexfrom]);
          }
        }
        if(lines.type==="note"){
          let note = document.createElement('div');
          note.classList.add('note');
          note.classList.add(lines[x].nodetype);
          let gc;
          let index = aliases.indexOf(lines[x].actor);
          if(index==-1)index=nodes.indexOf(lines[x].actor);
          if(lines[x].nodetype=='left'){
            gc=(index*4+1)+'/'+(index*4+2);
          }else if(lines[x].nodetype=='right'){
            gc=(index*4+4)+'/'+(index*4+5);
          }else if(lines[x].nodetype=='over'){
            let i1=aliases.indexOf(lines[x].act1);
            if(i1==-1)i1=nodes.indexOf(lines[x].act1);
            let i2=aliases.indexOf(lines[x].act2);
            if(i1==-1)i2=nodes.indexOf(lines[x].act2);
            if(i1<i2){
              gc=(i1*4+2)+'/'+(i2*4+3);
              index=i1;
            }else{
              gc=(i2*4+2)+'/'+(i1*4+3);
              index=i2;
            }
          }
          note.gridColumn = gc;
          result.insertAfter(note, nodedivs[index]);
        }
      }
      return result;
    },
    insertMenu: function(){

    },
  },
  //other diagrams/nodetypes
  /*every new diagram/nodetype needs the folowing:
    build: a function which takes a parseobject (list with parsed lines)
          and returns the finished html inside a node
    insertMenu: a function which returns the html
        buttons for this nodetype in a ul

  */
};
slidenote.addTheme(nodetheme);
