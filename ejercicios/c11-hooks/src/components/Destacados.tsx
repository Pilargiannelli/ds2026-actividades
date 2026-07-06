function Destacados() {
  const libros = [
    { titulo: "La tempestad", autor: "Shakespeare", img: "/img/tempestad_.jpg" },
    { titulo: "Nuestra señora de París", autor: "Victor Hugo", img: "/img/paris.webp" },
    { titulo: "El baile", autor: "Némirovsky", img: "/img/el-baile.webp" },
  ];

  return (
    <section className="py-5">
      <div className="container text-center">

        <h2>Libros destacados</h2>
        <p className="text-muted">
          Títulos imprescindibles seleccionados por nuestro equipo.
        </p>

        <div className="row mt-4">
          {libros.map((libro, i) => (
            <div key={i} className="col-md-4 mb-4">
              <img src={libro.img} className="img-fluid rounded mb-2" />
              <h5>{libro.titulo}</h5>
              <p className="text-muted">{libro.autor}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Destacados;