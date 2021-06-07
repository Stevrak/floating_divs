/*
 *  float.js
 *  Stephen Joys June 2021
 *  sample functions that use javascipt to move elements around page
 *  in this example we have following functions:
 * - div_selector(e,callback) : place on event (onclick) for elements we want to allow to move
 *                              selected elements will be styled with .swapselect
 * - swap()                   : all selected elements will be swapped with next in the list
 *                              or final element with start of list
 */




// globals to catch and toggle swap states
var swapToggle = true;
var swapDivs = []; // we could attach a class and search em all from doc (jquery). in this case keep record



// object selector
// if swapToggle is true, add or remove this div from our swapable divs
// by adding to swapDivs array and setting class to "swapselect"
// reverse function (remove from list and remove class) when clicked again
function div_selector(e,callback){
    // we want to select element to swap
    if (swapToggle){
      if (swapDivs.find(f => f == e.target)){// div is in the array
          // let's remove
           e.target.className = e.target.className.replace("swapselect","").trim();
           swapDivs.splice(swapDivs.findIndex(f => f == e.target),1);
      }else{
          // let's add to swapDivs;
          e.target.className += " swapselect";
          swapDivs.push(e.target);
      }

    // perform whatever else user wanted to do
    }else{
      if (callback)
        callback(e);
    }
}

// swap
// given array swapDivs containing elements we wish to swap on-screen
// and the go-ahead from gloval var swapToggle == true
// gather location and container data for each element, pick them out as body-level absolute elements,
// float them across to new position then reseat into final container

function swap(){

    let ticks = 50; // discrete positions we travel through
    let ticktime = 1000 / ticks;  // set milliseconds, then converty to time jump for each tick

    if (swapToggle && swapDivs.length>1){

      let pos = [];       // current (starting) window location
      let next_pos = [];  // final x, y to move up to
      let finalDiv = [];  // final div to place element into on completion

      // get all the swapped variables before launching any of them
      swapDivs.forEach((s,i) => {
          // get screen location, keep only needed data top/left
          pos[i] = s.getBoundingClientRect();
          pos[i] = {top:pos[i].top, left:pos[i].left}

          // determine what we are swapping with and save final location
          if (i+1 >= swapDivs.length){
            next_pos[i] =swapDivs[0].getBoundingClientRect();
            finalDiv[i] = swapDivs[0].parentNode;
          }else{
            next_pos[i] = swapDivs[i+1].getBoundingClientRect();
            finalDiv[i] = swapDivs[i+1].parentNode;
          }
      })

      // launch them to new positions
      swapDivs.forEach((s,i) => {

          // disconnect and set its own x,y
          document.getElementsByTagName("body")[0].appendChild(s);
          s.style.position = "absolute";
          s.style.top = pos[i].top.toString()+"px";
          s.style.left = pos[i].left.toString()+"px";

          // per-tick travel distance
          let dist = {x:(next_pos[i].left - pos[i].left)/ticks,
                      y:(next_pos[i].top - pos[i].top)/ticks};

          // perform animation
          function nextTick(countdown) {
              // travel
              pos[i].left = pos[i].left + dist.x;
              pos[i].top =   pos[i].top + dist.y;
              // copy to element
              s.style.top  = pos[i].top.toString()+"px";
              s.style.left = pos[i].left.toString()+"px";

              // continue moving item
              if (countdown > 0){
                setTimeout( function() {nextTick(countdown-1) }, ticktime);

              // final call, re-seat the div on screen
              }else{
                finalDiv[i].appendChild(s);
                s.style.top ="auto"
                s.style.left ="auto"
                s.style.position = "unset";
              }
          }

          // start animation loop
          nextTick(ticks);
      })
  }}
