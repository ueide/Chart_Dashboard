
function DonutChart(x, y, diameter, centerHole) {

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.centerHole = centerHole;
    this.labelSpace = 52;
    this.hoverIndex = -1;  
    this.labels = [];
    this.colours = [];


    //convert data in radian angles
    this.get_radians = function(data) {
        var total = sum(data); //sum of all data values
        var radians = [];

        for(let i = 0; i < data.length; i++) {
            //calculate the angle -- 360 degrees = TWO PI
            radians.push((data[i] / total) * TWO_PI);
        }
        return radians;
    };

    //Draw
    this.draw = function(data, labels, colours, title, subtitle, legendTitle) {

        //store data for legend
        this.donutData = data;
        this.labels = labels;
        this.colours = colours;

        //check the data
        if(data.length === 0) {
            console.log("Donut Chart data is empty");
            return;
        }
        if (![labels, colours].every((array) => array.length === data.length)) {
            console.error(`DonutChart: Data (length: ${data.length}),
            Labels (length: ${labels.length}),
            Colours (length: ${colours.length}).
            Arrays must be the same length!`);
            return;
        }

        var angles = this.get_radians(data);
        var lastAngle = 0; // Tracks the end of a angle

        let totalAngle = 0;
        this.hoverIndex = -1;

        //hover
        for(let i = 0; i < data.length; i++) {
            let angleStart = lastAngle;
            let angleEnd = lastAngle + angles[i];
            let dX = mouseX - this.x;
            let dY = mouseY - this.y;
            let d = sqrt(dX * dX + dY * dY);
            let angle = atan2(dY, dX);

            //Check if the mouse is hover the donut arc
            if(angle < 0) angle += TWO_PI;
            if(d < this.diameter / 2 && d > this.diameter * this.centerHole / 2 
                && angle >= angleStart && angle < angleEnd) {
                    this.hoverIndex = i;
                }
                lastAngle += angles[i];
        };

        lastAngle = 0; //reset
        //Loop for draw the arc
        for(let i = 0; i < data.length; i++) {
            fill(colours[i]);
            stroke(255);
            strokeWeight(3);

            //Draw the arc
            arc(this.x, this.y,
                this.diameter, this.diameter,
                lastAngle, lastAngle + angles[i] + 0.001,
                PIE // Draw as a pie slice from center
            );

            //Update lastAngle for next arc
            lastAngle += angles[i];
        };

        //The center hole is a white circle
        fill(255);
        noStroke();
        ellipse(this.x, this.y, 
            this.diameter * this.centerHole, 
            this.diameter * this.centerHole
        );
        
        //Text on the center of the donut
        if(this.hoverIndex !== -1) { //check if it's hover
            let val = data[this.hoverIndex];
            let label = labels[this.hoverIndex];
            let total = sum(data);
            let percent = (val / total * 100).toFixed(2) + "%";

            fill(38);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(20);
            textStyle(BOLD);
            text(percent, this.x, this.y - 8);

            //percentage
            textSize(18);
            textStyle(NORMAL);
            text(label, this.x, this.y + 20);
        }


        // Titles and Legend
        //Man Title
        fill(38);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(22);
        textStyle(BOLD);
        text(title, 350, 100);

        //Legend Title
        textSize(16);
        text(legendTitle, 350, 196);

        //Subtitle
        textSize(18);
        textStyle(NORMAL);
        text(subtitle, 350, 130);

        //Draw the legend items
        for (var i = 0; i < data.length; i++) {
            //cal the function
            this.makeLegend(data[i], labels[i], 
                colours[i], i === this.hoverIndex, i);
        };

    }; // end draw

    this.makeLegend = function(value, label, colour, isHighlighted, index) {
        
        var x = 350;
        var y = 232 + (this.labelSpace * index); // Legend Y
        var boxSize = 20; // legend box colour

        //Draw Highlighting
        if(isHighlighted) {
            fill(255, 0, 0, 40);
            noStroke();
            rect(x - 10, y - 8, 236, boxSize + 16, 8);
        }

        //Color Box
        fill(colour);
        noStroke();
        rect(x, y, boxSize, boxSize, 4);

        //Label text
        fill(38);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(16);
        textStyle(NORMAL);
        text(label, x + boxSize + 16, y + 3.5);

        //Percentage text
        let total = sum(this.donutData);
        let percentage = (value / total) * 100;
        textAlign(RIGHT, TOP);
        text(percentage.toFixed(2) + '%', x + 216, y + 3.5);
    };
};
