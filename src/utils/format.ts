import { minimatch } from 'minimatch';

export function formatTitle(title: string) {
  let temp = title;
  const mikanStartStr = 'Mikan Project - ';
  if (title.startsWith(mikanStartStr)) {
    temp = title.split(mikanStartStr)[1];
  }
  temp = temp.replace(/[\\/:*?<>|"]/g, ' ');
  return temp;
}

function wildcardMatch(rule: string, title: string) {
  if (!rule) {
    return true;
  }

  let regExp = minimatch.makeRe(rule, {
    nocase: true,
    nonegate: true,
    nocomment: true,
    noglobstar: true,
  }) as RegExp;
  if (regExp.source.startsWith('^') && regExp.source.endsWith('$')) {
    regExp = new RegExp(regExp.source.substring(1, regExp.source.length - 1));
  }

  console.log(regExp, title);

  return regExp.test(title);
}

export function mustContainMatch(
  useRegex: boolean,
  rule: string,
  title: string,
) {
  if (!rule) {
    return true;
  }

  if (useRegex) {
    return new RegExp(rule).test(title);
  }

  const expList = rule.split('|');
  return expList.some(exp => {
    if (!exp) {
      return true;
    }
    const splitExpList = exp.split(/\s+/);
    return splitExpList.every(splitExp => {
      return wildcardMatch(splitExp, title);
    });
  });
}

export function mustNotContainMatch(
  useRegex: boolean,
  rule: string,
  title: string,
) {
  if (!rule) {
    return true;
  }

  if (useRegex) {
    return !new RegExp(rule).test(title);
  }

  const expList = rule.split('|');
  return !expList.some(exp => {
    if (!exp) {
      return true;
    }
    const splitExpList = exp.split(/\s+/);
    return splitExpList.every(splitExp => {
      return wildcardMatch(splitExp, title);
    });
  });
}
