const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const randomSuffix = (length = 4) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

const generateCompanySlug = (companyName: string) => {
  const base = slugify(companyName);
  return `${base}-${randomSuffix(4)}`;
};

export default generateCompanySlug;
