import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiValidateCode } from '@/lib/schema.js';
import type { SetupValidateOnFormSubmitReturns, SetupValidateOnFormSubmitValues, SetupValidateProps } from '@/types/config-ui.d.ts';

/**
 * Setup validate.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupValidate(props: SetupValidateProps) {
  const { homebridge, selectedMethod, setCurrentPage } = props;

  const {
    control,
    formState,
    handleSubmit,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      otpCode: '',
    },
    resolver: zodResolver(configUiValidateCode),
  });

  /**
   * Setup validate - On form submit.
   *
   * @param {SetupValidateOnFormSubmitValues} values - Values.
   *
   * @returns {SetupValidateOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit = async (values: SetupValidateOnFormSubmitValues): SetupValidateOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const validateResponse = await homebridge.request('/validate', {
        deviceName: `${homebridge.serverEnv.env.homebridgeInstanceName}.${Date.now()}`,
        otpCode: values.otpCode,
      });

      // If response is not successful, stop here.
      if (!validateResponse.success) {
        homebridge.toast.error('Failed to validate. Check the Homebridge logs for more information.');

        return;
      }

      // Move to the next page.
      setCurrentPage((previousPage) => previousPage + 1);
    } catch (error) {
      homebridge.toast.error('Failed to validate. Check the browser console for more information.');

      console.error(error);
    } finally {
      homebridge.hideSpinner();
    }
  };

  return (
    <>
      <section>
        <h3>Step 3 - Validate Code</h3>
        <p>
          Enter the requested code that was sent to
          {' '}
          <strong>{selectedMethod}</strong>
          . Be mindful that the verification code will generally expire in a few minutes after being sent.
        </p>
      </section>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className="mb-3">
          <Controller
            name="otpCode"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => ((
              <>
                <label htmlFor={field.name}>
                  <div className="form-label visually-hidden">Verification code:</div>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="form-control text-center"
                    placeholder="------"
                    maxLength={6}
                  />
                </label>
                <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                  {(fieldState.error) ? fieldState.error.message : 'Enter the 6-digit verification code received.'}
                </div>
              </>
            ))}
          />
        </div>
        <div className="d-flex">
          <button
            type="submit"
            className="btn btn-primary ml-0"
            disabled={formState.isSubmitting}
            aria-disabled={formState.isSubmitting}
          >
            {(formState.isSubmitting) ? 'Validating...' : 'Validate'}
          </button>
          <button
            type="button"
            className="btn btn-elegant"
            onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
          >
            Back
          </button>
        </div>
      </form>
    </>
  );
}
