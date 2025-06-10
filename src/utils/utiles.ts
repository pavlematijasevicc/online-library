export function checkEmail(email: string): string | null {
  
  const errors = [];
    if (email.length === 0) 
        {
            return 'Unijeli ste prazan email!!!';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return "Email nije u ispravnom formatu.";
} else
return ""
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