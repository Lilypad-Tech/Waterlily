import { useCallback, useState } from 'react';
import {
  StableDiffusionContext,
  defaultStableDiffusionState,
  StableDiffusionContextType,
} from './StableDiffusionContext';

function useStableDiffusion() {
  const [stableDiffusion, setStableDiffusion] =
    useState<StableDiffusionContextType>(defaultStableDiffusionState);

  const runStableDiffusionJob = useCallback(() => {
    setStableDiffusion({ ...stableDiffusion, loading: true });
  }, [setStableDiffusion]);
}
