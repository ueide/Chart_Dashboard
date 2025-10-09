
function AnnualEarnings() {

  //Name for the visualisation to appear in the menu bar.
  //An icon to go next to the name
  this.iconPath = "assets/icons/iconWallet.svg";
  this.navTitle = "Annual Earnings";
  //Each visualisation must have a unique ID with no special characters.
  this.id = "annual-earnings";

  //Layout object to store all common plot layout parameters and methods.
  this.layout = {
    //Locations of margin positions. 
    leftMargin: 350, 
    rightMargin: width - 48,
    topMargin: 100, //distance between the chart and the title;
    bottomMargin: height - 180,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },
  };


  // Bar colours.
  this.maleColour = color(114, 166, 215);
  this.femaleColour = color(242, 157, 210);

  // Property to represent whether data has been loaded.
  this.loaded = false;
  this.maleIcon = null;
  this.femaleIcon = null;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    let self = this;
    this.data = loadTable(
    'data/bar-Chart/median_annual_earnings.csv', 'csv', 'header',
    // Callback function to set the value
    // this.loaded to true.

      function(table) {
        self.loaded = true; //load data
        //load the icons
        self.maleIcon = loadImage("assets/bar-icons/male.png");
        self.femaleIcon = loadImage("assets/bar-icons/female.png");
      }
    );
  };

  this.destroy = function() {
    // Reset settings
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
      console.log('bar chart data not yet loaded');
      return;
    }

    //call draw text
    this.drawText();

      //The graphic
      let maxSalary = 70000;//max hight
      let yBase = this.layout.bottomMargin; //plot bottom
      let barWidth = 36; //bar thickness
      let groupSpacing = 132; ///space between the categories
      let xPos = this.layout.leftMargin + 112;
      let barHeight = this.layout.bottomMargin - this.layout.topMargin - 152;

      //Draw the structure of the graph
      stroke(38);
      strokeWeight(1.2);
      //contour lines
      line(xPos - 64, 228, xPos - 64, yBase );
      line(this.layout.rightMargin - 4, 228,this.layout.rightMargin - 4, yBase);
      line(xPos - 64, yBase, this.layout.rightMargin - 4, yBase);

      stroke(220);
      strokeWeight(1.4); //dashed line stroke
      drawingContext.setLineDash([4, 4]);//draw the dotted line
      textAlign(RIGHT, CENTER);
      textSize(12);
      
      for(let i = 1; i <= 7; i++) {
        let y = map(i, 0, 7, yBase, this.layout.topMargin + 148);
        let value = (i * 10000).toLocaleString(); //side value
        
        line(xPos - 64, y, this.layout.rightMargin - 6, y);
        //dashed line

        noStroke();
        fill(38);
        text(value, xPos - 76, y);//side value
        stroke(200);
      }

      drawingContext.setLineDash([]); //stop the dashed line
      noStroke();


      //Get info from the CSV to draw the bar chart
      for (let i = 0; i < this.data.getRowCount(); i++) {
        let row = this.data.getRow(i);
        let group = row.getString('range');
        let male = row.getNum('male');
        let female = row.getNum('female');

        //map annual earnings
        let maleBar = map(male, 0, maxSalary, 0, barHeight);
        let femaleBar = map(female, 0, maxSalary, 0, barHeight);
        let xGroup = xPos + i * groupSpacing;//draw the pairs of bars

        //male bar
        fill(this.maleColour);
        rect(xGroup - barWidth, yBase - maleBar, barWidth, maleBar);

        //female bar
        fill(this.femaleColour);
        rect(xGroup, yBase - femaleBar, barWidth, femaleBar);

        //Draw Icons
        // Draw Icons (above the bars, offset)
        if (this.maleIcon && this.femaleIcon) {
          imageMode(CENTER);
          image(this.maleIcon, xGroup - barWidth / 2, 
            yBase - maleBar + 20, 36, 36);
          image(this.femaleIcon, xGroup + barWidth / 2, 
            yBase - femaleBar + 20, 36, 36);
        }

        //show salary values above bar
        fill(38);
        textSize(12)
        textStyle(BOLD);
        textAlign(CENTER);
        text(nfc(male), xGroup - 18, yBase - maleBar - 20);//text above
        text(nfc(female), xGroup + 18, yBase - femaleBar - 16);//text above

        //category label (age)
        textSize(16);
        textAlign(CENTER);
        textStyle(NORMAL);
        text(group, xGroup, yBase + 20);
        
      } //end for loop


      // Legend - Top Right
      let legendX = this.layout.rightMargin - 130;
      let legendY = this.layout.topMargin + 56;

      // Male icon
      image(this.maleIcon, legendX - 80, legendY + 40, 28, 28);
      fill(38);
      textSize(18);
      textAlign(LEFT, CENTER);
      text('Male', legendX - 56, legendY + 44);
      
      // Female icon
      image(this.femaleIcon, legendX + 40, legendY + 40, 28, 28);
      text('Female', legendX + 64, legendY + 44);

  };


  //draw the text
  this.drawText = function() {
      //Text
      fill(38);//text colour

      //Title
      textSize(22);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text('Median Annual Earnings', this.layout.leftMargin, 
                                      this.layout.topMargin);
      
      //Subtitle
      textSize(18);
      textStyle(NORMAL);
      text("Average annual earnings of full-time workers in the UK by age in 2024.", 
            this.layout.leftMargin, this.layout.topMargin + 32);
      
      //Y and X axis labels
      textSize(12);
      text("GBP", this.layout.leftMargin + 36, 204);
      text("Age", this.layout.leftMargin + 36, this.layout.bottomMargin + 19);
  };

}
