var createTable = function (target, data, css) {
  // (A) SORT FUNCTION
  // CREDITS: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  target = document.getElementById(target);
  let sflag = { key: null, direction: true }, // chosen key to sort by
      sorder = [], // sort order
      trgtformat = data != null ? "data" : ( target.tagName == "TABLE" ? "table" : "bootstrap" ) // target format
      ;
  let tsort = function () {
    // (A1) SET SORTING KEY (REVERSE SORT IF CLICK ON FIELD TWICE)
    let skey = this.innerHTML;
    if (sflag.key == skey) {
      sflag.direction = !sflag.direction;
    } else {
      sflag.key = skey;
      sflag.direction = true;
    }
    
    // (A2) MAP ARRAY TO BE SORTED
    var mapped = data[this.innerHTML].map(function(v, i) {
      return { i: i, v: v };
    });

    // (A3) SORT ARRAY - RETAIN INDEX POSITIONS
    if (sflag.direction) {
      mapped.sort(function(a, b) {
        if (a.v > b.v) { return 1; }
        if (a.v < b.v) { return -1; }
        return 0;
      });
    } else {
      mapped.sort(function(a, b) {
        if (a.v < b.v) { return 1; }
        if (a.v > b.v) { return -1; }
        return 0;
      });
    }
    
    // (A4) NEW SORT ORDER
    sorder = [];
    for (var idx in mapped) { sorder.push(mapped[idx].i); }
    
    // (A5) REDRAW TABLE
    if (trgtformat != "bootstrap")
      tdraw();
    else
      tdrawb();
  };
  
  // (B) DEAL WITH HTML TABLE
  let etable = null,
      ehead = null,
      ehrow = null,
      ebody = null;
// console.log(target.tagName)
// console.log(target.innerHTML)
console.log(trgtformat)
  // (B1) CREATE NEW TABLE
  if (trgtformat == "data") {
    etable = document.createElement("table");
    ehead = document.createElement("thead");
    ehrow = document.createElement("tr");
    ebody = document.createElement("tbody");
    etable.appendChild(ehead);
    etable.appendChild(ebody);
    ehead.appendChild(ehrow);
    target.appendChild(etable);
  }
  // (B2) ADAPT FROM EXISTING HTML TABLE
  else if (trgtformat == "table") {
    // Adapt elements
    etable = target;
    ehead = etable.getElementsByTagName("thead")[0];
    ehrow = ehead.getElementsByTagName("tr")[0];
    ebody = etable.getElementsByTagName("tbody")[0];
    
    // Adapt data - get keys + attach click to sort
    data = {};
    let keys = [];
    for (let i of ehead.getElementsByTagName("th")) {
      keys.push(i.innerHTML);
      data[i.innerHTML] = [];
      i.addEventListener("click", tsort);
    }
    
    // Adapt data - get values
    let j = 0;
    for (let i of ebody.getElementsByTagName("td")) {
      if (j >= keys.length) { j = 0; }
      // data[keys[j]].push(i.innerHTML);
      data[keys[j]].push( (i.innerHTML == i.innerHTML+"" && parseFloat(i.innerHTML)+"" == i.innerHTML ) ? parseFloat(i.innerHTML) : i.innerHTML );
      // console.log(j,keys[j],i.innerHTML, (i.innerHTML == i.innerHTML+"" && parseFloat(i.innerHTML)+"" == i.innerHTML ) ? parseFloat(i.innerHTML) : i.innerHTML )
      j++;
    }
  }
  // (B3) CREATE FROM BOOTSTRAP ROW COL
  else if (trgtformat == "bootstrap") {
    // Adapt elements
    etable = target;
    ehead = target.children[0];
    ebody = target;
    
    // Adapt data - get keys + attach click to sort
    data = {};
    dataClassCol = {};
    dataClassRow = [];
    let keys = [];
    for (let i of ehead.getElementsByTagName("div")) {
      keys.push(i.innerHTML);
      data[i.innerHTML] = [];
      dataClassCol[i.innerHTML] = [];
      i.addEventListener("click", tsort);
    }
    
    // Adapt data - get values
    let j = 0;
    for (let k of ebody.getElementsByTagName("div")) {
      for (let i of k.getElementsByTagName("div")) {
        if (j >= keys.length) { j = 0; dataClassRow.push(k.attributes.class.value);}
        // data[keys[j]].push(i.innerHTML);
        data[keys[j]].push( (i.innerHTML == i.innerHTML+"" && parseFloat(i.innerHTML)+"" == i.innerHTML ) ? parseFloat(i.innerHTML) : i.innerHTML );
        dataClassCol[keys[j]].push(i.attributes.class.value);
        j++;
      }
    }
    for (let key in data) {
      data[key].shift();
      dataClassCol[key].shift();
    }
// console.log(data)
// console.log(dataClassCol)
console.log(dataClassRow)
  }
  if (css) { etable.classList.add(css); }
  
  // (C1) DRAW TABLE ROWS
  let tdraw = function () {
    // (C1-1) REMOVE OLD SORT ORDER
    ebody.innerHTML = "";
    
    // (C1-2) DRAW NEW SORT ORDER
    let row = null, cell = null;
    for (let i=0; i<sorder.length; i++) {
      row = document.createElement("tr");
      ebody.appendChild(row);
      for (let key in data) {
        cell = document.createElement("td");
        cell.innerHTML = data[key][sorder[i]];
        row.appendChild(cell);
      }
    }
  };
  // (C2) DRAW TABLE ROWS
  let tdrawb = function () {
    // (C2-1) REMOVE OLD SORT ORDER
    while (ebody.childNodes.length > 2) {
      ebody.removeChild(ebody.lastChild);
    }
    
    // (C2-2) DRAW NEW SORT ORDER
    let row = null, cell = null;
    for (let i=0; i<sorder.length; i++) {
      row = document.createElement("div");
      row.className = dataClassRow[i];
      ebody.appendChild(row);
      for (let key in data) {
        cell = document.createElement("div");
        cell.innerHTML = data[key][sorder[i]];
        cell.className = dataClassCol[key][sorder[i]];
        row.appendChild(cell);
      }
    }
  };

  // (D) FOR NEW TABLES ONLY
  if (trgtformat == "data") {
    // (D1) CREATE HEADER CELLS
    let cell = null, title = null;
    for (title in data) {
      cell = document.createElement("th");
      cell.innerHTML = title;
      cell.addEventListener("click", tsort);
      ehrow.appendChild(cell);
    }
    
    // (D2) DRAW TABLE ROWS
    for (let i=0; i<data[title].length; i++) { sorder.push(i); }
    tdraw();
  }
};