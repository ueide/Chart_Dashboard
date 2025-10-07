function OverView() {
    this.iconPath = "assets/icons/iconOverview.svg";
    this.navTitle = "Overview";
    this.id = 'over-view';

    this.setup = function () {
        // Dynamically add titles inside chart boxes based on gallery
        document.querySelectorAll('.chart-box').forEach(box => {
            const id = box.getAttribute('data-target');
            const visual = gallery.visuals.find(v => v.id === id);
            if (visual && !box.querySelector('.chart-title')) {
                const title = document.createElement('span');
                title.className = 'chart-title';
                title.textContent = visual.navTitle;
                box.appendChild(title);
            }
        });
    };

    this.destroy = function () {
        // Reset canvas styles
        imageMode(CORNER);
        rectMode(CORNER);
        textAlign(LEFT, BASELINE);
        textSize(12);
        fill(0);
        stroke(0);
        strokeWeight(1);
    };

    this.draw = function () {
    };
}
