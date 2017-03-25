export default function (_date) {
  const date = _date instanceof Date ? _date : new Date(_date);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const months = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];
  return `${months[month]} ${day}, ${year}`;
}
