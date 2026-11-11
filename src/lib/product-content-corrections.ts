/** Remove a confirmed unit-mismatched duplicate; do not invent a replacement test value. */
export function correctFamilyContent(family: string, data: any) {
  if (!data || family !== "pp-polytape-silt-fence") return data;
  const corrected = { ...data };
  for (const key of ["propertiesTable", "properties"]) {
    const table = data[key];
    if (!Array.isArray(table?.rows)) continue;
    corrected[key] = {
      ...table,
      rows: table.rows.filter((row: unknown) => {
        if (!Array.isArray(row)) return true;
        return !(
          /water flow rate/i.test(String(row[0])) &&
          /g\s*\/\s*m[²2]/i.test(String(row[row.length - 1]))
        );
      }),
    };
  }
  return corrected;
}

/** Replace only the retired five-grade range summary; future CMS edits remain authoritative. */
export function correctDrainageOverview<T extends { description: string[] }>(
  category: string,
  data: T,
): T {
  if (category !== "pipes-drainage-ducting" || !Array.isArray(data.description)) return data;
  return {
    ...data,
    description: data.description.map((paragraph) =>
      paragraph.includes("five grades from 200 to 650")
        ? "GeoDrain Dimpled Drainage Boards & Geocomposites - DS 8-600 is a bare 8 mm HDPE sheet rated at 250 kN/m². GEO 8-250 combines an 8 mm core with filter geotextile at 250 kN/m²; GEO 10-400 combines a 10 mm core with filter geotextile at 400 kN/m². GR 20/200 is a perforated 20 mm green-roof drainage and water-storage board rated at 200 kN/m², with a separate filter geotextile where specified. Select the grade against the approved project design and current product datasheet."
        : paragraph,
    ),
  };
}
