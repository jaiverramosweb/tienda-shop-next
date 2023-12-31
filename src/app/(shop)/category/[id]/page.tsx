import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;

interface Props {
  params: {
    id: Category;
  };
}

export default function ({ params }: Props) {
  const { id } = params;

  const products = seedProducts.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: "pata hombres",
    women: "para mujeres",
    kid: "para ninos",
    unisex: "pata todos",
  };

  // if (id == "kids") {
  //   notFound();
  // }
  return (
    <>
      <Title
        title={`Articulos de ${labels[id]}`}
        subtitle="Todos los productos "
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
