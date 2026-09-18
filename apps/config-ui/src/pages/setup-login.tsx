import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiLogin, configUiLoginResponse } from '../../../../packages/homebridge-adt-pulse/src/lib/schema';

import type {
  SetupLoginControl,
  SetupLoginForm,
  SetupLoginFormState,
  SetupLoginHandleSubmit,
  SetupLoginOnFormSubmit,
  SetupLoginOnFormSubmitInitializeResponse,
  SetupLoginOnFormSubmitMethodsResponse,
  SetupLoginOnFormSubmitParsedMethodsResponse,
  SetupLoginOnFormSubmitReturns,
  SetupLoginOnFormSubmitValues,
  SetupLoginProps,
  SetupLoginProps_Homebridge,
  SetupLoginProps_SetAvailableMethods,
  SetupLoginProps_SetCurrentPage,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup Login - Setup Login.
 *
 * Collects the portal region, username, and password, then asks the plugin backend to
 * start a session so the wizard can continue with verification and sensor detection.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupLogin(props: SetupLoginProps) {
  const homebridge: SetupLoginProps_Homebridge = props['homebridge'];
  const setAvailableMethods: SetupLoginProps_SetAvailableMethods = props['setAvailableMethods'];
  const setCurrentPage: SetupLoginProps_SetCurrentPage = props['setCurrentPage'];

  const form: SetupLoginForm = useForm({
    mode: 'onTouched',
    defaultValues: {
      subdomain: '',
      username: '',
      password: '',
    },

    resolver: zodResolver(configUiLogin),
  });
  const control: SetupLoginControl = form.control;
  const formState: SetupLoginFormState = form.formState;
  const handleSubmit: SetupLoginHandleSubmit = form.handleSubmit;

  /**
   * Pages - Setup Login - Setup Login - On Form Submit.
   *
   * Sends the entered credentials to the plugin backend to initialize the session,
   * then loads the available verification methods to decide which page comes next.
   *
   * @param {SetupLoginOnFormSubmitValues} values - Values.
   *
   * @returns {SetupLoginOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit: SetupLoginOnFormSubmit = async (values: SetupLoginOnFormSubmitValues): SetupLoginOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const initializeResponse: SetupLoginOnFormSubmitInitializeResponse = await homebridge.request('/initialize', {
        subdomain: values['subdomain'],
        username: values['username'],
        password: values['password'],
      });

      // If response is not successful, stop here.
      if (initializeResponse.success === false) {
        homebridge.toast.error('Failed to initialize. Check the Homebridge logs for more information.');

        return;
      }

      const methodsResponse: SetupLoginOnFormSubmitMethodsResponse = await homebridge.request('/get-methods');
      const parsedMethodsResponse: SetupLoginOnFormSubmitParsedMethodsResponse = configUiLoginResponse.safeParse(methodsResponse);

      // If response is not successful, stop here.
      if (methodsResponse.success === false || parsedMethodsResponse.success === false) {
        homebridge.toast.error('Failed to get available methods. Check the Homebridge logs for more information.');

        return;
      }

      // If verification is not required.
      if (parsedMethodsResponse.data['info']['status'] === 'not-required') {
        setCurrentPage(4); // Sensors page.

        return;
      }

      // Set available methods for use with requesting a code.
      setAvailableMethods(parsedMethodsResponse.data['info']['methods']);

      // Move to the next page.
      setCurrentPage((previousPage) => previousPage + 1);
    } catch (error) {
      homebridge.toast.error('Failed to login. Check the browser console for more information.');

      console.error(error);
    } finally {
      homebridge.hideSpinner();
    }

    return;
  };

  return (
    <>
      <section>
        <h3>Step 1 - Login to Portal</h3>
        <p>Fill in the required fields to login to the ADT Pulse web portal. In the next steps, the plugin will go through the multi-factor authentication process and initialize all supported sensors for you.</p>
      </section>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className="mb-3">
          <Controller
            name="subdomain"
            control={control}
            defaultValue=""
            render={(renderProps) => ((
              <>
                <label htmlFor={renderProps.field.name} className="d-block">
                  <div className="form-label">
                    Portal Region
                    {' '}
                    <strong className="text-danger">*</strong>
                  </div>
                  <select
                    id={renderProps.field.name}
                    name={renderProps.field.name}
                    value={renderProps.field.value}
                    onChange={renderProps.field.onChange}
                    onBlur={renderProps.field.onBlur}
                    className={(renderProps.fieldState.error !== undefined) ? 'form-select border-danger' : 'form-select'}
                  >
                    <option value="">— Select one —</option>
                    <option value="portal">United States 🇺🇸</option>
                    <option value="portal-ca">Canada 🇨🇦</option>
                  </select>
                </label>
                <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                  {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Select the portal region based on where you are subscribed in.'}
                </div>
              </>
            ))}
          />
        </div>
        <div className="d-flex flex-column flex-md-row gap-md-3">
          <div className="w-100">
            <div className="mb-3">
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={(renderProps) => ((
                  <>
                    <label htmlFor={renderProps.field.name} className="d-block">
                      <div className="form-label">
                        Username
                        {' '}
                        <strong className="text-danger">*</strong>
                      </div>
                      <input
                        type="text"
                        id={renderProps.field.name}
                        name={renderProps.field.name}
                        value={renderProps.field.value}
                        onChange={renderProps.field.onChange}
                        onBlur={renderProps.field.onBlur}
                        className={(renderProps.fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. user@example.com"
                        maxLength={100}
                        required
                      />
                    </label>
                    <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                      {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Provide the username you use to login to the portal.'}
                    </div>
                  </>
                ))}
              />
            </div>
          </div>
          <div className="w-100">
            <div className="mb-3">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={(renderProps) => ((
                  <>
                    <label htmlFor={renderProps.field.name} className="d-block">
                      <div className="form-label">
                        Password
                        {' '}
                        <strong className="text-danger">*</strong>
                      </div>
                      <input
                        type="password"
                        id={renderProps.field.name}
                        name={renderProps.field.name}
                        value={renderProps.field.value}
                        onChange={renderProps.field.onChange}
                        onBlur={renderProps.field.onBlur}
                        className={(renderProps.fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. Mys7r0nG!P@ssw0rd"
                        maxLength={300}
                        required
                      />
                    </label>
                    <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                      {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Provide the password you use to login to the portal.'}
                    </div>
                  </>
                ))}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={formState.isSubmitting}
          aria-disabled={formState.isSubmitting}
        >
          {(formState.isSubmitting === true) ? 'Signing in...' : 'Sign in to ADT Pulse'}
        </button>
      </form>
    </>
  );
}

export default SetupLogin;
