function WorkplaceDiversity() {

  //Name for the visualisation to appear in the menu bar
  //and an icon to go next to the name
  this.iconPath = "assets/icons/iconProperty.svg";
  this.navTitle = "Workplace Diversity";
  // Each visualisation must have a unique ID with no special characters.
  this.id = 'workplace-diversity';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.images = {}; //pie chart images


  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      'data/pie-Chart/race-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function() {
        self.loaded = true;
      });


//load image for the pie chart
  const categories = ['white', 'asian', 'latino', 'black', 'multi', 'other'];
    for (let cate of categories) {
      self.images[cate] = loadImage(`assets/pie-icons/${cate}.png`);
    }
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('pie chart data not yet loaded');
      return;
    }

    // Create Dropdown button, using DOM element. 
    this.select = createSelect();
    this.select.position(352, 76);

    // Fill the options with all company names.
    var companies = this.data.columns;
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
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
    this.select.remove();//remove the dropdown button
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2 + 300, height / 2 - 120, width * 0.3);

  this.draw = function() {
    if (!this.loaded) {
      console.log('pie chart data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['#F0AB8D', '#80B29A', '#7EF1F5',
                    '#81C2FF', '#F397FE', '#BCBABA'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart and the iconsPieChart (iconsP)
    let iconsP = labels.map(label => this.images[label.toLowerCase()]);
    this.pie.draw(col, labels, colours, title, iconsP);
    //toLowerCase is used to ensure that the PNG files match the 
    // format of the stored keys in " this.images ".
  };
  
}