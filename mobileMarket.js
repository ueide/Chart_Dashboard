
function MobileMarket(){

    //Name for the visualisation to appear in the menu bar.
    //An icon to go next to the name
    this.iconPath = "assets/icons/iconMobile.svg";
    this.navTitle = "Mobile Market";
    // Each visualisation must have a unique ID with no special characters.
    this.id = 'mobile-market';

    this.loaded = false;

    //Store donut chart object
    this.donutChart = null;

    //Data info
    var companyNames = [];
    var marketShares = [];
    var colours = [];

    this.preload = function() {
        let self = this;
        this.data = loadTable(
        'data/donut-Chart/mobile_market.csv', 'csv', 'header',

        // this.loaded to true.
        function() {
            self.loaded = true; //set to true when data is loaded

            let headers = self.data.columns;
            let dataRow = self.data.getRow(0);

            for(let i = 1; i < headers.length; i++) {
                let company = headers[i]; //get header name from the data
                let share = dataRow.getNum(company); // get only numbers

                companyNames.push(company);
                marketShares.push(share);
            }

            colours = [
                '#3E2B35', '#E55C45', '#D19852', //Apple, samsung, Google
                '#71B230', '#43BFC8', '#2054C4', // Motorola, Unknown, Xiaomi
                '#7C2CC6', '#BCE519' // Huawei, Others
            ];

            //check if match the number of companies and colours
            if (companyNames.length < colours.length) {
                // If fewer companies than colours, truncate the colours array
                colours = colours.slice(0, companyNames.length);
                console.log("Adjusted colors array to match number of companies.");
            } else if (companyNames.length > colours.length) {
                // If more companies than colors, display a warning (as before)
                console.warn("Number of companies exceeds available colors");
            }
        });
    };


    this.setup = function() {
        if(!this.loaded) {
            console.log('donut chart data not yet loaded');
            return;
        };

        //Instantiate the DonutChart object
        this.donutChart = new DonutChart(width / 2 + 322, height / 2 - 80, 
                    364, 0.55) // x, y, size, center hole 
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

        if(!this.loaded || !this.donutChart) {
            console.log("Donut chart or object not ready");
            return;
        };

        background(255);
        this.donutChart.draw(
            marketShares,
            companyNames,
            colours,
            "Mobile Vendor Market Share United Kingdom", // Main Title

            //subtitle
            "The UK's most popular mobile phone brands - data from April 2025",

            //Legend Title
            "Percentage by companies"
        );

    };
    
};