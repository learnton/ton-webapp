/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface StepProps {
  label: React.ReactNode;
  content?: React.ReactNode;
  paused?: boolean;
  optional?: React.ReactNode;
  exec: (report: Report) => Promise<any>;
}
export interface Report {
  (error: Error | null, loading?: boolean, message?: string): void;
}

// eslint-disable-next-line react-refresh/only-export-components
const Steps = ({
  onDone,
  steps,
  start,
}: {
  start?: boolean;
  onDone?: () => void;
  beforeStart?: () => Promise<void>;
  steps: StepProps[];
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<Error | null>();
  const [status, setStatus] = useState<{
    message?: string;
    loading?: boolean;
  } | null>();
  const [execing, setExecing] = useState(start);
  const stepsRef = useRef<StepProps[]>(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const nextStep = useCallback(() => {
    setError(null);
    setStatus(null);

    setActiveStep(activeStep + 1);
  }, [activeStep]);

  const report = useCallback(
    (error: Error | null, loading?: boolean, message?: string): void => {
      if (error) {
        setError(error);
      } else {
        setStatus({ loading, message });
      }
    },
    []
  );

  useEffect(() => {
    if (!execing) return;

    if (activeStep >= stepsRef.current.length) return;

    if (stepsRef.current[activeStep].paused) {
      setExecing(false);

      return;
    }

    setStatus({ loading: true });
    stepsRef.current[activeStep]
      .exec(report)
      .then(() => {
        nextStep();
      })
      .catch((error) => {
        report(error);
        setExecing(false);
      })
      .finally(() => {
        setStatus({ loading: false });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, execing]);

  return (
    <>
      <ul className="steps steps-vertical">
        {steps.map(({ label }, index) => {
          let stepClass = activeStep > index ? " step-primary" : "";
          if (activeStep === index && !!error) {
            stepClass = " step-warning";
          }
          return (
            <li
              key={index}
              className={`step${stepClass}`}
              data-content={activeStep > index ? "✓" : undefined}
            >
              {label}
              <div className="text-text2 text-sm pl-12">
                {activeStep === index
                  ? error
                    ? error.message
                    : status
                    ? status?.message
                    : null
                  : null}
              </div>
            </li>
          );
        })}
      </ul>
      <button
        className="btn btn-block btn-primary"
        disabled={activeStep !== steps.length}
        onClick={onDone}
      >
        Finish
      </button>
    </>
  );
};

const exportComponent = React.memo(Steps);
export default exportComponent;
