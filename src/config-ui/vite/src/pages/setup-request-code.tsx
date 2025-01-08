import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiRequestCode } from '@/lib/schema.js';
import type { SetupRequestCodeOnFormSubmitReturns, SetupRequestCodeOnFormSubmitValues, SetupRequestCodeProps } from '@/types/config-ui.d.ts';

/**
 * Setup request code.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupRequestCode(props: SetupRequestCodeProps) {
  const {
    availableMethods,
    homebridge,
    setCurrentPage,
    setSelectedMethod,
  } = props;

  const {
    control,
    formState,
    handleSubmit,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      methodId: '',
    },
    resolver: zodResolver(configUiRequestCode),
  });

  /**
   * Setup request code - On form submit.
   *
   * @param {SetupRequestCodeOnFormSubmitValues} values - Values.
   *
   * @returns {SetupRequestCodeOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit = async (values: SetupRequestCodeOnFormSubmitValues): SetupRequestCodeOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const requestCodeResponse = await homebridge.request('/request-code', {
        methodId: values.methodId,
      });

      // If response is not successful, stop here.
      if (!requestCodeResponse.success) {
        homebridge.toast.error('Failed to request code. Check the Homebridge logs for more information.');

        return;
      }

      // Set the selected method shown in the next step.
      const selectedMethod = availableMethods.find((availableMethod) => availableMethod.id === values.methodId);

      if (selectedMethod === undefined) {
        homebridge.toast.error('Failed to set selected method. Check the Homebridge logs for more information.');

        return;
      }

      setSelectedMethod(selectedMethod.label);

      // Move to the next page.
      setCurrentPage((previousPage) => previousPage + 1);
    } catch (error) {
      homebridge.toast.error('Failed to request code. Check the browser console for more information.');

      console.error(error);
    } finally {
      homebridge.hideSpinner();
    }
  };

  return (
    <>
      <section>
        <h3>Step 2 - Select Method</h3>
        <p>A verification code is required to allow Homebridge to access your ADT Pulse account for the first time. Please select one of the following methods.</p>
      </section>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className="mb-3">
          <Controller
            name="methodId"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => ((
              <>
                <label htmlFor={field.name} className="d-block">
                  <div className="form-label">Request a verification code via:</div>
                  <select
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                  >
                    <option value="">— Select one —</option>
                    {
                      availableMethods.map((method) => (
                        <option value={method.id} key={method.id}>{method.label}</option>
                      ))
                    }
                  </select>
                </label>
                <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                  {(fieldState.error) ? fieldState.error.message : 'Select a method for where you would like to receive the verification code.'}
                </div>
              </>
            ))}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formState.isSubmitting}
          aria-disabled={formState.isSubmitting}
        >
          {(formState.isSubmitting) ? 'Requesting code...' : 'Request Code'}
        </button>
      </form>
    </>
  );
}
