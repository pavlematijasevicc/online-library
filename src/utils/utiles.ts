export function checkEmail(email: string): string | null {
  
  const errors = [];
    if (email.length === 0) 
        {
            errors.push('Unijeli ste prazan email!!!');
            return  `${errors}`
        }
    

  const hasAtSymbol = email.includes("@");
  const hasDotAfterAt = hasAtSymbol && email.split("@")[1]?.includes(".");
  const validLocalPart = email.split("@")[0]?.length > 0;
  const validDomainPart = hasDotAfterAt && email.split("@")[1].split(".")[0]?.length > 0;
  const validTld = hasDotAfterAt && email.split("@")[1].split(".")[1]?.length > 0;



  if (!hasAtSymbol) errors.push("nedostaje znak '@'");
  if (!validLocalPart) errors.push("nedostaje dio prije '@'");
  if (!validDomainPart) errors.push("nedostaje dio između '@' i '.'");
  if (!validTld) errors.push("nedostaje završetak poput '.com'");

  return errors.length > 0 ? `Neispravan email: ${errors.join(", ")}.` : null;
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

  return errors.length > 0 ? `Neispravan password: ${errors.join(", ")}.` : null;
}

