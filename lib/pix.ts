const field = (id: string, value: string) => `${id}${String(value.length).padStart(2, "0")}${value}`;

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function createPixPayload({ key, receiver, city, amount, txid }: { key: string; receiver: string; city: string; amount: number; txid: string }) {
  const merchant = field("00", "BR.GOV.BCB.PIX") + field("01", key);
  const additional = field("05", txid.replace(/[^A-Z0-9]/g, "").slice(0, 25) || "***");
  const base = field("00", "01") + field("26", merchant) + field("52", "0000") + field("53", "986") + field("54", amount.toFixed(2)) + field("58", "BR") + field("59", receiver.slice(0, 25)) + field("60", city.slice(0, 15)) + field("62", additional) + "6304";
  return base + crc16(base);
}
