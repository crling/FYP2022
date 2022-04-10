/* group an array of dictionaries by column key*/
export function groupBy(array: any[], key: string): Record<string, any> {
    return array.reduce((r, x) => {
                (r[x[key]] = r[x[key]] || []).push(x);
                return r;
                }, {});
  }

/* get the distinct values of the dictionary array with the key*/
export function getGroups(data: any[], key: string): string[] {
  return data.reduce((a, x) => {
      if (a.indexOf(x[key]) < 0) a.push(x[key]);
      return a;
  }, []);
}

/* get distinct values of the array*/
export function getDistinctValues (arr: any[]): any[] {
  return arr.reduce((r, x) => {
      if (!r.includes(x)) r.push(x);
      return r;
      }, []);
}
