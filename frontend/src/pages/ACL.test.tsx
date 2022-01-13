/**
 * @jest-environment jsdom
 */

import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import React from "react";

import { TestWrapper } from "../utils/TestWrapper";

import { ACL } from "./ACL";

afterEach(() => {
  jest.clearAllMocks();
});

test("should match snapshot", async () => {
  const acl = {
    name: "acl1",
    objtype: "type1",
    is_public: false,
    default_permission: 1,
    acltypes: [
      {
        id: 1,
        name: "type1",
      },
    ],
    members: [
      {
        id: 1,
        name: "member1",
        type: 1,
        current_permission: 1,
      },
    ],
  };

  /* eslint-disable */
  jest.spyOn(require("../utils/AironeAPIClient"), "getACL").mockResolvedValue({
    json() {
      return Promise.resolve(acl);
    },
  });
  /* eslint-enable */

  // wait async calls and get rendered fragment
  const result = render(<ACL />, {
    wrapper: TestWrapper,
  });
  await waitForElementToBeRemoved(screen.getByTestId("loading"));

  expect(result).toMatchSnapshot();
});
