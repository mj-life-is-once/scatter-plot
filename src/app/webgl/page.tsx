import fs from "fs";

// const getData = async () => {
//   const tileFolders = await matchRegex(`${BASE_URL}/`, /href="([0-9]*)\/"/g);
//   //   console.log(tileFolders);
//   for (let j = 5; j < tileFolders.length; j++) {
//     const tileFolder = tileFolders[j];

//     const subFolders = await matchRegex(
//       `${BASE_URL}/${tileFolder}/`,
//       /href="([0-9]*)\/"/g
//     );
//     for (let i = 0; i < subFolders.length; i++) {
//       const subFolder = subFolders[i];

//       const files = await matchRegex(
//         `${BASE_URL}/${tileFolder}/${subFolder}/`,
//         /href="([0-9]*.tsv)"/g
//       );

//       for (let k = 0; k < files.length; k++) {
//         const file = files[k];
//         const fileUrl = `${BASE_URL}/${tileFolder}/${subFolder}/${file}`;
//         console.log(fileUrl);
//         await pause(500);

//         const fileData = await fetch("http://localhhost:3000/api/hathi");
//         console.log(fileData);
//         // fs.writeFileSync(
//         //   `data/${tileFolder}-${subFolder}-${file}`,
//         //   fileData.data
//         // );
//       }
//     }
//   }
// };

const Page = async () => {
  return (
    <section className="relative">
      <div className="container max-w-3xl mx-auto my-10 px-4 py-4 sm:px-6">
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            WebGL
          </h1>
          <p className="text-lg  max-w-md mx-auto">
            This page explores the different ways to visualise data despending
            on the number of datapoints
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;

/*

()();

*/
