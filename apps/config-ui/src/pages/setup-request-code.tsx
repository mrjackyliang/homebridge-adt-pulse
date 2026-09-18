import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiRequestCode } from '../../../../packages/homebridge-adt-pulse/src/lib/schema';

import type {
  SetupRequestCodeControl,
  SetupRequestCodeForm,
  SetupRequestCodeFormState,
  SetupRequestCodeHandleSubmit,
  SetupRequestCodeOnFormSubmit,
  SetupRequestCodeOnFormSubmitRequestCodeResponse,
  SetupRequestCodeOnFormSubmitReturns,
  SetupRequestCodeOnFormSubmitSelectedMethod,
  SetupRequestCodeOnFormSubmitValues,
  SetupRequestCodeProps,
  SetupRequestCodeProps_AvailableMethods,
  SetupRequestCodeProps_Homebridge,
  SetupRequestCodeProps_SetCurrentPage,
  SetupRequestCodeProps_SetSelectedMethod,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup Request Code - Setup Request Code.
 *
 * Lets the user pick which multi-factor verification method should receive the
 * one-time code, then asks the plugin backend to send it before moving on.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupRequestCode(props: SetupRequestCodeProps) {
  const availableMethods: SetupRequestCodeProps_AvailableMethods = props['availableMethods'];
  const homebridge: SetupRequestCodeProps_Homebridge = props['homebridge'];
  const setCurrentPage: SetupRequestCodeProps_SetCurrentPage = props['setCurrentPage'];
  const setSelectedMethod: SetupRequestCodeProps_SetSelectedMethod = props['setSelectedMethod'];

  const form: SetupRequestCodeForm = useForm({
    mode: 'onTouched',
    defaultValues: {
      methodId: '',
    },

    resolver: zodResolver(configUiRequestCode),
  });
  const control: SetupRequestCodeControl = form.control;
  const formState: SetupRequestCodeFormState = form.formState;
  const handleSubmit: SetupRequestCodeHandleSubmit = form.handleSubmit;

  /**
   * Pages - Setup Request Code - Setup Request Code - On Form Submit.
   *
   * Sends the chosen verification method to the plugin backend so the portal can
   * deliver a one-time code, and records the method label for the next step.
   *
   * @param {SetupRequestCodeOnFormSubmitValues} values - Values.
   *
   * @returns {SetupRequestCodeOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit: SetupRequestCodeOnFormSubmit = async (values: SetupRequestCodeOnFormSubmitValues): SetupRequestCodeOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const requestCodeResponse: SetupRequestCodeOnFormSubmitRequestCodeResponse = await homebridge.request('/request-code', {
        methodId: values['methodId'],
      });

      // If response is not successful, stop here.
      if (requestCodeResponse.success === false) {
        homebridge.toast.error('Failed to request code. Check the Homebridge logs for more information.');

        return;
      }

      // Set the selected method shown in the next step.
      const selectedMethod: SetupRequestCodeOnFormSubmitSelectedMethod = availableMethods.find((availableMethod) => availableMethod['id'] === values['methodId']);

      if (selectedMethod === undefined) {
        homebridge.toast.error('Failed to set selected method. Check the Homebridge logs for more information.');

        return;
      }

      setSelectedMethod(selectedMethod['label']);

      // Move to the next page.
      setCurrentPage((previousPage) => previousPage + 1);
    } catch (error) {
      homebridge.toast.error('Failed to request code. Check the browser console for more information.');

      console.error(error);
    } finally {
      homebridge.hideSpinner();
    }

    return;
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
            render={(renderProps) => ((
              <>
                <label htmlFor={renderProps.field.name} className="d-block">
                  <div className="form-label">Request a verification code via:</div>
                  <select
                    id={renderProps.field.name}
                    name={renderProps.field.name}
                    value={renderProps.field.value}
                    onChange={renderProps.field.onChange}
                    onBlur={renderProps.field.onBlur}
                    className={(renderProps.fieldState.error !== undefined) ? 'form-select border-danger' : 'form-select'}
                  >
                    <option value="">— Select one —</option>
                    {
                      availableMethods.map((method) => (
                        <option value={method['id']} key={method['id']}>{method['label']}</option>
                      ))
                    }
                  </select>
                </label>
                <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                  {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Select a method for where you would like to receive the verification code.'}
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
          {(formState.isSubmitting === true) ? 'Requesting code...' : 'Request Code'}
        </button>
      </form>
    </>
  );
}

export default SetupRequestCode;
