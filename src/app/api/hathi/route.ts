import { NextResponse } from "next/server";
import { matchRegex, pause } from "@/app/helper/dataDownloader";

import fs from "fs";

const BASE_URL = "http://creatingdata.us/data/scatter/hathi/tiles/";

const getData = async (url: string) => {
  let data = "";
  const res = await fetch(url);
  data += res.json;
  return data;
};

export async function GET() {
  const tileFolders = await matchRegex(`${BASE_URL}/`, /href="([0-9]*)\/"/g);
  //   console.log(tileFolders);
  for (let j = 5; j < tileFolders.length; j++) {
    const tileFolder = tileFolders[j];

    const subFolders = await matchRegex(
      `${BASE_URL}/${tileFolder}/`,
      /href="([0-9]*)\/"/g
    );
    for (let i = 0; i < subFolders.length; i++) {
      const subFolder = subFolders[i];

      const files = await matchRegex(
        `${BASE_URL}/${tileFolder}/${subFolder}/`,
        /href="([0-9]*.tsv)"/g
      );

      for (let k = 0; k < files.length; k++) {
        const file = files[k];
        const fileUrl = `${BASE_URL}/${tileFolder}/${subFolder}/${file}`;
        console.log(fileUrl);
        await pause(500);

        const fileData = await getData(fileUrl);
        console.log(fileData);
        fs.writeFileSync(`data/${tileFolder}-${subFolder}-${file}`, fileData);
      }
    }
  }
  return NextResponse.json({ message: "hello" });
}
