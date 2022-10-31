import fs from "fs";

const serverStart = (): void => {
  const protocol: string = "http";
  const host: string = "localhost";
  const serverPort: number = Number(process.env.SERVER_PORT ?? 8080);
  const clientPort: number = Number(process.env.CLIENT_PORT ?? 8081);

  const serverURL = `${protocol}://${host}:${serverPort}`;
  const clientURL = `${protocol}://${host}:${clientPort}`;

  // 파일 저장 경로 유무 확인 & 없으면 디렉토리 생성
  const uploadPath = __dirname + "/../upload/";
  !fs.existsSync(uploadPath) && fs.mkdirSync(uploadPath);

  const log = `
🅽 🅾 🅳 🅴  🆂 🅴 🆁 🆅 🅴 🆁
✘ Server: ${serverURL}
✘ Client: ${clientURL}
`;

  console.log(log);
};

export default serverStart;
