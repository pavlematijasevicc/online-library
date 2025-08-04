export function checkEmail(email: string): string | null {
  if (email.trim().length === 0) {
    return 'Morate unijeti email!';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email nije u ispravnom formatu.';
  }

  return null; // validan email
}

export default function checkJmbg(jmbg: string):string | null{

  if(jmbg.length===0){
    return "Morate unijeti JMBG!";
  }

  if (!/^\d{13}$/.test(jmbg)) {
    return "JMBG mora sadrzati samo cifre bez drugih oznaka!";
  }

  return null; // Sve je u redu
}


export function checkPassword(password: string): string | null {
  const errors: string[] = [];

  if (password.length === 0) 
        {
            errors.push('Unijeli ste prazan password!!!');
            return  `${errors}`
        }

  if (password.length < 8) {
    errors.push("lozinka mora imati najmanje 8 karaktera");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("lozinka mora sadržati najmanje jedno malo slovo");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("lozinka mora sadržati najmanje jedno veliko slovo");
  }
  if (!/[\W_]/.test(password)) {
    errors.push("lozinka mora sadržati najmanje jedan specijalni karakter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("lozinka mora sadržati najmanje jedan broj");
  }

  return errors.length > 0 ? `Neispravan password: ${errors.join(", ")}.` : null;
}

export function checkIme(ime: string): string | null {
  const errors: string[] = [];

  if (ime.length === 0) 
        {
            errors.push('Morate unijeti Ime!');
            return  `${errors}`
        }

  return null;
}

export function checkUsername(username: string):string | null{
  const errors: string[]=[];

  if(username.length===0){
    errors.push('Morate unijeti username!');
    return  `${errors}`
    }
  return null;
}

export function checkPrezime(prezime: string): string | null {
  const errors: string[] = [];

  if (prezime.length === 0) 
        {
            errors.push('Morate unijeti Prezime!');
            return  `${errors}`
        }

  return null;
}

export function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

export  function stringToColor(string: string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

   export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

 export type Order = 'asc' | 'desc'

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}


export function checkBookName(ime: string): string | null {
  const errors: string[] = [];

  if (ime.length === 0) 
        {
            errors.push('Morate unijeti naziv knjige!');
            return  `${errors}`
        }

  return null;
}

export function checkDescription(description: string | number): string | null {
  if (!description || description === "") {
    return "Morate napisati kratak sazetak!";
  }
  return null;
}

export function checkAuthors(authors: number[]): string | null {
  if (!authors || authors.length === 0) {
    return "Morate izabrati autore!";
  }
  return null;
}

export function checkQuantity(quantity: number | null): string | null {
  if (!quantity || quantity<1) {
    return "Morate unijeti kolicinu knjiga!";
  }
  return null;
}

export function checkPages(pages: number | null): string | null {
  if (!pages || pages<10) {
    return "Morate unijeti broj stranica!";
  }
  return null;
}

export function checkIsbn(isbn: string | number): string | null {
  if (!isbn || isbn === "") {
    return "Morate unijeti ISBN knjige!";
  }
  return null;
}