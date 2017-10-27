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
  loader1.load( '../vtkaas/pierre_skeleton.vtk', function ( geometry ) {

    geometry.computeVertexNormals();

    var material = new THREE.MeshLambertMaterial( { color:0xf0f0f0, opacity:1, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material );
    meshesh["Skeleton"] = mesh;

    mesh.scale.multiplyScalar( scale );

    var pivot = new THREE.Group();
    scene.add( pivot );
    pivot.add( mesh );

    // load_vtk('../vtkaas/pierre_skin.vtk', scene, rot, scale, beeybeey, "#00ff00", .1, "Skin");
    // load_vtk('../vtkaas/pierre_skeleton.vtk', scene, rot, scale, beeybeey, "#f0f0f0", 1, "Skeleton");
    load_vtk(pivot, '../vtkaas/pierre_blood.vtk', scene, rot, scale, beeybeey, "red", 1, "Blood");
    load_vtk(pivot, '../vtkaas/pierre_brain.vtk', scene, rot, scale, beeybeey, "#a32030", 1, "Brain");
    load_vtk(pivot, '../vtkaas/pierre_duodenum.vtk', scene, rot, scale, beeybeey, "#998b58", 1, "Duodenum");
    load_vtk(pivot, '../vtkaas/pierre_eye_retina.vtk', scene, rot, scale, beeybeey, "#f4ee42", 1, "EyeRetina");
    load_vtk(pivot, '../vtkaas/pierre_eye_white.vtk', scene, rot, scale, beeybeey, "white", 1, "EyeWhite");
    load_vtk(pivot, '../vtkaas/pierre_heart.vtk', scene, rot, scale, beeybeey, "#ff3030", 1, "Heart");
    load_vtk(pivot, '../vtkaas/pierre_kidney.vtk', scene, rot, scale, beeybeey, "#a51818", 1, "Kidney");
    load_vtk(pivot, '../vtkaas/pierre_illeum.vtk', scene, rot, scale, beeybeey, "#8357a5", 1, "Ileum");
    load_vtk(pivot, '../vtkaas/pierre_l_intestine.vtk', scene, rot, scale, beeybeey, "#f9fc37", 1, "LargeIntestine");
    load_vtk(pivot, '../vtkaas/pierre_liver.vtk', scene, rot, scale, beeybeey, "#9e2525", 1, "Liver");
    load_vtk(pivot, '../vtkaas/pierre_lungs.vtk', scene, rot, scale, beeybeey, "#8482ff", 1, "Lungs");
    load_vtk(pivot, '../vtkaas/pierre_nerve.vtk', scene, rot, scale, beeybeey, "#feffef", 1, "Nerve");
    load_vtk(pivot, '../vtkaas/pierre_spleen.vtk', scene, rot, scale, beeybeey, "#efa5e9", 1, "Spleen");
    load_vtk(pivot, '../vtkaas/pierre_stomach.vtk', scene, rot, scale, beeybeey, "#ba9e23", 1, "Stomach");

    // pivot.position.set( -0.5, 1.75, -2 );
    rotateObject( pivot, rot.x, rot.y, rot.z);

  });
}

function load_vtk(pivot, fileName, scene, rot, scale, beeybeey, color, opacity, index) {
  var loader = new THREE.VTKLoader();

  loader.load( fileName, function ( geometry ) {

    geometry.computeVertexNormals();

    var material = new THREE.MeshLambertMaterial( { color: color, opacity: opacity, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material );
    meshesh[index] = mesh;

    mesh.scale.multiplyScalar( scale );

    pivot.add( mesh );
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

var width_slider = 230;

var x = d3.scale.linear()
    .domain([1, 100])
    .range([0, width_slider])
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
