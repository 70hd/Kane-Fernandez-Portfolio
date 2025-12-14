// components/funnel/ui/cn.js
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}