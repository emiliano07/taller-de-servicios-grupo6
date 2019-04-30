class PlayList{
    constructor( id, name, genresToInclude, maxDuration ){
        this.id = id;
        this.name = name;
        this.genresToInclude = genresToInclude;
        this.maxDuration = maxDuration;
        this.tracks = [];
    }
  
    duration(){
        let a = 0; 
        return this.tracks.map( track => track.duration ).
                            reduce( function(a,b){ return a = a+b } );
    }
  
    hasTrack(aTrack){
        return this.tracks.includes(aTrack);
    }
}

module.exports = {
    PlayList,
  };