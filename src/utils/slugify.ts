export const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')       // replace spaces with dashes
    .replace(/[^\w-]+/g, '');   // remove non-word characters
};

