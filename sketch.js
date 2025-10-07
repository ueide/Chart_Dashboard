
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;
var canvas;

function setup() {
  // Create a canvas to fill the content div from index.html.

  canvasContainer = select('#app');
  canvas = createCanvas(1240, 980); //Canvas
  canvas.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new OverView()); 
  gallery.addVisual(new WorkplaceDiversity());
  gallery.addVisual(new TourismUk());
  gallery.addVisual(new AnnualEarnings());
  gallery.addVisual(new PopularSocialMedia());
  //new
  gallery.addVisual(new MobileMarket());
  gallery.addVisual(new HouseholdIncome());
  gallery.selectVisualById('over-view');
  document.getElementById('over-view').classList.add('selected');


  // Add click listeners to the chart boxes
document.querySelectorAll('.chart-box').forEach(box => {
  box.addEventListener('click', () => {
      const targetId = box.getAttribute('data-target');
      if (targetId) {
        // Update menu highlight
        document.querySelectorAll('.menu-item').forEach(item => {
          item.classList.remove('selected');
        });
        const matchingMenuItem = document.getElementById(targetId);
        if (matchingMenuItem) {
          matchingMenuItem.classList.add('selected');
        }
        gallery.selectVisualById(targetId);
      }
    });
  });

}


function draw() {
  background(255);

background(255);

  if (gallery.selectedVisual) {
    // Show HTML grid only on overview
    const overviewEl = document.getElementById('overview-container');
    if (gallery.selectedVisual.id === 'over-view') {
      overviewEl.style.display = 'block';
    } else {
      overviewEl.style.display = 'none';
    }

    if (gallery.selectedVisual.draw) {
      gallery.selectedVisual.draw();
    }
  }
}


