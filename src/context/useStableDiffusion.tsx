import { useCallback, useState, useCallback } from 'react';
import {
  StableDiffusionContext,
  defaultStableDiffusionState,
  StableDiffusionContextType,
} from './StableDiffusionContext';

function useStableDiffusion(): StableDiffusionContextType {
  const [stableDiffusion, setStableDiffusion] =
    useState<StableDiffusionContextType>(defaultStableDiffusionState);

  const runStableDiffusionJob = useCallback(() => {
    setStableDiffusion({ ...stableDiffusion, loading: true });
  }, [setStableDiffusion]);
}
