export const fmt = (n: number, d = 2) => {
  const [int, dec] = Math.abs(n).toFixed(d).split(".")
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}