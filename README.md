# Raycasting Study

This technique consist of moving a block (player) on a 2D map and "cast" rays until rays hit a wall. For each pixel of wall hitted, render an equivalent rectangle in another canvas. All this rectangles (with ther correct color and size based on player distance) makes the impression of a fake 3D.

[DEMO](https://daniofilho.com.br/estudo/raycasting-study/)

# Install

Install Typescript globally:

`npm install -g typescript`

And run:

`npm start`

## Errors

If you have error running, try to create a folder `dist`. Sometimes browserify throws an errors if the folder doesn't exist.

## References

[A Técnica de Ray-Casting - Márcio Sarroglia Pinho](https://www.inf.pucrs.br/~pinho/CG/Aulas/Iluminacao/RayTracing.pdf)

[Raycasting Basics with JavaScript - Gustavo Pezzi](https://courses.pikuma.com/courses/raycasting)

[Make Your Own Raycaster Game - 3DSage](https://www.youtube.com/watch?v=gYRrGTC7GtA)

[Ray Casting em JavaScript - Angelito Goulart](https://github.com/angelitomg/raycasting/)

[Wolfenstein 3D's map renderer - Mat Godbolt](https://www.youtube.com/watch?v=eOCQfxRQ2pY)

[Ray casting HTML5 con JavaScript - Javier Muniz](https://github.com/javiermunizyt/raycasting-html5)

[Wolfenstein 3D - Madureira](https://github.com/madureira/wolfenstein)

[Lode's Computer Graphics Tutorial](https://lodev.org/cgtutor/index.html)
