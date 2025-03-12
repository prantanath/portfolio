export interface publication{
  title:string,
  authors:string;
  journal:string;
  year:number;
  link:string;
}

export interface project{
  title:string,
  description:string,
  technologies:string[],
  link:string,
  live:string,
}
