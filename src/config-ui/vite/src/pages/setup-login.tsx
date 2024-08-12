import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { configUiLogin, configUiLoginResponse } from '@/lib/schema.js';
import type { SetupLoginOnFormSubmitReturns, SetupLoginOnFormSubmitValues, SetupLoginProps } from '@/types/config-ui.d.ts';

/**
 * Setup login.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupLogin(props: SetupLoginProps) {
  const { homebridge, setAvailableMethods, setCurrentPage } = props;

  const {
    control,
    formState,
    handleSubmit,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      subdomain: '',
      username: '',
      password: '',
    },
    resolver: zodResolver(configUiLogin),
  });

  /**
   * Setup login - On form submit.
   *
   * @param {SetupLoginOnFormSubmitValues} values - Values.
   *
   * @returns {SetupLoginOnFormSubmitReturns}
   *
   * @since 1.0.0
   */
  const onFormSubmit = async (values: SetupLoginOnFormSubmitValues): SetupLoginOnFormSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    try {
      homebridge.showSpinner();

      const initializeResponse = await homebridge.request('/initialize', {
        subdomain: values.subdomain,
        username: values.username,
        password: values.password,
      });

      // If response is not successful, stop here.
      if (!initializeResponse.success) {
        homebridge.toast.error('Failed to initialize. Check the Homebridge logs for more information.');

        return;
      }

      const methodsResponse = await homebridge.request('/get-methods');
      const parsedMethodsResponse = configUiLoginResponse.safeParse(methodsResponse);

      // If response is not successful, stop here.
      if (!methodsResponse.success || !parsedMethodsResponse.success) {
        homebridge.toast.error('Failed to get available methods. Check the Homebridge logs for more information.');

        return;
      }

      // If verification is not required.
      if (parsedMethodsResponse.data.info.status === 'not-required') {
        setCurrentPage(4); // Sensors page.

        return;
      }

      // Set available methods for use with requesting a code.
      setAvailableMethods(parsedMethodsResponse.data.info.methods);

      // Move to the next page.
      setCurrentPage((previousPage) => previousPage + 1);
    } catch (error) {
      homebridge.toast.error('Failed to login. Check the browser console for more information.');

      console.error(error);
    } finally {
      homebridge.hideSpinner();
    }
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
            render={({ field, fieldState }) => ((
              <>
                <label htmlFor={field.name} className="d-block">
                  <div className="form-label">
                    Portal Region
                    {' '}
                    <strong className="text-danger">*</strong>
                  </div>
                  <select
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                  >
                    <option value="">— Select one —</option>
                    <option value="portal">United States 🇺🇸</option>
                    <option value="portal-ca">Canada 🇨🇦</option>
                  </select>
                </label>
                <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                  {(fieldState.error) ? fieldState.error.message : 'Select the portal region based on where you are subscribed in.'}
                </div>
              </>
            ))}
          />
        </div>
        <div className="row g-3">
          <div className="col">
            <div className="mb-3">
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => ((
                  <>
                    <label htmlFor={field.name} className="d-block">
                      <div className="form-label">
                        Username
                        {' '}
                        <strong className="text-danger">*</strong>
                      </div>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={(fieldState.error) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. user@example.com"
                        maxLength={100}
                        required
                      />
                    </label>
                    <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                      {(fieldState.error) ? fieldState.error.message : 'Provide the username you use to login to the portal.'}
                    </div>
                  </>
                ))}
              />
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => ((
                  <>
                    <label htmlFor={field.name} className="d-block">
                      <div className="form-label">
                        Password
                        {' '}
                        <strong className="text-danger">*</strong>
                      </div>
                      <input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={(fieldState.error) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. Mys7r0nG!P@ssw0rd"
                        maxLength={300}
                        required
                      />
                    </label>
                    <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                      {(fieldState.error) ? fieldState.error.message : 'Provide the password you use to login to the portal.'}
                    </div>
                  </>
                ))}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formState.isSubmitting}
          aria-disabled={formState.isSubmitting}
        >
          {(formState.isSubmitting) ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  );
}
