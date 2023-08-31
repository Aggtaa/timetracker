import moment from 'moment';

export function toDate(dt: moment.MomentInput): Date {
  return moment(moment(dt).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
}

export function mkDate(day: number, month: number, year?: number): Date {
  return new Date(year ?? new Date().getFullYear(), month - 1, day);
}

export type Token = {
  text: string,
  suffix: string,
  pos: number,
  fullText: string,
  length: number,
  fullLength: number,
}

export type SemiToken = Omit<Token, 'length' | 'fullLength' | 'fullText'>;

export function strToTokens(str: string): Token[] {
  const tokens: SemiToken[] = [];

  const isTokenChar = (ch: string) => !ch.match(/^[\s-]$/);

  let token: SemiToken;
  let lastChIsToken: boolean = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const chIsToken = isTokenChar(ch);
    if (isTokenChar(ch)) {
      if (!lastChIsToken) {
        token = { text: ch, suffix: '', pos: i };
        tokens.push(token);
      }
      else
        token.text += ch;
    }
    else {
      if (!lastChIsToken) { // non-trimmed string?
        token = { text: '', suffix: '', pos: i };
        tokens.push(token);
      }
      token.suffix += ch;
    }
    lastChIsToken = chIsToken;
  }
  return tokens.map((t) => ({
    ...t,
    fullText: t.text + t.suffix,
    length: t.text.length,
    fullLength: t.text.length + t.suffix.length,
  }));
}

export function tokensToStr(tokens: Token[]): string {
  return tokens.map((t) => t.text).join(' ');
}
