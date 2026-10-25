/**
 * Retire known legacy business claims when displaying older CMS documents.
 * This is limited to membership/qualification wording: never rewrite product
 * values, standards, URLs, identifiers, contact details or stored CMS records.
 */
export function publicBusinessCopy<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(
        /one of (?:only )?(?:five|5) IAGI Installer Members (?:across the entire African continent|in Africa|on the (?:African )?continent)/gi,
        "an IAGI Installer Member",
      )
      .replace(/\(?one of (?:only )?(?:five|5) in Africa\)?/gi, "Group Installer Membership")
      .replace(
        /IAGI[- ]certified installation procedures/gi,
        "approved material-specific installation procedures",
      )
      .replace(/IAGI[- ]certified field lining/gi, "specialist field lining")
      .replace(/IAGI[- ]certified installer/gi, "IAGI Installer Member")
      .replace(/IAGI[- ]certified methods/gi, "approved project installation methods")
      .replace(/IAGI[- ]certified (?:field )?installation/gi, "specialist installation")
      .replace(
        /IAGI[- ]certified (?:welding |field )?(?:crews|teams|technicians)/gi,
        "specialist installation crews",
      )
      .replace(
        /ensuring every project meets global geomembrane welding and QA\/QC standards/gi,
        "supporting specialist installation and documented quality controls",
      )
      .replace(
        /guaranteeing professional, leak-free installations/gi,
        "supporting controlled installation and documented handover",
      ) as T;
  }
  if (Array.isArray(value)) return value.map((item) => publicBusinessCopy(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        /(?:url|slug|image|icon|email|phone|telephone|id|standard|specification)/i.test(key)
          ? item
          : publicBusinessCopy(item),
      ]),
    ) as T;
  }
  return value;
}
