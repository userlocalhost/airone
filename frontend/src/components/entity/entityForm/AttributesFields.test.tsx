/**
 * @jest-environment jsdom
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import React from "react";
import { useForm } from "react-hook-form";

import { schema } from "../../entry/entryForm/EntryFormSchema";

import { AttributesFields } from "./AttributesFields";
import { Schema } from "./EntityFormSchema";

import { TestWrapper } from "TestWrapper";

describe("AttributesFields", () => {
  const defaultValues: Schema = {
    name: "hoge",
    note: "fuga",
    isToplevel: false,
    webhooks: [],
    attrs: [],
  };

  test("should provide attributes fields editor", () => {
    const {
      result: {
        current: { control, getValues, setValue },
      },
    } = renderHook(() =>
      useForm<Schema>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues,
      })
    );

    render(
      <AttributesFields
        control={control}
        setValue={setValue}
        referralEntities={[]}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.queryAllByPlaceholderText("属性名")).toHaveLength(0);

    // add first attribute
    act(() => {
      screen.getByRole("button").click();
    });

    expect(screen.queryAllByPlaceholderText("属性名")).toHaveLength(1);

    // edit first attribute
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("属性名"), {
        target: { value: "attr1" },
      });
    });

    expect(screen.getByPlaceholderText("属性名")).toHaveValue("attr1");
    expect(getValues("attrs.0.name")).toEqual("attr1");

    // add second attribute
    act(() => {
      // now there is 1 attribute, and each webhook has 6 buttons (note, type, up, down, delete, add)
      // click the add button of the first webhook
      screen.getAllByRole("button")[5].click();
    });

    expect(screen.queryAllByPlaceholderText("属性名")).toHaveLength(2);

    // delete first attribute
    act(() => {
      // now there is 1 attribute, and each webhook has 6 buttons (note, type, up, down, delete, add)
      // click the add button of the first webhook
      screen.getAllByRole("button")[4].click();
    });

    expect(screen.queryAllByPlaceholderText("属性名")).toHaveLength(1);

    expect(screen.getByPlaceholderText("属性名")).toHaveValue("");
    expect(getValues("attrs.0.name")).toEqual("");
  });
});
