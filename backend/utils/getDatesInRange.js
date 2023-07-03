module.exports.getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const date = new Date(start.getTime());
    let list = []
    while(date <= end) {
      list.push(new Date(date).getTime())
      date.setDate(date.getDate()+1)
    }
    return list;
  }