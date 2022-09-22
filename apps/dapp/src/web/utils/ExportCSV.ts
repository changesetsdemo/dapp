export function exportCSV(header: any, data: any[]) {
  try {
    data.unshift(header);

    let csvString = '';
    data.map((item: any) => {
      Object.keys(header).map(key => {
        const value: any = item[key];
        csvString += value + ',';
      });
      csvString += '\r\n';
    });

    csvString = 'data:application/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvString);

    let btn = document.createElement('a');
    btn.setAttribute('href', csvString);
    btn.setAttribute('download', 'dreamExchangeRecords.csv');
    btn.innerText = '';

    const setStyle = (dom: any, styles: any = {}) => {
      Object.keys(styles).map(key => {
        dom.style[key] = styles[key];
      });
      return dom;
    };

    // 设置按钮的样式
    btn = setStyle(btn, {
      width: 0,
      height: 0,
      position: 'fixed',
      zIndex: -1,
      opacity: 1,
    });

    document.body.appendChild(btn);
    btn.click();
    document.body.removeChild(btn);
  } catch (error) {
    console.error(error);
  }
}
