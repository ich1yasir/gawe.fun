
// <MenuItem value={10}>Banking</MenuItem>
// <MenuItem value={20}>Finance</MenuItem>
// <MenuItem value={30}>Retail</MenuItem>
// <MenuItem value={40}>Industrial</MenuItem>
// <MenuItem value={50}>Restaurant</MenuItem>
// <MenuItem value={60}>Workshop</MenuItem>
// <MenuItem value={70}>Healthcare</MenuItem>
const formatDate = (m) => {
    var dateString =
    m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2) + " " +
    ("0" + m.getUTCHours()).slice(-2) + ":" +
    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    ("0" + m.getUTCSeconds()).slice(-2);
    return dateString
}
export default formatDate