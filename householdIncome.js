
function HouseholdIncome(){

    //Name for the visualisation to appear in the menu bar.
    //An icon to go next to the name
    this.iconPath = "assets/icons/iconMoney.svg";
    this.navTitle = "Household Income";
    // Each visualisation must have a unique ID with no special characters.
    this.id = 'household-income';

    // Title to display above the plot.
    this.title = 'Household Income in the United Kingdom';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    var pyramidObj = [];
    var maxRange = 0;

    this.preload = function(){
        var self = this;
        this.data = loadTable(
            'data/pyramid-Chart/household_income.csv', 'csv', 'header',

            function(){
                self.loaded = true; // check this.loaded to true.

                //get max 'Range' data value
                for (let i = 0; i < self.data.getRowCount(); i++) {
                    let percent = int(self.data.getString(i, 'range'));
                    if (percent > maxRange) {
                        maxRange = percent;
                    };
                };

                //Obj pyramid chart
                for(let i = 0; i < self.data.getRowCount(); i++){
                    let percent = int(self.data.getString(i, 'range'));
                    let money = self.data.getString(i, 'money');
                    pyramidObj.push({
                        percent: percent,
                        money: money,
                        level: String.fromCharCode(69 - i)
                    });
                };
            });
    };

    this.setup = function() {
        if(!this.loaded) {
        console.log('pyramid chart data not yet loaded');
        return;
        };
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
            console.log("pyramid chart data not yet loaded");
            return;
        }

        //Title
        fill(38);
        noStroke();
        textAlign(LEFT);
        textSize(22);
        textStyle(BOLD);
        text(this.title, 350, 100);

        //Legend Title
        textSize(16);
        text("Weekly Household Income", 350, 228);

        //Subtitle
        textSize(18);
        textStyle(NORMAL);
        text("Weekly earnings of UK residents - data from 2024.", 350, 134);

        //Pyramid chart settings 
        let xCenter = 900; //xPyramidCenter
        let yBase = 580; 
        let pyramidHeight = 388; //totalPyramidHeight
        let baseWidth = 456;
        let rowCount = pyramidObj.length;

        let colors = ['#B2EBF5', '#67C6D9', '#20B0CD', '#2FA2C7', '#4692baff']; 

        let currentY = yBase;  //currentDrawingY
        let minSliceHeight = 47;  
        let maxHeightScale = 60;  //additionalHeightScale


        for(let i = 0; i < rowCount; i++) { 
            let chartPy = pyramidObj[i];
            let percent = chartPy.percent; //----------------- usa ???
            let money = chartPy.money; //------ usa????
            let level = chartPy.level;

            let proportionalSliceHeight = minSliceHeight + 
                    map(percent, 0, maxRange, 0, maxHeightScale);

            let sliceBottomY = currentY;
            let sliceTopY = currentY - proportionalSliceHeight;

            let currentBottomWidth = map(yBase - sliceBottomY, 0, pyramidHeight, baseWidth, 0);
            let currentTopWidth = map(yBase - sliceTopY, 0, pyramidHeight, baseWidth, 0);

            if(sliceTopY <= yBase - pyramidHeight) {
                currentTopWidth = 0;
            }

            //Draw pyramid
            fill(colors[i]); 
            stroke(255); 
            strokeWeight(2); 

            //Pyramid slices
            quad( 
                xCenter - currentTopWidth / 2, sliceTopY,
                xCenter + currentTopWidth / 2,  sliceTopY,
                xCenter + currentBottomWidth / 2, sliceBottomY,
                xCenter - currentBottomWidth / 2, sliceBottomY
            );

            //Pyramid legend (subtitle)
            let legendX = 357;
            let legendY = 272;
            let legendSpace = 64;
            let legY = legendY + (i * legendSpace);

            fill(38);
            noStroke();
            textSize(20);
            textStyle(BOLD)
            textAlign(CENTER, CENTER);
            //label over the chart
            text(level, xCenter, sliceTopY + (proportionalSliceHeight / 2));

            text(level, legendX, legY); //'E', 'D', 'C', 'B', 'A'

            //description
            textSize(16); 
            textStyle(NORMAL);
            textAlign(LEFT, CENTER);
            text(percent + '%', legendX + 30, legY)
            text(money, legendX + 80, legY);

            currentY -= proportionalSliceHeight;
        };

    };
}