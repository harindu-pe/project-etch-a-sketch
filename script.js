// reference to the buttons on the HTML
const reset_button = document.getElementById("reset");
const black_button = document.getElementById("black");
const rainbow_button = document.getElementById("rainbow");
const opaque_button = document.getElementById("opaque");
const pick_button = document.getElementById("pick");
const eraser_button = document.getElementById("eraser");

// variable to track selected button
let selectedButton = "reset";

// variable to track the selected color
let userColor = "#ff0000";

// storing the button elements in an array for easier processing
const buttonArray = [
  reset_button,
  black_button,
  rainbow_button,
  opaque_button,
  pick_button,
  eraser_button,
];

// utility function to darken color
const pSBC = (p, c0, c1, l) => {
  let r,
    g,
    b,
    P,
    f,
    t,
    h,
    i = parseInt,
    m = Math.round,
    a = typeof c1 == "string";
  if (
    typeof p != "number" ||
    p < -1 ||
    p > 1 ||
    typeof c0 != "string" ||
    (c0[0] != "r" && c0[0] != "#") ||
    (c1 && !a)
  )
    return null;
  if (!this.pSBCr)
    this.pSBCr = (d) => {
      let n = d.length,
        x = {};
      if (n > 9) {
        ([r, g, b, a] = d = d.split(",")), (n = d.length);
        if (n < 3 || n > 4) return null;
        (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
          (x.g = i(g)),
          (x.b = i(b)),
          (x.a = a ? parseFloat(a) : -1);
      } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6)
          d =
            "#" +
            d[1] +
            d[1] +
            d[2] +
            d[2] +
            d[3] +
            d[3] +
            (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5)
          (x.r = (d >> 24) & 255),
            (x.g = (d >> 16) & 255),
            (x.b = (d >> 8) & 255),
            (x.a = m((d & 255) / 0.255) / 1000);
        else
          (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
      }
      return x;
    };
  (h = c0.length > 9),
    (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
    (f = this.pSBCr(c0)),
    (P = p < 0),
    (t =
      c1 && c1 != "c"
        ? this.pSBCr(c1)
        : P
        ? { r: 0, g: 0, b: 0, a: -1 }
        : { r: 255, g: 255, b: 255, a: -1 }),
    (p = P ? p * -1 : p),
    (P = 1 - p);
  if (!f || !t) return null;
  if (l)
    (r = m(P * f.r + p * t.r)),
      (g = m(P * f.g + p * t.g)),
      (b = m(P * f.b + p * t.b));
  else
    (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
      (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
      (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
  (a = f.a),
    (t = t.a),
    (f = a >= 0 || t >= 0),
    (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
  if (h)
    return (
      "rgb" +
      (f ? "a(" : "(") +
      r +
      "," +
      g +
      "," +
      b +
      (f ? "," + m(a * 1000) / 1000 : "") +
      ")"
    );
  else
    return (
      "#" +
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
        .toString(16)
        .slice(1, f ? undefined : -2)
    );
};

// generate sketchpad
let tileNum = 16;
// reference the tile-container html element
const tile_container = document.querySelector(".tile-container");
const tile_container_styles = window.getComputedStyle(tile_container);
const tile_container_width = tile_container_styles.width;
const tile_container_height = tile_container_styles.height;
// get the width and height of tile-container element to figure out the tile size
let tileWidth = parseInt(tile_container_width, 10) / tileNum;
let tileHeight = parseInt(tile_container_height, 10) / tileNum;

for (let i = 0; i < tileNum * tileNum; i++) {
  // creating the tile
  const tile = document.createElement("div");
  tile.style.width = tileWidth + "px";
  tile.style.height = tileHeight + "px";
  tile.style.backgroundColor = "#FFFFFF";
  tile.style.borderStyle = "solid";
  tile.style.borderWidth = "thin";
  tile.style.boxSizing = "border-box";
  tile.classList.add(`tile`);
  tile.id = i + 1;
  // adding tile to tile container
  tile_container.appendChild(tile);
}

// reference the individual tiles created
let tiles = document.querySelectorAll(".tile");
// iterate through each tile
tiles.forEach((tile) => {
  // for each tile we add an event listener
  tile.addEventListener("mouseover", () => {
    // logic for each button
    switch (selectedButton) {
      case "black":
        // sketch black
        document.getElementById(`${tile.id}`).style.backgroundColor = "#000000";
        break;
      case "rainbow":
        // generate random color
        let maxVal = 0xffffff; // 16777215
        let randomNumber = Math.random() * maxVal;
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);
        // sketch rainbow
        document.getElementById(
          `${tile.id}`
        ).style.backgroundColor = `#${randColor.toUpperCase()}`;
        break;
      case "opaque":
        // darken color
        let existingColor = document.getElementById(`${tile.id}`).style
          .backgroundColor;
        // update sketch
        document.getElementById(`${tile.id}`).style.backgroundColor = pSBC(
          -0.2,
          existingColor
        );
        break;
      case "pick":
        // sketch user picked color
        userColor = document.getElementById("favcolor").value;
        document.getElementById(`${tile.id}`).style.backgroundColor = userColor;
        break;
      case "eraser":
        // erase
        document.getElementById(`${tile.id}`).style.backgroundColor = "white";
        break;
    }
  });
});

// adding event listeners for each of the buttons
buttonArray.forEach((button) => {
  button.addEventListener("click", () => {
    // getting the selected button
    selectedButton = button.id;
    // indicate to user selected button
    buttonArray.forEach((button) => {
      if (button.id === selectedButton) {
        document.getElementById(`${button.id}`).style.opacity = 1;
      } else {
        document.getElementById(`${button.id}`).style.opacity = 0.5;
      }
    });
    // if reset
    if (selectedButton === "reset") {
      resetLogic();
    }
    // if pick
    if (selectedButton === "pick") {
      userColor = document.getElementById("favcolor").value;
    }
  });
});

// reset button logic
function resetLogic() {
  // prompt user for num of tiles
  tileNum = prompt("Enter number of squares per side");
  // limit tiles to less than 101
  if (tileNum > 100) {
    tileNum = 100;
  }
  // get the width and height of tile-container element to figure out the tile size
  tileWidth = parseInt(tile_container_width, 10) / tileNum;
  tileHeight = parseInt(tile_container_height, 10) / tileNum;
  // reference the individual tiles created
  let tiles = document.querySelectorAll(".tile");
  // remove existing tiles
  tiles.forEach((tile) => {
    tile_container.removeChild(tile);
  });
  // regenerate tiles
  for (let i = 0; i < tileNum * tileNum; i++) {
    // creating the tile
    const tile = document.createElement("div");
    tile.style.width = tileWidth + "px";
    tile.style.height = tileHeight + "px";
    tile.style.backgroundColor = "#FFFFFF";
    tile.style.borderStyle = "solid";
    tile.style.borderWidth = "thin";
    tile.style.boxSizing = "border-box";
    tile.style.borders;
    tile.classList.add(`tile`);
    tile.id = i + 1;
    // adding tile to tile container
    tile_container.appendChild(tile);
  }
  // reference the individual tiles created
  tiles = document.querySelectorAll(".tile");
  // iterate through each tile
  tiles.forEach((tile) => {
    // for each tile we add an event listener
    tile.addEventListener("mouseover", () => {
      // logic for each button
      switch (selectedButton) {
        case "black":
          // sketch black
          document.getElementById(`${tile.id}`).style.backgroundColor =
            "#000000";
          break;
        case "rainbow":
          // generate random color
          let maxVal = 0xffffff; // 16777215
          let randomNumber = Math.random() * maxVal;
          randomNumber = Math.floor(randomNumber);
          randomNumber = randomNumber.toString(16);
          let randColor = randomNumber.padStart(6, 0);
          // sketch rainbow
          document.getElementById(
            `${tile.id}`
          ).style.backgroundColor = `#${randColor.toUpperCase()}`;
          break;
        case "opaque":
          // darken color
          let existingColor = document.getElementById(`${tile.id}`).style
            .backgroundColor;
          // update sketch
          document.getElementById(`${tile.id}`).style.backgroundColor = pSBC(
            -0.2,
            existingColor
          );
          break;
        case "pick":
          // sketch user picked color
          userColor = document.getElementById("favcolor").value;
          document.getElementById(`${tile.id}`).style.backgroundColor =
            userColor;
          break;
        case "eraser":
          // erase
          document.getElementById(`${tile.id}`).style.backgroundColor = "white";
          break;
      }
    });
  });
}
