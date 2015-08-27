function viz_blog(vizUrl) {

  var body = document.body ;
  var html = document.documentElement ;      

  function window_height() {
    return window.innerHeight ||  html.clientHeight || body.clientHeight ;
  }

  /*
   *   setup the coordinates of the content divs that are linked to the interactive visualizations: 
   */

  var divBox  = [] ;
  var divOpac = [] ;
  var keyDiv  = [] ; 
  var div     = document.getElementsByTagName('div') ; 

  for(var kdiv = 0 ; kdiv < div.length ; kdiv++) { // find key divs using data-viz attribute
    if(div[kdiv].getAttribute('data-viz') === "true") {
      keyDiv.push(div[kdiv]) ; // add key div to keyDiv array
    }
  }

  var Nviz = keyDiv.length ;

  if(Nviz != vizUrl.length) {
    console.log('warning: lengths of key divs and viz URLs do not match.') ;
  }

  function div_box() { // store div box coordinates and distances
    var windowHeight = window_height() ;
    var scaleFactor  = 0.5 ;
    var offset       = windowHeight * scaleFactor ;
  	for(var kdiv = 0 ; kdiv < Nviz ; kdiv++) { // compute the coordinates of the key divs
  		divBox[kdiv]   = keyDiv[kdiv].getBoundingClientRect() ;  // coordinates of key div
      divBox[kdiv].d = Math.min(Math.abs(divBox[kdiv].top - offset), Math.abs(divBox[kdiv].bottom - offset)) ; // distance of this box to some point inside the window
  	}
  }

  /* 
   *   setup the div elements containing the interactive visualizations:
   */

  var viz = document.createElement('div') ;
  viz.setAttribute('class', 'vizDiv') ;
  viz.setAttribute('style', 'opacity:0;') ;
  document.body.appendChild(viz) ;            
  var frame = document.createElement('iframe') ;

  /*
   *   update the interactive visualization opacities using the text scroll position:
   */

  var edgeWidth = 10 ;

  function round_to(x, prec) { // helper function for rounding opacity values, to quantize them on a grid
    return Math.round(x / prec) * prec ;
  } ;

  function current_index() {

    div_box() ; // div coords

    var minDistIndex = 0 ;
    var minDist      = Infinity ;

    for(var kdiv = 0 ; kdiv < Nviz ; kdiv++) {
      //console.log('kdiv', kdiv, 'divBox.d', divBox[kdiv].d) ;
      if(divBox[kdiv].d < minDist) {
        minDist      = divBox[kdiv].d ;
        minDistIndex = kdiv ;        
      }
    }
    return minDistIndex ;

  } ;


  function viz_opacity(kdiv) {
    
    var prec         = 1 / 256 ; // fixed precision for opacitiy values
    var windowHeight = window_height() ;
    var opacity ;

    div_box() ;

    opacity = 1 ;

    var distDiff = Infinity ;
    var nDivIndex ;
    if (currentIndex > 0) {
      distDiff  = divBox[currentIndex - 1].d - divBox[currentIndex].d ;
      nDivIndex = currentIndex - 1 ;
    }
    if(currentIndex < Nviz - 1) {
      var dx = divBox[currentIndex + 1].d - divBox[currentIndex].d  ;
      if (dx < distDiff) {
        distDiff  = dx ;
        nDivIndex = currentIndex + 1 ;
      }      
    }

    var dTol = 100 ; // start  fading out when neighboring div gets within this distance of the center line
    var dCut = 50 ;  // finish fading out when neighboring div gets within this distance of the center line

    if(divBox[nDivIndex].d < dTol) {
      opacity = Math.max(0, (divBox[nDivIndex].d - dCut) / dCut) ;
      console.log('currentIndex', currentIndex, 'nDivIndex', nDivIndex, 'd', divBox[nDivIndex].d, 'opacity', opacity)
    } 

    return round_to(opacity, prec) ;

  } ;

  var currentIndex = -1 ; // initialize

  (window.scroll_callback = function scroll_callback() { // handles scrolling events and appropriately adjusts the opacities of the visualizations

    var index = current_index() ;
    if(currentIndex != index) {
      frame.remove() ;
      frame = document.createElement('iframe') ;
      frame.setAttribute('width', '100%') ;
      frame.setAttribute('height', '100%') ;
      frame.setAttribute('src', vizUrl[index]) ;      
      viz.appendChild(frame) ;
      currentIndex = index ;
    }

    //console.log('index', index, 'currentIndex', currentIndex, 'opacity', viz_opacity(index)) ;
    viz.setAttribute('style', 'opacity:' + viz_opacity(index) + ';') ;

  })() ;

} ;