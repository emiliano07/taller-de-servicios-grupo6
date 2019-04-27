class PlayList{
    constructor( name, genresToInclude, maxDuration ){
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