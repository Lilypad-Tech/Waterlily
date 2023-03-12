declare let window: any;
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { ethers } from 'ethers';
import { StatusState, StatusContext, defaultStatusState } from '.';
import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import { INITIAL_TRANSACTION_STATE } from '@/utils/definitions/consts';

interface StableDiffusionState {
  isLoading: boolean;
  isError: string | null;
  data?: any;
}

interface StableDiffusionContextValue {
  stableDiffusionState?: StableDiffusionState;
  setStableDiffusionState: Dispatch<SetStateAction<StableDiffusionState>>;
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
}

export const defaultStableDiffusionState = {
  stableDiffusionState: { isLoading: false, isError: null, data: null },
  setStableDiffusionState: () => {},
  runStableDiffusionJob: async () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const StableDiffusionContext =
  createContext<StableDiffusionContextValue>(defaultStableDiffusionState);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const sdTryCatch = {
//    try {
//       const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
//         value: imageCost,
//         gasLimit: gasLimit,
//       });

//       setStatusState({
//         ...statusState,
//         isLoading: 'Waiting for the transaction to be included in a block...',
//         isMessage: true,
//         message: {
//           title: `Transaction ${tx.hash} sent.`,
//           description:
//             'Waiting for the transaction to be included in a block...',
//         },
//       });

//       const receipt = await tx.wait();
//       console.log('receipt done', receipt);

//       setStatusState({
//         ...statusState,
//         isLoading: false,
//         isMessage: true,
//         message: {
//           title: `Transaction ${tx.hash} confirmed.`,
//           description: 'Transaction successfully mined.',
//         },
//       });
//     } catch (error: any) {
//       console.error(error);

//       setStatusState({
//         ...statusState,
//         isLoading: false,
//         isMessage: true,
//         message: {
//           title: 'Transaction failed.',
//           description: error.message,
//         },
//       });
//     }
// }

export const StableDiffusionContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [stableDiffusionState, setStableDiffusionState] =
    useState<StableDiffusionState>({
      isLoading: false,
      isError: null,
      data: null,
    });
  const { statusState = defaultStatusState.statusState, setStatusState } =
    useContext(StatusContext);

  useEffect(() => {
    console.log(statusState);
  }, [statusState]);

  const submitJob = async (
    prompt: string,
    artistid: string,
    // setStatusState: React.Dispatch<React.SetStateAction<StatusState>>,
    timeout: number = 60000 // default timeout of 60 seconds
  ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //connect to contract in write mode
    const waterlilyContract = new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    );

    const k = ethers.utils.parseUnits('0.1', 18); // Convert 100 to the appropriate unit of the token with 18 decimal places
    const imageCost = ethers.utils.parseEther('0.1');

    const gasLimit: string = ethers.utils.hexlify(9000000);

    // Set up a promise that will resolve after the specified timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error('Transaction timed out'));
      }, timeout)
    );

    try {
      setStatusState({
        ...statusState,
        isLoading: 'Submitting job to the network ...',
        isMessage: false,
        message: { title: '', description: '' },
      });

      const tx = await Promise.race([
        waterlilyContract.StableDiffusion(prompt, artistid, {
          value: k,
          gasLimit: gasLimit,
        }),
        timeoutPromise, // wait for either the transaction to be mined or the timeout to expire
      ]);

      if (tx instanceof Error) {
        throw tx; // if the promise was rejected due to a timeout, rethrow the error to handle it below
      }

      setStatusState({
        ...statusState,
        isLoading: `Waiting for the transaction ${tx.hash} to be included in a block...`,
        isMessage: false,
        message: { title: '', description: '' },
      });

      const receipt: ethers.ContractReceipt = await tx.wait();

      setStatusState({
        ...statusState,
        isLoading: '',
        isMessage: true,
        message: {
          title: `Transaction confirmed: ${receipt.transactionHash}`,
          description: 'Your job has been submitted to the network.',
        },
      });
    } catch (error: any) {
      if (error.message === 'Transaction timed out') {
        setStatusState({
          isError: 'Transaction timed out',
          isLoading: '',
          isMessage: true,
          message: {
            title: 'Transaction timed out',
            description:
              'The transaction took too long to confirm. Please try again later.',
          },
        });
      } else {
        setStatusState({
          isError: 'Transaction failed',
          isLoading: '',
          isMessage: true,
          message: {
            title: 'Transaction failed',
            description:
              'There was an error submitting your job to the network. Please try again later.',
          },
        });
      }
    }
  };

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    setStatusState({
      ...statusState,
      isLoading: 'Connecting to Waterlily Contract..',
    });
    if (!window.ethereum) {
      setStatusState({
        ...statusState,
        isMessage: true,
        message: {
          title: 'Web3 not available',
          description:
            'Please install and unlock a Web3 provider in your browser to use this application.',
        },
      });
      return;
    }
    submitJob(prompt, artistid, 80000);
    return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //connect to contract in write mode
    const waterlilyContract = new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    );

    const imageCost = ethers.utils.parseUnits('0.1', 18); // Convert 100 to the appropriate unit of the token with 18 decimal places
    // const imageCost = ethers.utils.parseEther('0.1');
    // estimate gas cost for the transaction
    // const estimatedGas = await provider.estimateGas({
    //   to: WATERLILY_CONTRACT_ADDRESS,
    //   value: imageCost,
    // });
    // const estimatedGasCost =
    //   await waterlilyContract.estimateGas.StableDiffusion(artistid, prompt);
    // console.log('estimated gas cost', estimatedGasCost);

    //GasLimit' field cannot be less than the cost of storing a message on chain 300000 < 417863"}}}'
    const gasLimit: string = ethers.utils.hexlify(9000000);
    setStatusState({
      ...statusState,
      isLoading: 'Submitting job to the network ...',
    });

    try {
      const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
        value: imageCost,
        gasLimit: gasLimit,
      });

      setStatusState({
        ...statusState,
        isLoading: 'Waiting for the transaction to be included in a block...',
        isMessage: true,
        message: {
          title: `Transaction ${tx.hash} sent.`,
          description:
            'Waiting for the transaction to be included in a block...',
        },
      });

      const receipt = await tx.wait();
      console.log('receipt done', receipt);

      setStatusState({
        ...statusState,
        isLoading: 'Receipt confirmed. Running on Bacalhau',
        isMessage: true,
        message: {
          title: `Transaction ${tx.hash} confirmed. Receipt: ${receipt}`,
          description: 'Transaction successfully mined.',
        },
      });
    } catch (error: any) {
      console.error(error);

      setStatusState({
        ...statusState,
        isLoading: false,
        isMessage: true,
        message: {
          title: 'Transaction failed.',
          description: error.message,
        },
      });
    }

    // waterlilyContract
    //   .StableDiffusion(prompt, artistid, {
    //     value: imageCost,
    //     gasLimit: gasLimit,
    //   })
    //   .then(async (tx: ethers.ContractTransaction) => {
    //     console.log('stable diffusion res', tx);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: `Waiting for the transaction ${tx.hash} to be included in a block ...`,
    //       //could include blockExplorer link here with tx
    //     });
    //     const receipt: ethers.ContractReceipt = await tx.wait();
    //     console.log('receipt done', receipt);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: '',
    //       isMessage: true,
    //       message: {
    //         title: `tx: ${receipt}`,
    //         description: 'got tx',
    //       },
    //     });

    //     //   await tx
    //     //     .wait()
    //     //     .then((receipt: any) => {
    //     //       console.log('TX done');
    //     //       setStatusState({
    //     //         ...statusState,
    //     //         isLoading: '',
    //     //         isMessage: true,
    //     //         message: {
    //     //           title: `tx: ${tx}`,
    //     //           description: 'got tx',
    //     //         },
    //     //       });
    //     //     })
    //     //     .catch((err: any) => {
    //     //       console.log('err in tx.wait()');
    //     //       setStatusState({
    //     //         ...statusState,
    //     //         isLoading: '',
    //     //         isError: `'An error occurred calling the contract stable diffusion method' ${err.message}`,
    //     //       });
    //     //     });
    //     //   //don't want to stop loading until results come back hmm
    //   })
    //   .catch((err: Error) => {
    //     console.log('err', err);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: '',
    //       isError:
    //         'An error occurred calling the contract stable diffusion method',
    //       // + err.code.toString() +
    //       // err.message +
    //       // err.data.message,
    //     });
    //   });

    // await delay(5000);
    // console.log('delay over', stableDiffusionState);
    // await fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('stable diffuion done', stableDiffusionState);
    //     setStableDiffusionState({ ...stableDiffusionState, data: data });
    //   })
    //   .finally(() => {
    //     setStableDiffusionState({ ...stableDiffusionState, isLoading: false });
    //   })
    //   .catch((err) => {
    //     console.log('err stable diffusion', err);
    //     setStableDiffusionState({
    //       isLoading: false,
    //       isError: err || 'error',
    //       data: null,
    //     });
    //   });
  };

  const stableDiffusionContextValue: StableDiffusionContextValue = {
    stableDiffusionState,
    setStableDiffusionState,
    runStableDiffusionJob,
  };

  return (
    <StableDiffusionContext.Provider value={stableDiffusionContextValue}>
      {children}
    </StableDiffusionContext.Provider>
  );
};
