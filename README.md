# viz-blog-template

[viz-blog-template](https://github.com/dannyko/viz-blog-template) 

template for showcasing interactive visualizations via blog posts.

1. implemented as a standalone JavaScript function called viz_blog().
1. accepts a list of iframe URLs in array format and binds them to the existing DIV elements containing `data-type="true"` metadata (i.e. "key divs").
1. issues a console log statement if the number of URLs does not match the number DIVs.

algorithm design is summarized below:

1. each visualization is loaded as an iframe
1. horizontal line halfway down the window is used to measure the distances of each key div
1. current visualization starts fading out each when the nearest-neighboring visualization is within 100 pixels of the center-line
1. current visualization finishes fading out as soon as the nearest-neighboring visualization is within 50 pixels of the center-line
1. current visualization opacity is updated each time the page is scrolled.
1. these parameters are hard-coded for now, and there is also a new concept of a "center line" which is also hard-coded for now.
1. new visualizations are loaded at 100% opacity, allowing them to execute their normal "onload" event(s).