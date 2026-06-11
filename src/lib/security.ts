/**
 * Video havolalarini xavfsiz shifrlash va deshifrlash uchun utilitlar.
 * Ushbu kod static string qidiruvlaridan himoyalangan va timing-based debugger detektoriga ega.
 */

// Shifrlash kaliti: "SanchoAcademySecureVideoKey2026_!!!"
// Kalit static qidiruvlarda ko'rinmasligi uchun charCode massivida saqlanadi
const KEY_CODES = [
  83, 97, 110, 99, 104, 111, 65, 99, 97, 100, 101, 109, 121, 83, 101, 99, 117,
  114, 101, 86, 105, 100, 101, 111, 75, 101, 121, 50, 48, 50, 54, 95, 33, 33, 33
];

function getSecurityKey(): string {
  return KEY_CODES.map((code) => String.fromCharCode(code)).join('');
}

/**
 * Serverda video havolasini shifrlash (XOR + Base64 + Reverse)
 */
export function encryptVideoUrl(url: string): string {
  if (!url) return '';
  
  const key = getSecurityKey();
  let xorResult = '';
  
  for (let i = 0; i < url.length; i++) {
    xorResult += String.fromCharCode(url.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  
  // Node.js muhitida ishlaganligi sababli Buffer yordamida base64 ga o'tkazamiz
  const base64 = Buffer.from(xorResult, 'binary').toString('base64');
  
  // Shifrni murakkablashtirish uchun teskari o'giramiz
  const reversed = base64.split('').reverse().join('');
  
  return 'SEC_' + reversed;
}

/**
 * Brauzerda video havolasini deshifrlash.
 * Timing check detektori mavjud: Agar kimdir debugger orqali qadam-baqadam tekshirsa, 
 * jarayon sekinlashadi va soxta (Rickroll) havola qaytariladi.
 */
export function decryptVideoUrl(encoded: string): string {
  if (!encoded) return '';
  if (!encoded.startsWith('SEC_')) {
    return encoded; // Agar shifrlanmagan bo'lsa (masalan Admin yoki Localhost uchun)
  }

  // Timing check boshlanishi
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;

  // Debugger trap: agar F12 ochiq bo'lsa, bu yerda to'xtaydi
  try {
    (function() {
      return false;
    }
    // eslint-disable-next-line no-eval
    .constructor('debugger')());
  } catch {}

  try {
    const key = getSecurityKey();
    const stripped = encoded.substring(4);
    
    // 1. Teskari o'girilgan matnni tiklash
    const base64 = stripped.split('').reverse().join('');
    
    // 2. Base64 dan decode qilish
    const binary = typeof window !== 'undefined' 
      ? window.atob(base64) 
      : Buffer.from(base64, 'base64').toString('binary');
      
    // 3. XOR decode qilish
    let result = '';
    for (let i = 0; i < binary.length; i++) {
      result += String.fromCharCode(binary.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }

    // Timing check yakunlanishi
    const t1 = typeof performance !== 'undefined' ? performance.now() : 0;
    
    // Oddiy sharoitda ushbu kod 0.1ms dan tez ishlaydi. 
    // Agar debugger ochiq bo'lib, inson tekshirayotgan bo'lsa, vaqt farqi katta bo'ladi.
    if (t1 - t0 > 15) {
      // Shubhali faoliyat - Rickroll qaytaramiz!
      return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }

    return result;
  } catch {
    return '';
  }
}
