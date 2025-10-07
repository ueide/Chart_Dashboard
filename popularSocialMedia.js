
function PopularSocialMedia() {

  // Name for the visualisation to appear in the menu bar.
  //An icon to go next to the name
  this.iconPath = "assets/icons/iconHeart.svg";
  this.navTitle = "Social Media";
  // Each visualisation must have a unique ID with no special characters.
  this.id = 'social-media';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.icons = {};// store icons
  this.bubbles = [];// store bubble circles

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      'data/bubble-Chart/popular_social_media.csv', 'csv', 'header',

      // this.loaded to true.
      function(table) {
        self.loaded = true;

        //load icons
        for (let i = 0; i < self.data.getRowCount(); i++) {
          let company = self.data.getString(i, 'company');
          let iconCom = `assets/bubble-icons/${company.toLowerCase()}.png`;
          self.icons[company] = loadImage(iconCom);
        }
      });
  };

  this.setup = function() {
    if(!this.loaded) {
      console.log('bubble chart data not yet loaded');
      return;
    }

    //clear the array every time the setup is called.
    this.bubbles = [];

    let rows = this.data.getRows();
    let maxUsers = max(rows.map(r => float(r.get('data'))));

    //For Of Loop
    //r receives the value of each item on variable Rows
    for(let r of rows) {
      let name = r.get('company');
      let users = float(r.get('data'));
      let size = map(users, 0, maxUsers, 20, 190);

      //put the circle inside the array
      this.bubbles.push({
        name, users, size,
        img: this.icons[name],
        x: random(400, width - 80),//start position in x
        y: random(210, height - 400), //start position in y
        dx: random(-1, 1), //movement in x
        dy: random(-1, 1) //movement in y
      });
    }
  };

  this.destroy = function() {
    // Reset any shared p5 settings
    imageMode(CORNER);
    textAlign(LEFT, BASELINE);
    textStyle(NORMAL);
    textSize(12);
    stroke(0);
    strokeWeight(1);
    fill(0);
    rectMode(CORNER);
  };



  this.draw = function() {
    if (!this.loaded) {
      console.log('bubble chart data not yet loaded');
      return;
    }

    //Title
    fill(38);
    noStroke();
    textAlign(LEFT);
    textSize(22);
    textStyle(BOLD);
    text("Most Popular Social Media Platforms Worldwide", 350, 106);
    //Subtitle
    textSize(18);
    textStyle(NORMAL);
    text("Number of registered users on each platform - data from February 2025.",
          350, 136);

    //animate and draw the bubbles
    for (let b of this.bubbles) { //shortening name
      b.x += b.dx;
      b.y += b.dy;

      //animation
      if (b.x < 400 + b.size / 2 || b.x > width - 80 - b.size / 2) {
        b.dx *= -1;
      }
      if (b.y < 180 + b.size / 2 || b.y > height - 400 - b.size / 2) {
        b.dy *= -1;
      }
      //draw
      imageMode(CENTER);
      image(b.img, b.x, b.y, b.size, b.size);
    }
  
    this.drawLegend();//draw legend
};

//create legend
this.drawLegend = function () {
  let yPos = height - 300; // y position (row)
  let xPos = 380; // x position (column)
  let spacing = 92; // space between items

  for (let i = 0; i < this.bubbles.length; i++) {
    let b = this.bubbles[i];
    let x = xPos + i * spacing;

    //text default
    fill(38);
    textAlign(CENTER);

    //company name
    textSize(14);
    textStyle(BOLD);
    text(b.name, x, yPos);

    //Number of users
    textSize(16);
    textStyle(NORMAL);
    text(nfc(b.users), x, yPos + 24);
  }

    //decorative line
    stroke(56);
    strokeWeight(1.2);
    line(340, yPos - 30, width , yPos - 30);

};
}
