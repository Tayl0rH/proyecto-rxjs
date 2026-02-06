// IMPORTS
const { fromEvent, of } = rxjs;
const { fromFetch } = rxjs.fetch;
const { switchMap, catchError, map, filter } = rxjs.operators;

// cogemos todos los valores que necesitemos del HTML
let select = document.getElementById('selections');
let button = document.getElementById('btn-form');
let viewer = document.getElementById('viewer');

// damos valor a todos los valores del JSON
let data$ = fromFetch('data/data.json').pipe(switchMap
    (response => {
        return response.json();
    })
);

// subscribimos los sections con los datos
// para que cada 
data$.subscribe(sections => {
    sections.forEach(sec => {
        // hacer una función con esto
        const option = document.createElement('option');
        option.value = sec.id;
        option.textContent = sec.title;
        select.appendChild(option); 
    });
});

// Evento al hacer click en el boton
fromEvent(button, 'click').pipe(
    map(() => select.value), // Obtenemos el ID seleccionado
    switchMap(selectID => data$.pipe(
        map(sections => sections.find(s => s.id == selectID))
    ))
).subscribe(section => {
    if (section) {
        mostrarEnPantalla(section);
    }
});

// función para mostrar los datos de la sección
function mostrarEnPantalla(seccion) {
    // Limpiamos el visualizador
    viewer.innerHTML = `
        <h2>${seccion.title}</h2>
        <img src="${seccion.image}" alt="${seccion.title}" id="img-style">
        <div id="info-content"></div>
    `;

    // recuperamos el div creado antes para poder meter el contenido de
    // la sección
    const contentDiv = document.getElementById('info-content');

    contentDiv.innerHTML = `<p>${seccion.content}</p>`;
    
}