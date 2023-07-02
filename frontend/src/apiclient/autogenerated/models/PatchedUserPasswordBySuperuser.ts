/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface PatchedUserPasswordBySuperuser
 */
export interface PatchedUserPasswordBySuperuser {
  /**
   *
   * @type {string}
   * @memberof PatchedUserPasswordBySuperuser
   */
  newPasswd?: string;
  /**
   *
   * @type {string}
   * @memberof PatchedUserPasswordBySuperuser
   */
  chkPasswd?: string;
}

/**
 * Check if a given object implements the PatchedUserPasswordBySuperuser interface.
 */
export function instanceOfPatchedUserPasswordBySuperuser(
  value: object
): boolean {
  let isInstance = true;

  return isInstance;
}

export function PatchedUserPasswordBySuperuserFromJSON(
  json: any
): PatchedUserPasswordBySuperuser {
  return PatchedUserPasswordBySuperuserFromJSONTyped(json, false);
}

export function PatchedUserPasswordBySuperuserFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PatchedUserPasswordBySuperuser {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    newPasswd: !exists(json, "new_passwd") ? undefined : json["new_passwd"],
    chkPasswd: !exists(json, "chk_passwd") ? undefined : json["chk_passwd"],
  };
}

export function PatchedUserPasswordBySuperuserToJSON(
  value?: PatchedUserPasswordBySuperuser | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    new_passwd: value.newPasswd,
    chk_passwd: value.chkPasswd,
  };
}
