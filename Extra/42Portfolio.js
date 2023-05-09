WIDTH = 467;
HEIGHT = 374;

let horizontalDivs = 8;
let verticalDivs = 8;

let scX = d3.scaleLinear()
  .domain( [0, verticalDivs] )
  .range( [0, WIDTH] );
let scY = d3.scaleLinear()
  .domain( [0, horizontalDivs] )
  .range( [0, HEIGHT - 1] );

const makeLines = (selector, data, width = 1, color = "lightgreen") => {
  selector.append( "g" ).attr( "class", "lineDiv" ).selectAll("line")
    .data( data ).enter().append("line")
    .style("stroke", color)
    .style("stroke-width", width)
    .attr("x1", d => scX(d["x1"]))
    .attr("y1", d => scY(d["y1"]))
    .attr("x2", d => scX(d["x2"]))
    .attr("y2", d => scY(d["y2"]));
};

const makeCircle = (selector, rad, cx, cy, width = 1, color = "blue", fill = "none", className = "circle") => {
  selector.append("g").attr("class", className)
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', rad)
    .style('fill', fill)
    .style('stroke', color)
    .style("stroke-width", width);
};

const makeUserName = (selector, username = "arosado-") => {
  const txt = selector.append( "g" ).append( "text" );
  txt.attr( "x", WIDTH / 2 ).attr( "y", (HEIGHT / 8) - 5 )
    .attr( "alignment-baseline", "middle" ).attr( "text-anchor", "middle" )
    .attr( "font-family", "Anonymous Pro").attr( "font-size", WIDTH / 24)
    .text( "@" + username );
};

const makeLocation = (selector, location = "Lisboa") => {
  const txt = selector.append( "g" ).append( "text" );
  txt.attr( "x", WIDTH / 2 ).attr( "y", (HEIGHT / 8) + (WIDTH / 32))
    .attr( "alignment-baseline", "middle" ).attr( "text-anchor", "middle" )
    .attr( "font-family", "Anonymous Pro").attr( "font-size", WIDTH / 32)
    .text( "42" + location );
};

const makePoligon = (selector, hull, fill = "black", stroke = "red", width = 1) => {
  let line = d3.line()
    .curve(d3.curveLinearClosed);
  selector.append("path")
    .attr("d", line(hull))
    .attr("fill", fill)
    .attr( "stroke-width", width)
    .attr("stroke", stroke);
};

const make42Logo = (selector, x = 0, y = 0) => {
  let dataFourFigure = [
    {x: 32, y: 412.6},
    {x: 362.1, y: 412.6},
    {x: 362.1, y: 578},
    {x: 526.8, y: 578},
    {x: 526.8, y: 279.1},
    {x: 197.3, y: 279.1},
    {x: 526.8, y: -51.1},
    {x: 362.1, y: -51.1},
    {x: 32, y: 279.1}
  ];
  let dataTwoFigure = [
    {x: 762.7, y: 114.2},
    {x: 597.9, y: 279.1},
    {x: 597.9, y: 443.9},
    {x: 762.7, y: 443.9},
    {x: 928, y: 279.1},
    {x: 928, y: 443.9},
    {x: 762.7, y: 443.9},
    {x: 762.7, y: 279.1},
    {x: 928, y: 114.2},
    {x: 928, y: -51.1},
    {x: 762.7, y: -51.1},
    {x: 597.9, y: 114.2},
    {x: 597.9, y: -51.1},
    {x: 762.7, y: -51.1},
  ];

  const getPoints = (dataSet, offsetX = 0, offsetY = 0, scale = 0) => {
    let xScale = d3.scaleLinear().domain(d3.extent( dataSet, d => d["x"] )).range([x + offsetX, ((HEIGHT / 8) - scale) + x + offsetX]);
    let yScale = d3.scaleLinear().domain(d3.extent( dataSet, d => d["y"] )).range([y + offsetY, ((HEIGHT / 8) - scale) + y + offsetY]);
    return dataSet.map((d) => [xScale(d.x), yScale(d.y)] );
  };
  let elem = selector.append( "g" );
  makePoligon(elem, getPoints(dataFourFigure, 20, 5, 10), "black", "none");
  makePoligon(elem, getPoints(dataTwoFigure, WIDTH / 8 + 2, 5, 18), "black", "none");
};

const getInput = (inputId) => {
    if (!inputId)
        return;
    return d3.select( "#" + inputId ).node().value;
};

