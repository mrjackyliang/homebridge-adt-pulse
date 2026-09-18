import React from 'react';
import { Controller } from 'react-hook-form';

import type {
  SettingsLoginProps,
  SettingsLoginProps_Control,
  SettingsLoginProps_GetValues,
  SettingsLoginRenderPasswordField,
  SettingsLoginRenderPasswordFieldState,
  SettingsLoginRenderSubdomainField,
  SettingsLoginRenderSubdomainFieldState,
  SettingsLoginRenderUsernameField,
  SettingsLoginRenderUsernameFieldState,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings Login - Settings Login.
 *
 * Renders the portal region, username, and password fields for the login
 * step of the plugin settings wizard so users can supply the credentials
 * required to authenticate with the ADT Pulse portal.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsLogin(props: SettingsLoginProps) {
  const control: SettingsLoginProps_Control = props['control'];
  const getValues: SettingsLoginProps_GetValues = props['getValues'];

  return (
    <>
      <div className="mb-3">
        <Controller
          name="subdomain"
          control={control}
          defaultValue={getValues('subdomain')}
          render={(renderProps) => {
            const field: SettingsLoginRenderSubdomainField = renderProps.field;
            const fieldState: SettingsLoginRenderSubdomainFieldState = renderProps.fieldState;

            return (
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
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={(fieldState.error !== undefined) ? 'form-select border-danger' : 'form-select'}
                  >
                    <option value="portal">United States 🇺🇸</option>
                    <option value="portal-ca">Canada 🇨🇦</option>
                  </select>
                </label>
                <div className={(fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                  {(fieldState.error !== undefined) ? fieldState.error.message : 'Select the portal region based on where you are subscribed in.'}
                </div>
              </>
            );
          }}
        />
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <Controller
              name="username"
              control={control}
              defaultValue={getValues('username')}
              render={(renderProps) => {
                const field: SettingsLoginRenderUsernameField = renderProps.field;
                const fieldState: SettingsLoginRenderUsernameFieldState = renderProps.fieldState;

                return (
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
                        className={(fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. user@example.com"
                        maxLength={100}
                        required
                      />
                    </label>
                    <div className={(fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                      {(fieldState.error !== undefined) ? fieldState.error.message : 'Provide the username you use to login to the portal.'}
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <Controller
              name="password"
              control={control}
              defaultValue={getValues('password')}
              render={(renderProps) => {
                const field: SettingsLoginRenderPasswordField = renderProps.field;
                const fieldState: SettingsLoginRenderPasswordFieldState = renderProps.fieldState;

                return (
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
                        className={(fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                        placeholder="e.g. Mys7r0nG!P@ssw0rd"
                        maxLength={300}
                        required
                      />
                    </label>
                    <div className={(fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                      {(fieldState.error !== undefined) ? fieldState.error.message : 'Provide the password you use to login to the portal.'}
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsLogin;
