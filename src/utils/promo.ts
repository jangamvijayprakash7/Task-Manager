export type PromoMessageType = 'success' | 'error' | null;

export interface PromoSetters {
  setPromoApplied: (applied: boolean) => void;
  setPromoMessage?: (message: string | null) => void;
  setPromoMessageType?: (type: PromoMessageType) => void;
  setPromoCode?: (code: string) => void;
}

// Pure helper to validate and apply promo codes
export function validateAndApplyPromo(code: string, setters: PromoSetters): boolean {
  const normalized = code.trim().toUpperCase();
  const { setPromoApplied, setPromoMessage, setPromoMessageType, setPromoCode } = setters;

  if (normalized === 'SAVE10') {
    setPromoApplied(true);
    setPromoCode?.(normalized);
    setPromoMessage?.('Promo applied! You saved 10%.');
    setPromoMessageType?.('success');
    return true;
  }

  setPromoApplied(false);
  setPromoCode?.('');
  setPromoMessage?.('Invalid promo code. Please check and try again.');
  setPromoMessageType?.('error');
  return false;}

// Pure helper to remove/clear applied promo state
export function removePromo(setters: PromoSetters): void {
  const { setPromoApplied, setPromoMessage, setPromoMessageType, setPromoCode } = setters;
  setPromoApplied(false);
  setPromoCode?.('');
  setPromoMessage?.(null);
  setPromoMessageType?.(null);
}


