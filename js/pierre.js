var meshesh = {};
var coloring = "hsl(180, 50% , 50% )";
var opacity = 100;
var organ = "skeleton";
var color_codes = {"Skeleton" : 0xf0f0f0, "Stomach" : 0x858500};
var organs = Object.keys(color_codes);
var mesh;

var white = d3.rgb("white"),
  black = d3.rgb("black"),
  width = d3.select("canvas").property("width");

var channels = {
  h: {scale: d3.scale.linear().domain([0, 360]).range([0, width]), x: width / 2},
  s: {scale: d3.scale.linear().domain([0, 1]).range([0, width]), x: width / 2},
  l: {scale: d3.scale.linear().domain([0, 1]).range([0, width]), x: width / 2}
};

$('li.coloring').on('click', function(event){
  var events = $._data(document, 'events') || {};
  events = events.click || [];
  for(var i = 0; i < events.length; i++) {
    if(events[i].selector) {
      //Check if the clicked element matches the event selector
      if($(event.target).is(events[i].selector)) {
          events[i].handler.call(event.target, event);
      }

      // Check if any of the clicked element parents matches the 
      // delegated event selector (Emulating propagation)
      $(event.target).parents(events[i].selector).each(function(){
          events[i].handler.call(this, event);
      });
    }
  }
  event.stopPropagation(); //Always stop propagation
});

init();

function init() {
  var scene = document.querySelector('a-entity').object3D;

  var beeybeey;
  var rot = { x: 90, y: 0, z: 0 };
  var scale = 0.002;

  var loader1 = new THREE.VTKLoader();
  loader1.load( '../vtkaas/pierre_t_s_d.vtk', function ( geometry ) {

    geometry.computeVertexNormals();
    geometry.center();
    beeybeey = geometry.boundingBox.min;

    var material = new THREE.MeshLambertMaterial( { color: 0xf0f0f0, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material );
    meshesh["Skeleton"] = mesh;

    mesh.position.set( 0, 0, 0 );
    mesh.scale.multiplyScalar( scale );
    rotateObject( mesh, rot.x, rot.y , rot.z );

    scene.add( mesh );

    load_vtk('../vtkaas/pierre_t_s_d_stomach.vtk', scene, rot, scale, beeybeey, 0x858500, 1, "Stomach");

  });
}

function load_vtk(fileName, scene, rot, scale, beeybeey, color, opacity, index) {
  var loader = new THREE.VTKLoader();

  loader.load( fileName, function ( geometry ) {

    geometry.computeVertexNormals();
    geometry.translate(beeybeey.x, beeybeey.y, beeybeey.z);

    var material = new THREE.MeshLambertMaterial( { color: color, opacity: opacity, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material );
    meshesh[index] = mesh;

    mesh.position.set( 0, 0, 0 );
    mesh.scale.multiplyScalar( scale );
    rotateObject( mesh, rot.x, rot.y, rot.z );

    scene.add( mesh );
  });

  return beeybeey ;
}

function rotateObject(object,degreeX=0, degreeY=0, degreeZ=0) {
  degreeX = (degreeX * Math.PI) / 180;
  degreeY = (degreeY * Math.PI) / 180;
  degreeZ = (degreeZ * Math.PI) / 180;

  object.rotateX(degreeX);
  object.rotateY(degreeY);
  object.rotateZ(degreeZ);
}

function backToDefault() {
  for (var i = organs.length - 1; i >= 0; i--) {
    meshesh[organs[i]].material.color = new THREE.Color(color_codes[organs[i]]);
    meshesh[organs[i]].material.needsUpdate = true;
  }
}

function apply_coloration () {
  console.log(opacity);
  meshesh[organ].material.color = new THREE.Color(coloring);
  meshesh[organ].material.opacity = opacity;
  meshesh[organ].material.needsUpdate = true;
}

function change_organ(new_organ) {
  organ = new_organ;
  d3.select("#color_now").html("Apply: " + organ);
  console.log(new_organ);
}

var channel = d3.selectAll(".channel")
    .data(d3.entries(channels));

var canvas = channel.select("canvas")
    .call(d3.behavior.drag().on("drag", dragged))
    .each(render);

function dragged(d) {
  d.value.x = Math.max(0, Math.min(this.width - 1, d3.mouse(this)[0]));
  canvas.each(render);
}

function render(d) {
  var width = this.width,
      context = this.getContext("2d"),
      image = context.createImageData(width, 1),
      i = -1;

  var current = d3.hsl(
    channels.h.scale.invert(channels.h.x),
    channels.s.scale.invert(channels.s.x),
    channels.l.scale.invert(channels.l.x)
  );

  d3.select("#color_now").style("background-color", "hsl(" + current.h + ", " + current.s * 100 + "% , " + current.l * 100 +"% )");
  coloring = "hsl(" + Math.round(current.h) + ", " + Math.round(current.s * 100) + "% , " + Math.round(current.l * 100) +"% )"

  for (var x = 0, v, c; x < width; ++x) {
    if (x === d.value.x) {
      c = white;
    } else if (x === d.value.x - 1) {
      c = black;
    } else {
      current[d.key] = d.value.scale.invert(x);
      c = d3.rgb(current);
    }
    image.data[++i] = c.r;
    image.data[++i] = c.g;
    image.data[++i] = c.b;
    image.data[++i] = 255;
  }
  context.putImageData(image, 0, 0);
}

// var width_slider = 230;

var x = d3.scale.linear()
    .domain([100, 1])
    .range([width_slider, 0])
    .clamp(true);

var dispatch = d3.dispatch("sliderChange");

var slider = d3.select(".slider")
    .style("width", width_slider + "px");

var sliderTray = slider.append("div")
    .attr("class", "slider-tray");

var sliderHandle = slider.append("div")
    .attr("class", "slider-handle");

sliderHandle.append("div")
    .attr("class", "slider-handle-icon")

slider.call(d3.behavior.drag()
    .on("dragstart", function() {
      dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
    }));

dispatch.on("sliderChange.slider", function(value) {
  d3.select("#color_now").style("opacity", x(value) / width_slider);
  opacity = x(value) / width_slider;
  sliderHandle.style("left", x(value) + "px")
});
