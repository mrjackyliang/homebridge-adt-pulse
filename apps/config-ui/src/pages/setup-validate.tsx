import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiValidateCode } from '../../../../packages/homebridge-adt-pulse/src/lib/schema';

import type {
  SetupValidateControl,
  SetupValidateForm,
  SetupValidateFormState,
  SetupValidateHandleSubmit,
  SetupValidateOnFormSubmit,
  SetupValidateOnFormSubmitReturns,
  SetupValidateOnFormSubmitValidateResponse,
  SetupValidateOnFormSubmitValues,
  SetupValidateProps,
  SetupValidateProps_Homebridge,
  SetupValidateProps_SelectedMethod,
  SetupValidateProps_SetCurrentPage,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup Validate - Setup Validate.
 *
 * Collects the one-time verification code sent to the user's chosen contact method
 * and confirms it with the plugin backend so the wizard can continue to detect sensors.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupValidate(props: SetupValidateProps) {
  const homebridge: SetupValidateProps_Homebridge = props['homebridge'];
  const selectedMethod: SetupValidateProps_SelectedMethod = props['selectedMethod'];
  const setCurrentPage: SetupValidateProps_SetCurrentPage = props['setCurrentPage'];

  const form: SetupValidateForm = useForm({
    mode: 'onTouched',
    defaultValues: {
      otpCode: '',
    },

    resolver: zodResolver(configUiValidateCode),
  });
  const control: SetupValidateControl = form.control;
  const formState: SetupValidateFormState = form.formState;
  const handleSubmit: SetupValidateHandleSubmit = form.handleSubmit;

  /**
   * Pages - Setup Validate - Setup Validate - On Form Submit.
   *
   * Sends the entered verification code to the plugin backend for validation,
   * then advances the wizard to the next page once the portal accepts the code.
   *
   * @param {SetupValidateOnFormSubmitValues} values - Values.
   *
   * @returns {SetupValidateOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit: SetupValidateOnFormSubmit = async (values: SetupValidateOnFormSubmitValues): SetupValidateOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const validateResponse: SetupValidateOnFormSubmitValidateResponse = await homebridge.request('/validate', {
        instanceName: homebridge.serverEnv.env.homebridgeInstanceName,
        otpCode: values['otpCode'],
      });

      // If response is not successful, stop here.
      if (validateResponse.success === false) {
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

    return;
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
            render={(renderProps) => ((
              <>
                <label htmlFor={renderProps.field.name}>
                  <div className="form-label visually-hidden">Verification code:</div>
                  <input
                    type="text"
                    id={renderProps.field.name}
                    name={renderProps.field.name}
                    value={renderProps.field.value}
                    onChange={renderProps.field.onChange}
                    onBlur={renderProps.field.onBlur}
                    className="form-control text-center"
                    placeholder="------"
                    maxLength={6}
                  />
                </label>
                <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                  {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Enter the 6-digit verification code received.'}
                </div>
              </>
            ))}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formState.isSubmitting}
            aria-disabled={formState.isSubmitting}
          >
            {(formState.isSubmitting === true) ? 'Validating...' : 'Validate'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
          >
            Back
          </button>
        </div>
      </form>
    </>
  );
}

export default SetupValidate;
