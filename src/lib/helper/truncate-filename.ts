  export function truncateFileName(filename: string, maxLength = 25) {
  if (filename.length <= maxLength) return filename;

  const extIndex = filename.lastIndexOf(".");
  const ext =
    extIndex !== -1 ? filename.slice(extIndex) : "";

  const name =
    extIndex !== -1
      ? filename.slice(0, extIndex)
      : filename;

  const visibleLength = maxLength - ext.length - 3; // "..."

  return name.slice(0, visibleLength) + "..." + ext;
}