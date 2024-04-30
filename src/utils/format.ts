export function formatTitle(title: string) {
  let temp = title;
  const mikanStartStr = 'Mikan Project - ';
  if (title.startsWith(mikanStartStr)) {
    temp = title.split(mikanStartStr)[1];
  }
  temp = temp.replace(/[\\/:*?<>|]/g, ' ');
  return temp;
}
