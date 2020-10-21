var newtheme = new Theme('node');
newtheme.description = "creates different kind of node-based views (sequence diagram, tree...)";

var buttonhtml = '<span class="buttonmdcode">+++node+++</span>';
newtheme.addEditorbutton(buttonhtml,'+++node');
slidenote.datatypes.push({type:'node',mdcode:false, theme:newtheme});

//internal vars:
newtheme.nodetypes = ['sequence'];
newtheme.syntax = {
  headseparator:"---",
};
newtheme.syntax.sequence = {

}

//insert-menu:
newtheme.hasInsertMenu = true;
newtheme.insertMenuArea = function(dataobject){
  var result = document.createElement('div');

  return result;
};

newtheme.parseMetadata = function(rawdata){
  var metadata = rawdata.substring(rawdata.indexOf(this.syntax.headseparator));
  //now parse the metadata to find something...
}

newtheme.styleThemeSpecials = function(){
  var datadivs = slidenote.presentationdiv.getElementsByTagName("section");
  for(var dx=0;dx<slidenote.parser.dataobjects.length;dx++){
  if(slidenote.parser.dataobjects[dx].type==='node'){
    let nodeobj = slidenote.parser.dataobjects[dx];
    let targetdiv = datadivs[dx];
    var nodediv = document.createElement('div');
    let nodetype;
    for(var x=0;x<this.nodetypes.length;x++){
      if(nodeobj.head.indexOf(this.nodetypes[x])>-1){
        nodetype=this.nodetypes[x];
        break;
      }
    }
    if(!nodetype)nodetype=this.nodetypes[0]; //no nodetype declared
    var nodegraph = this.builder[nodetype].build(nodeobj);
    targetdiv.classList.add('node');
    nodegraph.classList.add(nodetype);
    targetdiv.innerHTML='';
    targetdiv.appendChild(nodegraph);
  }
  }
}

newtheme.builder = {
  //sequence-diagram:
  sequence:{
    build: function(nodeobj){
      this.actors = [];
      this.aliases = [];
      let metadata = false;
      let lines = [];
      let metalines = [];
      for(var x=nodeobj.raw.length-1;x>=0;x--){
        if(nodeobj.raw[x]=="---"){
          metadata=true; continue;
        }
        if(metadata)metadata.unshift(nodeobj.raw[x]);
        else lines.unshift(nodeobj.raw[x]);
      }
      // TODO: parse metadata

      result = document.createElement('div');

      //create lines:
      for(var x=0;x<lines.length;x++){
        let newline = this.parseLine(lines[x]);
        newline.style.gridRow = x+2; //start in second grid-row
        if(newline!=false)result.appendChild(newline);
      }
      //actors are now all parsed too, so add them at top and bottom:
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
      div.innerText=actor;
      return div;
    },
    parseLine: function(line){
        let posofpoint = line.indexOf(":");
        let meta=line.substring(0,posofpoint);
        let content= line.substring(posofpoint+1);
        var result;
        if(meta.indexOf('note ')==0){
            result=document.createElement("div");
            result.classList.add("note");
            meta = meta.substring('note '.length);
            let notetype;
            if(meta.indexOf('left of ')==0){
                notetype='left';
                meta = meta.substring('left of '.length);
                result.style.gridColumn = this.getGridPosOfActor(meta)-1;
            }else if(meta.indexOf('right of ')==0){
                notetype='right';
                meta = meta.substring('right of '.length);
                result.style.gridColumn = this.getGridPosOfActor(meta)+2;
            }else if(meta.indexOf('over ')==0){
                notetype='over';
                meta = meta.substring('over '.length);
                let commapos=meta.indexOf(',');
                if(commapos>-1){
                    let act1=meta.substring(0,commapos);
                    let act2=meta.substring(commapos+1);
                    result.style.gridColumnStart = this.getGridPosOfActor(act1);
                    result.style.gridColumnEnd = this.getGridPosOfActor(act2)+2;
                }else{
                    result.style.gridColumnStart = this.getGridPosOfActor(meta);
                    result.style.gridColumnEnd = this.getGridPosOfActor(meta)+2;
                }
            }else{
             return false; //syntax for note is wrong
            }
            result.classList.add(notetype);
            result.innerText=content;
            return result;
        }else{
            let action='-->';
            let arrowtype='dashed';
            if(meta.indexOf(action)==-1){
                action='->>';
                arrowtype='open';
            }
            if(meta.indexOf(action)==-1){
                action='->';
                arrowtype='normal';
            }
            if(meta.indexOf(action)==-1){
                action='-';
                arrowtype='noarrow';
            }
            let result = document.createElement('div');
            result.classList.add('arrow');
            result.classList.add(arrowtype);
            let msg = document.createElement('div');
            msg.innerText=content;
            let arrow = document.createElement('div');//new Image();
            let arrowurl='/themes/node/sequencearrow'+arrowtype+'.png';
            arrow.style.backgroundImage='url("'+arrowurl+'")';
            arrow.className='arrowimg';
            result.appendChild(msg);
            result.appendChild(arrow);
            let actors = meta.split(action);
            //clean actors:
            let actfrom=actors[0];
            if(actfrom.charAt(0)==" ")actfrom=actfrom.substring(1);
            if(actfrom.charAt(actfrom.length-1)==" ")actfrom=actfrom.substring(0,actfrom.length-1);
            let actto=actors[1];
            if(actto.charAt(0)==" ")actto=actto.substring(1);
            if(actto.charAt(actto.length-1)==" ")actto=actto.substring(0,actto.length-1);
            
            let gridFrom = this.getGridPosOfActor(actfrom)+1;
            let gridTo = this.getGridPosOfActor(actto)+1;
            if(gridFrom===false || gridTo===false)return false;
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
        }
    },
    getGridPosOfActor: function(actor){
        if(actor.length<1)return false;
        let pos = this.actors.indexOf(actor);
        if(pos==-1)pos = this.aliases.indexOf(actor);
        if(pos==-1){
            //new actor found:
            this.actors.push(actor);
            pos=this.actors.length-1;
        }
        let gridpos = pos*4+2;
        return gridpos;
    },

  },
  //tree-diagram:
  tree:{
    build: function(nodeobj){

    },
  }
  //other diagrams/nodetypes
};
slidenote.addTheme(newtheme);
