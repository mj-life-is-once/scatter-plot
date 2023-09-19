export const generateCSV = (data: Array<any>) => {
  console.log(data);
  const titleKeys = Object.keys(data[0]);

  const refinedData = [];
  refinedData.push(titleKeys);
  // get keys

  data.forEach((item) => {
    refinedData.push(Object.values(item));
  });

  let csvContent = "";

  refinedData.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
  return URL.createObjectURL(blob);
};
