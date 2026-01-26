// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://kubashop.vercel.app";

  // Importa tus categorías (ajusta la ruta según tu estructura)
  const { CATEGORIES } = await import("@/components/NavBarData");

  // Filtra la categoría de prueba
  const activeCategories = CATEGORIES.filter((cat) => cat.slug !== "prueba");

  // Crea entradas para cada categoría
  const categoryEntries = activeCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Páginas estáticas importantes
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },

    // Agrega otras páginas que tengas
  ];

  return [...staticPages, ...categoryEntries];
}