const generateHelperLines = (selector) => {
  horizontalDivs = getInput("horizontalDivs") || horizontalDivs;
  verticalDivs = getInput("verticalDivs") || verticalDivs;
  scX = d3.scaleLinear()
    .domain( [0, verticalDivs] )
    .range( [0, WIDTH] );
  scY = d3.scaleLinear()
    .domain( [0, horizontalDivs] )
    .range( [0, HEIGHT] );

  let hSet = [];
  for (let i = 1; i < horizontalDivs; i++) {
    hSet.push({"x1": 0, "y1": i, "x2": verticalDivs, "y2": i});
  };
  let vSet = [];
  for (let i = 1; i < verticalDivs; i++) {
    vSet.push({"x1": i, "y1": 0, "x2": i, "y2": horizontalDivs});
  };
  let dSet1 = [];
  dSet1.push({"x1": 0, "y1": 0, "x2": verticalDivs, "y2": horizontalDivs});
  dSet1.push({"x1": verticalDivs / 2, "y1": 0, "x2": verticalDivs, "y2": horizontalDivs / 2});
  dSet1.push({"x1": 0, "y1": horizontalDivs / 2, "x2": verticalDivs / 2, "y2": horizontalDivs});
  let dSet2 = [];
  dSet2.push({"x1": verticalDivs, "y1": 0, "x2": 0, "y2": horizontalDivs});
  dSet2.push({"x1": verticalDivs / 2, "y1": horizontalDivs, "x2": verticalDivs, "y2": horizontalDivs / 2});
  dSet2.push({"x1": 0, "y1": horizontalDivs / 2, "x2": verticalDivs / 2, "y2": 0});

  makeLines(selector, hSet, 1, "lightgreen");
  makeLines(selector, vSet, 1, "lightblue");
  makeLines(selector, dSet1, 1, "pink");
  makeLines(selector, dSet2, 1, "orange");
  makeCircle(selector, (HEIGHT / verticalDivs) * 3, WIDTH / 2, HEIGHT / 2, 1, "gray", "none", "mainCircle");
}

const verticalSeparator = (selector, x1, y1, x2, y2, width, color) => {
  selector.append( "line" )
    .style("stroke", color)
    .style("stroke-dasharray", (HEIGHT / 4) - 10 + " " + 10)
    .style("stroke-linecap", "round")
    .style("stroke-width", width)
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2);
}

const makeLock = (selector, width = 1, fill = "black", stroke = "white") => {
  selector.append("path")
    .attr("d", "M52,24h-4v-8c0-8.836-7.164-16-16-16S16,7.164,16,16v8h-4c-2.211,0-4,1.789-4,4v32c0,2.211,1.789,4,4,4h40c2.211,0,4-1.789,4-4V28C56,25.789,54.211,24,52,24z M32,48c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S34.211,48,32,48z M40,24,H24v-8c0-4.418,3.582-8,8-8s8,3.582,8,8V24z")
    .attr("fill", fill)
    .attr( "stroke-width", width)
    .attr("stroke", stroke);
  //  <path d="M54.39,22.46H51.62V15.62a15.62,15.62,0,0,0-31.24,0v6.84H17.61A1.61,1.61,0,0,0,16,24.07V54.38A1.61,1.61,0,0,0,17.61,56H54.39A1.61,1.61,0,0,0,56,54.38V24.07A1.61,1.61,0,0,0,54.39,22.46ZM38.52,40.9v6.46a1,1,0,0,1-1,1h-3a1,1,0,0,1-1-1V40.9a4.36,4.36,0,1,1,5,0Zm5.64-18.44H27.84V15.62a8.16,8.16,0,1,1,16.32,0v6.84Z"/>
}

