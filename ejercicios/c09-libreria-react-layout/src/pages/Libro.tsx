import { useParams } from "react-router-dom";

export default function Libro() {
  const { id } = useParams();

  return (
    <div className="container py-5">
      <h1>Detalle del libro {id}</h1>
    </div>
  );
}