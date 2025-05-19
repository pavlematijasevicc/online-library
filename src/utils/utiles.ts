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

