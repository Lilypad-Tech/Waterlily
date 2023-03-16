// import { Status } from './definitions/interfaces';
// import { errorMsg } from './messages';
// import { CID } from 'multiformats/cid';

// export const callBacalhauJob = async (promptInput: string) => {
//   //Bacalahau HTTP Stable Diffusion Endpoint
//   const url = 'http://dashboard.bacalhau.org:1000/api/v1/stablediffusion';
//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   };
//   const data = {
//     prompt: promptInput, //The user text prompt!
//   };
//   /* FETCH FROM BACALHAU ENDPOINT */
//   const cid = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: headers,
//   })
//     .then(async (res) => {
//       let body = await res.json();
//       if (body.cid) {
//         console.log(
//           'Bacalhau V1 CID',
//           `https://${body.cid}.ipfs.nftstorage.link`
//         );
//         // Bacalhau returns a V0 CID which we want to convert to a V1 CID
//         // for easier usage with http gateways (ie. displaying the image on-screen)
//         const cid = CID.parse(body.cid).toV1().toString();
//         return cid;
//       }
//     })
//     .catch((err) => {
//       console.log('error in bac job', err);
//       // return { status: 'ERR' };
//     });
//   return cid;
// };

// export const getImageBlob = async (
//   status: Status,
//   setStatus: Function,
//   imageHTTPURL: string // this is the imageHTTPURL will just be ipfs://cid for normal image
// ) => {
//   const r = await fetch(imageHTTPURL);
//   console.log('r', r);
//   if (!r.ok) {
//     // throw new Error(`error fetching image: [${r.statusText}]: ${r.status}`);
//     setStatus({
//       ...status,
//       loading: '',
//       error: errorMsg(r.statusText, 'Error fetching message'),
//     });
//   }
//   return r.blob();
// };

// //timeouts for long delays from the server
// export const withTimeout = (millis: number, promise: Promise<any>) => {
//   const timeout = new Promise((resolve, reject) =>
//     setTimeout(() => {
//       reject({ err: { message: `Timed out after ${millis} ms.` } });
//       console.log('timed out');
//     }, millis)
//   );
//   return Promise.race([promise, timeout]);
// };

// export const getExampleImage = async (status: Status, setStatus: Function) => {
//   const imageOriginUrl =
//     'https://bafkreic7fpje6mhilvneyigzxbrvl4h3qkxioov4wziqg42fhuccesvzcq.ipfs.nftstorage.link/';
//   const r = await fetch(imageOriginUrl);
//   if (!r.ok) {
//     // throw new Error(`error fetching image: [${r.statusText}]: ${r.status}`);
//     setStatus({
//       ...status,
//       loading: '',
//       error: errorMsg(r.statusText, 'Error fetching message'),
//     });
//   }
//   return r.blob();
// };