function update(selector, real = false) {
  selector.selectAll("g").remove();
  if (!real) {
    generateHelperLines(selector);
  }

  // Level Icon
  let logoRad = (HEIGHT / 8) - 8;
  let logoCX = WIDTH - (WIDTH / 8);
  let logoCY = HEIGHT / 8;
  if (!real) {
    makeCircle(selector, logoRad - 2, logoCX, logoCY, 1, "blue", "none", "lvlLogo");
    makeCircle(selector, logoRad - 4, logoCX, logoCY, 3, "orange", "none", "lvlLogo");
    makeCircle(selector, logoRad - 6, logoCX, logoCY, 1, "blue", "none", "lvlLogo");
  }
  let arc = d3.arc()
    .innerRadius(logoRad - 1)
    .outerRadius(logoRad + 1)
    .startAngle(0)
    .endAngle(0.42 * (Math.PI * 2));
  
  selector.append( "g" ).append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .attr("fill","purple")
    .attr( "transform", "translate(" + logoCX +  "," + logoCY + ")");
  selector.append( "g" ).append( "path" )
    .attr("d", "M3.769 2.219c0 12.51 2.325 21.765 12.301 27.524 9.74-5.624 12.333-14.98 12.333-27.524-8.027 1.434-16.13 1.605-24.634 0zM15.418 26.291c-3.641-0.127-10.029-10.743-4.945-16.553v0c-1.002 5.844 2.052 6.275 3.534 4.025 1.415-2.147-1.625-6.169 3.935-7.828-2.974 3.633 2.465 13.228 3.773 6.499 3.858 7.819-2.473 13.99-6.298 13.857zM19.736 21.46c0 2.845-1.681 5.152-3.755 5.152s-3.755-2.306-3.755-5.152 1.681-5.152 3.755-5.152 3.755 2.306 3.755 5.152z") 
    .attr("fill", "red")
    .attr("stroke", "orange")
    .attr( "transform", "translate(" + logoCX +  "," + logoCY + ") scale(1.8)")
    .attr("transform-origin", "36 30");


  // // Logo, Location & 42Logo
  makeUserName(selector);
  makeLocation(selector);
  make42Logo(selector);


  // // Separatos
  let sepElem = selector.append( "g" );
  for (let i = 1; i < 5; i++) {
    verticalSeparator(sepElem, (WIDTH / 5) * i, (HEIGHT / 4), (WIDTH / 5) * i, HEIGHT, 1, "lightblue");
  }

  // Projects
  // All paths, are a single path 64 px size
  let dataProjects = [
    {
      name: "libft",
      path: "M30.728 18.612l-2.112-0.697 0.050 0.052-11.683 4.24-11.184-11.823-2.745-0.906c-1.386 0.981-1.541 3.774-0.61 4.746l13.805 14.19 14.602-5.228c-1.33-0.727-2.409-2.796-0.123-4.573zM15.474 22.441l-11.504-11.928h0.344l11.453 11.693-0.294 0.235zM16.353 27.987c0 0-1.592-1.86 0.471-4.334l12.501-4.527c0 0-1.438 2.469 0.245 3.927l-13.217 4.935zM5.799 10.384l-0.382-0.404 11.654-4.138 11.544 12.073 2.112 0.697c-0.010 0.008-0.020 0.016-0.030 0.024l0.246-0.088-13.623-14.125-14.212 5.072 2.69 0.888z",
      percentage: 125,
      solo: false,
    },
    {
      name: "ft_printf",
      path: "M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z",
      percentage: 125,
      solo: false,
    },
    // {
    //   name: "gnl",
    //   path: "M29,11H15V9h1c0.6,0,1-0.4,1-1s-0.4-1-1-1h-4c-0.6,0-1,0.4-1,1s0.4,1,1,1h1v2H3c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h10v2 h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h4c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1v-2h14c0.6,0,1-0.4,1-1V12C30,11.4,29.6,11,29,11z M10,16H9v3 c0,0.6-0.4,1-1,1s-1-0.4-1-1v-3H6c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S10.6,16,10,16z M15,21c0,0.5-0.5,1-1,1s-1-0.5-1-1 v-8c0-0.5,0.5-1,1-1s1,0.5,1,1V21z",
    //   percentage: 125,
    //   solo: false,
    // },
  ];
  let projects = selector.append("g").selectAll( "g" )
    .data( dataProjects ).enter().append( "g" ).attr( "class", d => d['name'] )

  projects.append( "text" )
    .attr( "x", (d, i) => (((WIDTH / 5) * (i % 5)) + WIDTH / 10) )
    .attr( "y", (d, i) => ((HEIGHT / 4) * (Math.floor(i / 5) + 1)) + (HEIGHT / 16))
    .attr( "alignment-baseline", "middle" ).attr( "text-anchor", "middle" )
    .attr( "font-family", "Anonymous Pro").attr( "font-size", WIDTH / 32)
    .text( d => d['name'] );
  let projectG = projects.append( "g" )
    .append("path")
    .attr("d", d => d['path']) 
    .attr("fill", "purple")
    .attr("stroke", "purple")


  projectG.attr( "transform", (d,i) => {
        return "translate(" + ((WIDTH / 5) * i) +  "," + HEIGHT / 4 + ") scale(" + (WIDTH / 467) * 2 + ")"
  })
  .attr("transform-origin", "-25 -25");
// d="M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.25 15.8011 15.329 15.6103 15.4697 15.4697C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z"
// d="M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z"
// d="M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z"


  // Locks
  for (let i = dataProjects.length; i < 15; i++) {
      let lock = selector.append( "g" );
      makeLock(lock, 1, "rgba(255, 255, 255, 0.42)", "none");
      lock.attr( "transform", "translate(" + (((WIDTH / 5) * (i % 5)) + (WIDTH / 32)) + ", " + (((HEIGHT / 4) * (Math.floor(i / 5) + 1)) + (HEIGHT / 32)) + ")" + "scale(" + WIDTH / 467  + ")");   
  }
}

window.addEventListener("load", () => { 
  d3.selectAll("svg")
    .attr( "width", WIDTH )
    .attr( "height", HEIGHT );

  svg = d3.select("#portfolio_svg");
  resultSvg = d3.select("#result_portfolio_svg");
  
  d3.select( "#verticalDivs" ).on("change", () => {
      update(svg);
  });

  d3.select( "#horizontalDivs" ).on("change", () => {
    update(svg);
  });

  const resolutions = {"sm": {w: 467, h: 374}, "md": {w: 640, h: 480}, "lg": {w: 1152, h: 864}};

  d3.selectAll( '.radioInput' ).on('change', function(d) {
    HEIGHT = resolutions[this.value].h;
    WIDTH = resolutions[this.value].w;
    svg.attr( "width", WIDTH ).attr( "height", HEIGHT );
    resultSvg.attr( "width", WIDTH ).attr( "height", HEIGHT );
    update(svg);
    update(resultSvg, true);
  });

  update(svg);
  update(resultSvg, true);
});
