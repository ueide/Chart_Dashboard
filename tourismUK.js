function TourismUk() {

  //Name for the visualisation to appear in the menu bar.
  //An icon to go next to the name
  this.iconPath = "assets/icons/iconPlane.svg";
  this.navTitle = "Tourism";

  // Each visualisation must have a unique ID with no special characters.
  this.id = 'tourism-uk';

  // Title to display above the plot.
  this.title = 'Tourism in the United Kingdom';

  //Layout object to store all common plot layout parameters and methods.
  this.layout = {
    //Locations of margin positions. 
    leftMargin: 350, 
    rightMargin: width - 88,
    topMargin: 100, //distance between the chart and the title;
    bottomMargin: height - 180,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      'data/line-Chart/tourism_in_UK.csv','csv', 'header',

      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    //store data
    this.months = this.data.getColumn('month');
    this.year2023 = this.data.getColumn('2023');
    this.year2024 = this.data.getColumn('2024');
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
    drawingContext.setLineDash([]); // removes dotted lines
  };


  this.draw = function() {
    if (!this.loaded) {
      console.log('line chart data not yet loaded');
      return;
    }

    this.drawText(); //call function draw text
    this.drawGraph(); //call function draw graph
    this.drawTooltip();// call function draw tooltip
  };


  this.drawText = function() {
    //Text
    fill(38);//text colour

    //Title
    textSize(22);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.title, this.layout.leftMargin, this.layout.topMargin);//title

    //Subtitle
    textSize(18);
    textStyle(NORMAL);
    text("The number of people entering the UK in 2023 and 2024.", 
      this.layout.leftMargin, this.layout.topMargin + 32);
    
    //Y-axis label
    textSize(14);
    text("Tourist count (in millions)", this.layout.leftMargin + 28, 
      this.layout.topMargin + 104);

    // Legend - Top Right
    let legendX = this.layout.rightMargin - 140;
    let legendY = this.layout.topMargin + 56;

    // 2023 statistics
    textSize(16);
    textAlign(LEFT, CENTER);
    text('2023 statistics', legendX - 156, legendY + 50);
    fill(50, 168, 82);
    rect(legendX - 184, legendY + 40, 16, 16);
    
    // 2024 statistics
    fill(32, 83, 199);//colour
    ellipse(legendX + 16, legendY + 48, 16);
    fill(38);
    text('2024 statistics', legendX + 36, legendY + 50);

  };



  this.drawGraph = function() {

    //The graph
    let maxVal = 16000;//max hight
    let yBase = this.layout.bottomMargin - 56; // bottom
    let xLeft = this.layout.leftMargin + 96;
    let xRight = this.layout.rightMargin - 24;
    let top = this.layout.topMargin + 148;
    let spacing = (xRight - xLeft)  / (this.months.length - 1);

    //Draw the structure of the graph
    stroke(38);
    strokeWeight(1.2);
    //contour lines
    line(xLeft - 64, 228, xLeft - 64, yBase );
    line(xRight + 20, 228, xRight + 20,yBase );
    line(xLeft - 64, yBase, xRight + 20, yBase);

    stroke(220);
    strokeWeight(1.4); //dashed line stroke
    drawingContext.setLineDash([4, 4]);//draw the dashed line

    textAlign(RIGHT, CENTER);
    textSize(14);
    for(let i = 1; i <= 8; i++) {
      let y = map(i, 0, 8, yBase, top);
      let value = (i * 2).toLocaleString(); //side value

      //dashed line
      line(this.layout.leftMargin + 32, y, this.layout.rightMargin, y);

      noStroke();
      fill(38);
      text(value, this.layout.leftMargin + 20, y);//left side value
      stroke(200);//dashed line colour
    }

    drawingContext.setLineDash([]); //stop the dashed line
    noStroke();

    //plot the data points
    let points2023 = [];
    let points2024 = [];

    for(let i = 0; i < this.months.length; i++) {
      let x = (xLeft - 32) + i * spacing;

      //y values for year
      let y2023 = map(this.year2023[i], 0, maxVal, yBase, top);
      let y2024 = map(this.year2024[i], 0, maxVal, yBase, top);

      //push
      points2023.push({x, y: y2023});
      points2024.push({x, y: y2024});
    }


    //draw 2023 line + squares
    stroke(50, 168, 82); // colour
    strokeWeight(2);
    noFill();
    beginShape(); //start draw line
    for(let plot of points2023) {
      vertex(plot.x, plot.y);
    }
    endShape();//end line

    //draw squares
    for(let plot of points2023) {
      fill(50, 168, 82);//colour
      noStroke();
      rectMode(CENTER);
      rect(plot.x, plot.y, 10, 10);
    }


    //draw 2024 lines + circles
    stroke(32, 83, 199)//colour
    strokeWeight(2);
    noFill();
    //start to draw the line
    beginShape();
    for(let plot of points2024) {
      vertex(plot.x, plot.y);
    }
    endShape();

    for (let plot of points2024) {
      fill(32, 83, 199);//colour
      noStroke();
      ellipse(plot.x, plot.y, 10, 10);
    }

    //Draw month label
    fill(38);
    textAlign(CENTER);
    textSize(14);
    for(let i = 0; i < this.months.length; i++) {
      let x = (xLeft - 32) + i * spacing;
      text(this.months[i], x, yBase + 16);

    //store data
    this.points2023 = points2023;
    this.points2024 = points2024;
    }
  };


  //tooltip = when mouse is over the square or circle data
  //display a text about the data.
  this.drawTooltip = function() {
    
    rectMode(CORNER); // Fix square alignment

    //If the mouse is not hovering over the items, return
    if(!this.points2023 || !this.points2024) return;

    //check position and distance
    for(let i = 0; i < this.points2023.length; i++) {
      let pt2023 = this.points2023[i];
      let pt2024 = this.points2024[i];

      let d1 = dist(mouseX, mouseY, pt2023.x, pt2023.y);
      let d2 = dist(mouseX, mouseY, pt2024.x, pt2024.y);

      //if the mouse if hovering over, do something
      if(d1 < 8 || d2 < 8) { // N left axis label (2, 4, 6...16)
        let month = this.months[i];
        let val2023 = this.year2023[i];
        let val2024 = this.year2024[i];

        //box
        let tooltipX = pt2023.x + 16;//distance from the mouse position
        let tooltipY =  pt2024.y - 56 
        let w = 104; //box width
        let h = 80; //box height

        //float box
        fill(255);
        stroke(220);
        strokeWeight(1);
        rectMode(CORNER);
        rect(tooltipX, tooltipY, w, h, 8);

        //Month text
        noStroke();
        fill(38);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        textSize(14);
        text(month, tooltipX + 18, tooltipY + 12);

        //Values
        textStyle(NORMAL);
        textSize(12);
        //2024 ellipse
        fill(32, 83, 199);
        ellipse(tooltipX + 22, tooltipY + 40, 8);
        fill(38);
        text(nfc(val2024) + ",000", tooltipX + 30, tooltipY + 34);
        //2023 rect
        fill(50, 168, 82);
        rect(tooltipX + 18, tooltipY + 58, 8, 8);
        fill(38);
        text(nfc(val2023) + ",000", tooltipX + 30, tooltipY + 56);

        //black line
        stroke(38);
        strokeWeight(2);
        line(pt2024.x, pt2024.y, pt2024.x, this.layout.bottomMargin - 56);
        noStroke();

        break;

      };//end IF
    }; //end FOR
  };//end drawTooltip

}
