import React from 'react';
import { Controller } from 'react-hook-form';

import type { SettingsLoginProps } from '@/types/config-ui.d.ts';

/**
 * Settings login.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SettingsLogin(props: SettingsLoginProps) {
  const { control, getValues } = props;

  return (
    <>
      <div className="mb-3">
        <Controller
          name="subdomain"
          control={control}
          defaultValue={getValues('subdomain')}
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
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                >
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
      <div className="row g-3 mx-0">
        <div className="col pl-0">
          <div className="mb-3">
            <Controller
              name="username"
              control={control}
              defaultValue={getValues('username')}
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
        <div className="col pr-0">
          <div className="mb-3">
            <Controller
              name="password"
              control={control}
              defaultValue={getValues('password')}
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
    </>
  );
}
