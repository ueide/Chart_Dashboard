function PieChart(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 60;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title, iconsP) {

    // Test that data is not empty and that each input array is the same length
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      //error alert
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }

    // pie chart
    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    // the loop that draw the pie chart
    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      //add the colours and a light stroke in the splice chart
      fill(colour);
      stroke(255);
      strokeWeight(1.2);

      arc(this.x, this.y,
          this.diameter, this.diameter,
          lastAngle, lastAngle + angles[i] + 0.001,
        PIE
      ); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour, data, iconsP);
      }

      //add the icons in the chart
      if (iconsP && iconsP[i] ) {
        let icon = iconsP[i];
        let angle = lastAngle + angles[i] / 2;
        let r = this.diameter * 0.58; //radius of the circle 
        //Adjust the icon distance from center

        //position from the center of the circle to the border - diameter
        let iconX = this.x + cos(angle) * r;
        let iconY = this.y + sin(angle) * r;

        //.toFix shows values in 2 decimals 
        if(data[i].toFixed(2) > 0.00) { //if the percentage is 0.00, don't show
        imageMode(CENTER);//legend icons position
        image(icon, iconX, iconY, 32, 32);//draw the icons in the slice
        }
      }

      lastAngle += angles[i];
    }

    //write the title "employee diversity at"
    if (title) {
      fill(38);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      textStyle(BOLD);
      text(title, 350, 160);
    }

  };

  //pie chart legend "white, asian..."
  this.makeLegendItem = function( label, i, colour, data, iconsP) {
    var x = 350;
    var y = 188 + (this.labelSpace * i);
    var boxWidth = 26;
    var boxHeight = 26;

    // Draw the icon in the square (if available)
    if (iconsP && iconsP[i]) {
      imageMode(CORNER);//position
      image(iconsP[i], x, y, boxWidth, boxHeight);//draw icons
    }

    //company races
    fill(38);
    noStroke();
    textAlign(RIGHT, CENTER);
    textStyle(NORMAL);
    textSize(17);
    //percentage
    var percentage = data[i].toFixed(2) + " %";
    text(percentage, (x + boxWidth + 16) + 176, y + boxWidth / 2);

    //text label
    textAlign(LEFT, CENTER);
    text(label, x + boxWidth + 16, y + boxWidth / 2);
  };
  
}
